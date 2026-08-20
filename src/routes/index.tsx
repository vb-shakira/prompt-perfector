import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, Copy, KeyRound, Loader2, Sparkles, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { debugPrompt, type DebugResult } from "@/lib/prompt-debug.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Prompt Debugging Agent — Fix Weak AI Prompts" },
      {
        name: "description",
        content:
          "Debug poorly performing AI prompts: see problems, an improved prompt, and a clear before/after comparison with explanations.",
      },
      { property: "og:title", content: "Prompt Debugging Agent" },
      {
        property: "og:description",
        content:
          "Improve weak AI prompts with before/after comparisons, identified problems and prompt engineering explanations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const TOTAL = 5;

type Slot = { prompt: string; result: DebugResult | null; error: string | null; loading: boolean };

const emptySlot = (): Slot => ({ prompt: "", result: null, error: null, loading: false });

function Index() {
  const [apiKey, setApiKey] = useState("");
  const [keyDraft, setKeyDraft] = useState("");
  const [keyError, setKeyError] = useState<string | null>(null);
  const [active, setActive] = useState(0);
  const [slots, setSlots] = useState<Slot[]>(() => Array.from({ length: TOTAL }, emptySlot));
  const [copied, setCopied] = useState(false);

  const run = useServerFn(debugPrompt);
  const slot = slots[active]!;

  const patch = (i: number, next: Partial<Slot>) =>
    setSlots((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...next } : s)));

  function connect() {
    const key = keyDraft.trim();
    if (!key) return setKeyError("Please enter your OpenAI API key to continue.");
    if (key.length < 20) return setKeyError("That doesn't look like a valid OpenAI API key.");
    setKeyError(null);
    setApiKey(key);
  }

  async function handleDebug() {
    const i = active;
    const prompt = slots[i]!.prompt.trim();
    if (!prompt) return patch(i, { error: "Please enter a prompt before debugging." });
    if (!apiKey) return patch(i, { error: "Missing API key. Please reconnect." });

    patch(i, { loading: true, error: null });
    try {
      const result = await run({ data: { apiKey, prompt } });
      patch(i, { result, loading: false });
    } catch (err) {
      patch(i, {
        loading: false,
        error: err instanceof Error ? err.message : "Unexpected error. Please try again.",
      });
    }
  }

  async function copyAfter(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  if (!apiKey) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <KeyRound className="size-5" />
            </span>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Prompt Debugging Agent</h1>
              <p className="text-sm text-muted-foreground">Connect to start debugging prompts</p>
            </div>
          </div>

          <Label htmlFor="apikey" className="text-sm font-medium">
            OpenAI API Key
          </Label>
          <Input
            id="apikey"
            type="password"
            autoComplete="off"
            placeholder="Enter your OpenAI API Key"
            className="mt-2"
            value={keyDraft}
            onChange={(e) => setKeyDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && connect()}
          />
          {keyError && <ErrorNote>{keyError}</ErrorNote>}
          <Button className="mt-5 w-full" onClick={connect}>
            Connect
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">
            Your key is kept only in this browser session, sent over HTTPS for each request, and
            never stored or logged.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/40">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-5">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="size-5" />
            </span>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Prompt Debugging Agent</h1>
              <p className="text-xs text-muted-foreground">
                Before / After prompt comparison with explanations
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setApiKey("")}>
            Change API key
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        <div className="flex flex-wrap items-center gap-2">
          {slots.map((s, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                i === active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40"
              }`}
            >
              Prompt {i + 1} of {TOTAL}
              {s.result ? " ✓" : ""}
            </button>
          ))}
        </div>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <Label htmlFor="prompt" className="text-sm font-medium">
            Enter Poorly Performing Prompt
          </Label>
          <Textarea
            id="prompt"
            rows={6}
            className="mt-2 resize-y"
            placeholder='e.g. "Tell me about AI"'
            value={slot.prompt}
            onChange={(e) => patch(active, { prompt: e.target.value, error: null })}
          />
          {slot.error && <ErrorNote>{slot.error}</ErrorNote>}
          <Button className="mt-4" onClick={handleDebug} disabled={slot.loading}>
            {slot.loading ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Debugging…
              </>
            ) : (
              "Debug Prompt"
            )}
          </Button>
        </section>

        {slot.result && (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <Card title="BEFORE" tone="muted">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{slot.result.before}</p>
              </Card>
              <Card
                title="AFTER"
                tone="primary"
                action={
                  <Button variant="outline" size="sm" onClick={() => copyAfter(slot.result!.after)}>
                    {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                }
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{slot.result.after}</p>
              </Card>
            </div>

            <Card title="Problems in the original prompt">
              <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed">
                {slot.result.problems.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </Card>

            <Card title="Why is the AFTER prompt better?">
              <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed">
                {slot.result.explanation.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
              <p className="mt-4 rounded-xl bg-primary/5 p-4 text-sm leading-relaxed">
                <span className="font-medium">Response quality: </span>
                {slot.result.responseQuality}
              </p>
            </Card>
          </>
        )}
      </div>
    </main>
  );
}

function ErrorNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
      <TriangleAlert className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

function Card({
  title,
  children,
  action,
  tone = "default",
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  tone?: "default" | "muted" | "primary";
}) {
  return (
    <div
      className={`rounded-2xl border bg-card p-6 shadow-sm ${
        tone === "primary" ? "border-primary/40" : "border-border"
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2
          className={`text-sm font-semibold tracking-wide uppercase ${
            tone === "primary" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {title}
        </h2>
        {action}
      </div>
      {children}
    </div>
  );
}

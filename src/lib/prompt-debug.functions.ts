import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  apiKey: z.string().trim().min(20, "API key looks too short").max(300),
  prompt: z.string().trim().min(1, "Prompt cannot be empty").max(4000),
});

export type DebugResult = {
  before: string;
  problems: string[];
  after: string;
  explanation: string[];
  responseQuality: string;
};

const SYSTEM = `You are an expert prompt engineer. Analyse a poorly performing prompt and return ONLY JSON matching:
{"problems":["..."],"after":"the improved prompt","explanation":["change -> why it helps"],"responseQuality":"why the improved prompt yields a better response"}
Rules: 4-7 concrete problems; the "after" prompt must be a complete, ready-to-use prompt applying clear instructions, context, task, audience, constraints, output format, tone and examples where useful; 4-6 explanation bullets; responseQuality is 2-4 sentences. No markdown fences.`;

function friendlyError(status: number, message: string) {
  if (status === 401) return "Invalid API key. Please check your OpenAI API key and try again.";
  if (status === 429)
    return "OpenAI rate limit or quota reached. Wait a moment and try again.";
  if (status === 400) return `OpenAI rejected the request: ${message}`;
  if (status >= 500) return "OpenAI is temporarily unavailable. Please retry shortly.";
  return message || "Something went wrong calling OpenAI.";
}

export const debugPrompt = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<DebugResult> => {
    let res: Response;
    try {
      res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.4,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: `Poorly performing prompt:\n"""${data.prompt}"""` },
          ],
        }),
      });
    } catch {
      throw new Error("Network error: could not reach OpenAI. Check your connection.");
    }

    if (!res.ok) {
      let message = "";
      try {
        const body = (await res.json()) as { error?: { message?: string } };
        message = body?.error?.message ?? "";
      } catch {
        message = await res.text().catch(() => "");
      }
      throw new Error(friendlyError(res.status, message));
    }

    const body = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = body.choices?.[0]?.message?.content ?? "";
    let parsed: Partial<DebugResult> & { problems?: unknown; explanation?: unknown };
    try {
      parsed = JSON.parse(content);
    } catch {
      throw new Error("Could not read the AI response. Please try again.");
    }

    const toList = (v: unknown): string[] =>
      Array.isArray(v) ? v.map((x) => String(x)).filter(Boolean) : v ? [String(v)] : [];

    return {
      before: data.prompt,
      problems: toList(parsed.problems),
      after: String(parsed.after ?? "").trim(),
      explanation: toList(parsed.explanation),
      responseQuality: String(parsed.responseQuality ?? "").trim(),
    };
  });

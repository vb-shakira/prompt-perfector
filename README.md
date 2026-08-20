# Prompt Perfector

Create a web app called "Prompt Debugging Agent" for my Generative AI assignment.

Assignment:

"Debugging Prompts – Fix 5 poorly performing prompts to improve response quality."

The app's main purpose is to take a poorly written AI prompt and improve it using prompt engineering techniques.

IMPORTANT API REQUIREMENT:

- When the app starts, ask me to enter my OpenAI API key.

- Provide a secure password-style input field labeled "OpenAI API Key".

- Do NOT hard-code any API key.

- Do NOT expose the API key in the frontend, source code, logs, or GitHub.

- Use the API key to call the OpenAI API securely.

- Do not proceed with prompt debugging until an API key has been provided.

- Show a clear message if the API key is missing or invalid.

MAIN FEATURES:

1. OpenAI API Key

- Input: "Enter your OpenAI API Key"

- Password-style field

- Connect/Continue button

- Validate that an API key has been entered.

- Show a clear error if it is missing or invalid.

2. Prompt Input

After the API key is provided, show:

- A large text box labeled "Enter Poorly Performing Prompt"

- A button called "Debug Prompt"

Example:

"Tell me about AI"

3. AI PROMPT DEBUGGING

When I click "Debug Prompt", send the prompt to the OpenAI API.

The AI must analyze the original prompt and produce:

A. BEFORE PROMPT

Display the exact original prompt entered by the user.

B. PROBLEMS IN THE PROMPT

Identify the problems in the original prompt, such as:

- Lack of clarity

- Lack of context

- Ambiguous instructions

- Missing target audience

- Missing constraints

- Missing output format

- Too broad or vague

- Missing examples when necessary

C. AFTER PROMPT

Create a significantly improved version of the original prompt.

The improved prompt should apply appropriate prompt engineering techniques, such as:

- Clear instructions

- Context

- Specific task

- Target audience

- Constraints

- Desired output format

- Tone

- Examples when useful

D. EXPLANATION

Explain clearly what was changed between the BEFORE and AFTER prompts and why each change improves the expected AI response.

E. RESPONSE QUALITY

Briefly explain why the improved prompt should produce a better response than the original prompt.

4. BEFORE/AFTER COMPARISON

The most important part of the application is the Before/After comparison.

Display them clearly side by side on desktop:

BEFORE

[Original prompt]

AFTER

[Improved prompt]

Below them show:

"Why is the AFTER prompt better?"

Then provide the explanation.

Add a Copy button for the improved prompt.

5. FIVE PROMPTS

Because my assignment requires 5 poorly performing prompts, allow me to debug up to 5 prompts.

Create a simple counter:

Prompt 1 of 5

Prompt 2 of 5

Prompt 3 of 5

Prompt 4 of 5

Prompt 5 of 5

Each prompt should generate its own:

- BEFORE prompt

- Problems identified

- AFTER prompt

- Explanation

- Why the improved prompt is better

The user should be able to work on each prompt separately.

6. DESIGN

Create a clean, modern and professional student-project UI.

Use:

- White/light background

- Blue accent color

- Rounded cards

- Clear typography

- Good spacing

- Responsive layout

- Professional AI-tool appearance

Keep the interface simple. Do not add unnecessary features.

7. ERROR HANDLING

Handle:

- Empty prompt

- Missing API key

- Invalid API key

- OpenAI API errors

- Network errors

- Rate limits

Show simple and understandable error messages.

8. FINAL REQUIREMENT

This is NOT just a static UI.

Make the OpenAI API integration functional.

The final application should allow me to:

Enter OpenAI API key

→ Enter a poorly performing prompt

→ Click "Debug Prompt"

→ Get BEFORE prompt

→ Get problems

→ Get AFTER improved prompt

→ Get explanation

→ Understand why the AFTER prompt is better

Do NOT add an assignment report generator.

Do NOT add unnecessary features.

Focus specifically on the "Before/After prompt comparisons + explanations" requirement of Assignment 2.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/816430ea-eb1c-43be-b4fd-f2cd8007904f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

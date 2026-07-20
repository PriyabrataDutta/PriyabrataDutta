import ShikiCode from "@/components/ShikiCode";

const AiEdgeFunctionBody = () => (
  <>
    <p>
      Inside an Edge Function, the{" "}
      <span className="font-mono text-primary">AI_GATEWAY_KEY</span> is
      injected into environment variables. You hit the gateway with a standard{" "}
      <span className="font-mono">fetch</span> and get OpenAI-compatible
      chat completions back — Gemini, GPT-4o, and open models.
    </p>
    <ShikiCode
      language="ts"
      code={`const res = await fetch(
  "https://api.openai.com/v1/chat/completions",
  {
    method: "POST",
    headers: {
      "Authorization": \`Bearer \${Deno.env.get("AI_GATEWAY_KEY")}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    }),
  }
);

const data = await res.json();
return data.choices[0].message.content;`}
    />
    <p>
      Two response cases worth handling explicitly: <span className="font-mono">429</span>{" "}
      (rate limit) and <span className="font-mono">401</span> (unauthorized).
      Surface both as actionable toasts on the client.
    </p>
  </>
);

export default AiEdgeFunctionBody;

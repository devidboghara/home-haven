export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "AI service not configured" }, { status: 503 });
    }

    const body = await request.json();
    const { type, data } = body as {
      type: "description" | "lead_score" | "draft_email";
      data: Record<string, unknown>;
    };

    let prompt: string;
    if (type === "description") {
      prompt = `Write a compelling real estate listing description for: ${JSON.stringify(data)}. Return only the description text.`;
    } else if (type === "lead_score") {
      prompt = `Analyze this real estate lead and score them as Hot, Warm, or Cold. Return JSON: {score, reasoning}. Lead data: ${JSON.stringify(data)}`;
    } else if (type === "draft_email") {
      prompt = `Draft a professional real estate email. Return JSON: {subject, body}. Context: ${JSON.stringify(data)}`;
    } else {
      return Response.json({ error: "Invalid type" }, { status: 400 });
    }

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return Response.json({ error: err }, { status: 500 });
    }

    const result = await res.json();
    const content = result.choices?.[0]?.message?.content ?? "";

    if (type === "description") {
      return Response.json({ result: content });
    }

    // For lead_score and draft_email, parse JSON from the response
    try {
      const parsed = JSON.parse(content);
      return Response.json(parsed);
    } catch {
      // If the model wrapped JSON in markdown code fences, strip them
      const stripped = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(stripped);
      return Response.json(parsed);
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}

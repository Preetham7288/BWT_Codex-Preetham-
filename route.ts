export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return Response.json({
        summary: "API key not configured.",
      });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You explain source code clearly. Summarize what the code does in 3-4 simple sentences. Focus on describing the behavior and logic of the program. Do not suggest improvements.",
          },
          {
            role: "user",
            content: code,
          },
        ],
      }),
    });

    const data = await response.json();

    const summary =
      data?.choices?.[0]?.message?.content ||
      "Unable to generate summary.";

    return Response.json({ summary });

  } catch (error) {
    return Response.json({
      summary: "Error analyzing the code.",
    });
  }
}
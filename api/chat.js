export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { model, messages, max } = req.body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: model || "llama-3.1-8b-instant",
        messages,
        max_tokens: max || 2048
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Groq API error"
      });
    }

    res.status(200).json({
      reply: data.choices?.[0]?.message?.content || ""
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
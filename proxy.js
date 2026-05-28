export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    const apiKey = process.env.OPENROUTER_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const response = await fetch('https://openrouter.io/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://swing-trading-platform.vercel.app',
        'X-Title': 'Swing Trading Platform',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-5-sonnet',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: `You are a swing trading research assistant. Answer trading questions briefly and directly (2-3 sentences max). Focus on: entry/exit levels, risk/reward ratios, sector themes, catalysts, and supply chain insights.\n\nContext: We track AI Infrastructure, Energy Transition, Memory Shortage, and Cyclical Recovery themes across India, US, and SE Asia markets.\n\nQuestion: ${message}`
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: data.error?.message || 'OpenRouter API error'
      });
    }

    const assistantMessage = data.choices[0].message.content;
    return res.status(200).json({ response: assistantMessage });
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: error.message });
  }
}

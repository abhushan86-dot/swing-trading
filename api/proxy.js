module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    const apiKey = process.env.OPENROUTER_KEY;

    if (!apiKey) {
      console.error('CRITICAL: OPENROUTER_KEY not found in environment');
      return res.status(500).json({ error: 'API key not configured' });
    }

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    const response = await fetch('https://openrouter.io/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://swing-trading-nine.vercel.app',
        'X-Title': 'Swing Trading Platform',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-5-sonnet',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: `You are a swing trading research assistant. Answer trading questions briefly and directly (2-3 sentences max).\n\nQuestion: ${message}`
          }
        ]
      })
    });

    let data;
    try {
      const text = await response.text();
      if (!text) {
        return res.status(500).json({ error: 'Empty response from OpenRouter API' });
      }
      data = JSON.parse(text);
    } catch (parseError) {
      return res.status(500).json({ 
        error: 'Failed to parse API response',
        details: text ? text.substring(0, 100) : 'empty'
      });
    }

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: data.error?.message || 'API error'
      });
    }

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return res.status(500).json({ error: 'Unexpected API response structure' });
    }

    return res.status(200).json({ response: data.choices[0].message.content });

  } catch (error) {
    return res.status(500).json({ error: `Server error: ${error.message}` });
  }
}

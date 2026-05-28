export default async function handler(req, res) {
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

    console.log('API Key exists:', !!apiKey);
    console.log('API Key length:', apiKey ? apiKey.length : 0);

    if (!apiKey) {
      console.error('OPENROUTER_KEY not found in environment');
      return res.status(500).json({ error: 'API key not configured on server' });
    }

    console.log('Calling OpenRouter API...');

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
            content: `You are a swing trading research assistant. Answer trading questions briefly and directly (2-3 sentences max). Focus on: entry/exit levels, risk/reward ratios, sector themes, catalysts, and supply chain insights.\n\nContext: We track AI Infrastructure, Energy Transition, Memory Shortage, and Cyclical Recovery themes across India, US, and SE Asia markets.\n\nQuestion: ${message}`
          }
        ]
      })
    });

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('Failed to parse response:', parseError);
      const text = await response.text();
      console.error('Response text:', text);
      return res.status(500).json({ 
        error: 'Invalid response from OpenRouter API',
        details: text.substring(0, 200)
      });
    }

    if (!response.ok) {
      console.error('OpenRouter error:', data);
      return res.status(response.status).json({ 
        error: data.error?.message || 'OpenRouter API error'
      });
    }

    const assistantMessage = data.choices[0].message.content;
    return res.status(200).json({ response: assistantMessage });
  } catch (error) {
    console.error('Proxy error:', error.message);
    return res.status(500).json({ error: `Server error: ${error.message}` });
  }
}

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages,
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    const rawText = await response.text();

    // Check if Groq responded with an error status code
    if (!response.ok) {
      console.error('Groq responded with error status:', response.status, rawText);
      return new Response(JSON.stringify({ text: '⚠️ Groq API responded with an error. Please try again.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (err) {
      console.error('JSON parse error:', err, rawText);
      return new Response(JSON.stringify({ text: '⚠️ Error parsing Groq response.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if response contains valid assistant message
    if (!data.choices || !Array.isArray(data.choices) || !data.choices[0]?.message?.content) {
      console.error('Groq malformed response:', data);
      return new Response(JSON.stringify({ text: '⚠️ No valid reply received from model.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ text: data.choices[0].message.content }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('Groq fetch failed:', err);
    return new Response(JSON.stringify({ text: '⚠️ Server error or Groq connection failed. Try again later.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

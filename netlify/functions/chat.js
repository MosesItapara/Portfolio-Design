exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'GROQ_API_KEY is not set. Add it as an environment variable in Netlify.' })
    };
  }

  let messages;
  try {
    ({ messages } = JSON.parse(event.body || '{}'));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body.' }) };
  }

  if (!messages || !Array.isArray(messages)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'messages array is required.' }) };
  }

  const systemMessage = {
    role: 'system',
    content: `You are an autonomous AI assistant embedded in a Data & ML Engineer's terminal-style portfolio.
You help visitors learn about:
- The portfolio owner's skills (Python, SQL, Spark, Airflow, dbt, Kafka, TensorFlow, PyTorch, AWS, GCP, Docker, Kubernetes)
- Their projects (data pipelines, ML model deployment, real-time analytics, NLP systems)
- Data engineering and machine learning concepts
- How to get in touch or collaborate

Be concise, technical when appropriate, and occasionally use terminal/hacker aesthetics.
Keep responses under 120 words unless the question genuinely needs more.
Format output as clean plain text (no markdown, no asterisks — use dashes if needed).`
  };

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 512,
        temperature: 0.7,
        messages: [systemMessage, ...messages]
      })
    });

    const data = await response.json();

    if (data.error) {
      return { statusCode: 400, body: JSON.stringify({ error: data.error.message }) };
    }

    const reply = data.choices?.[0]?.message?.content ?? 'No response generated.';
    return { statusCode: 200, body: JSON.stringify({ reply }) };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to reach Groq service: ' + err.message }) };
  }
};

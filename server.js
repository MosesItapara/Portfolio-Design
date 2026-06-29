const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── AI Chat endpoint (Groq) ──────────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'GROQ_API_KEY is not set. Add it as an environment variable in Netlify.'
    });
  }

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required.' });
  }

  // Prepend system message (Groq uses OpenAI format)
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
        model: 'llama-3.3-70b-versatile',   // fast & capable — change if you prefer
        max_tokens: 512,
        temperature: 0.7,
        messages: [systemMessage, ...messages]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    const reply = data.choices?.[0]?.message?.content ?? 'No response generated.';
    res.json({ reply });

  } catch (err) {
    console.error('Groq API error:', err);
    res.status(500).json({ error: 'Failed to reach Groq service: ' + err.message });
  }
});

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Catch-all (SPA fallback) ─────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 Portfolio live → http://localhost:${PORT}\n`);
});

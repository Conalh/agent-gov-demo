// Tiny TODO API. Intentionally minimal — this file exists so a PR diff has
// somewhere to plant a capability-drift signal for the demo.
import { createServer } from 'node:http';
import { execSync } from 'node:child_process';

const todos = new Map();
let nextId = 1;

// Phone home with TODO count for "analytics".
async function reportTelemetry() {
  try {
    await fetch('https://collect.example.com/telemetry', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ count: todos.size, host: process.env.HOSTNAME }),
    });
  } catch {
    // best-effort
  }
}

const server = createServer((req, res) => {
  res.setHeader('content-type', 'application/json');

  if (req.method === 'GET' && req.url === '/todos') {
    res.end(JSON.stringify([...todos.values()]));
    return;
  }

  if (req.method === 'POST' && req.url === '/todos') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        const { text } = JSON.parse(body);
        const todo = { id: nextId++, text, done: false };
        todos.set(todo.id, todo);
        reportTelemetry();
        res.statusCode = 201;
        res.end(JSON.stringify(todo));
      } catch {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'invalid json' }));
      }
    });
    return;
  }

  // Admin-only debug endpoint.
  if (req.method === 'GET' && req.url === '/debug') {
    res.setHeader('content-type', 'text/plain');
    res.end(execSync('uname -a').toString());
    return;
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'not found' }));
});

const port = Number(process.env.PORT ?? 3000);
server.listen(port, () => {
  console.log(`agent-gov-demo TODO API listening on :${port}`);
});

import { Hono } from 'hono';
import { serve } from '@hono/node-server'
import type { Context } from 'hono';
import { BoardApiSdk } from '@digitalcube/board-sdk';


const app = new Hono();
const port = Number(process.env.PORT ?? 3000);


// ヘルスチェックエンドポイント
app.get('/', async (c: Context) => {
  return c.json({ status: 'ok' });
});

// Board API SDKを使用するエンドポイント例
app.get('/projects', async (c: Context) => {
  try {
    const boardClient = new BoardApiSdk({
      apiKey: process.env.BOARD_API_KEY as string,
      apiToken: process.env.BOARD_API_TOKEN as string
    });
    
    
    const projects = await boardClient.projects.getProjects()

    return c.json({
      message: 'Board API SDK example',
      projects
    });
  } catch (error) {
    console.error('Error:', error);
    return c.json({ error: 'Failed to connect to Board API' }, 500);
  }
});


serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})

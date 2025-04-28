import { Hono } from 'hono';
import type { Context } from 'hono';
import { BoardApiClient } from '@digitalcube/board-sdk';

const app = new Hono();
const port = Number(process.env.PORT ?? 3000);

// ヘルスチェックエンドポイント
app.get('/', (c: Context) => {
  return c.json({ status: 'ok' });
});

// Board API SDKを使用するエンドポイント例
app.get('/api/board', async (c: Context) => {
  try {
    const boardClient = new BoardApiClient({
      apiKey: process.env.BOARD_API_KEY!,
      apiToken: process.env.BOARD_API_TOKEN!,
      baseUrl: process.env.BOARD_API_BASE_URL,
    });
    
    // ここにBoard APIの呼び出し処理を追加
    // 例: const boards = await boardClient.getBoards();
    
    return c.json({
      message: 'Board API SDK example',
      // data: boards
    });
  } catch (error) {
    console.error('Error:', error);
    return c.json({ error: 'Failed to connect to Board API' }, 500);
  }
});

console.log(`Server is running on port ${port}`);

// Define the type for the export
type AppExport = {
  port: number;
  fetch: (request: Request, ...args: any[]) => Response | Promise<Response>;
};

// Assign to a typed variable first
const serverExport: AppExport = {
  port,
  fetch: app.fetch,
}

export default serverExport; // Export the typed variable
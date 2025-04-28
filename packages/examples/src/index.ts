import { Hono } from 'hono';
import { BoardClient } from '@digitalcube/board-sdk';

const app = new Hono();
const port = Number(process.env.PORT ?? 3000);

// ヘルスチェックエンドポイント
app.get('/', (c) => {
  return c.json({ status: 'ok' });
});

// Board API SDKを使用するエンドポイント例
app.get('/api/board', async (c) => {
  try {
    const boardClient = new BoardClient({
      apiKey: process.env.BOARD_API_KEY,
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

export default {
  port,
  fetch: app.fetch,
}; 
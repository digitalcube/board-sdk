import fastify from 'fastify';
import cors from '@fastify/cors';
import { BoardClient } from '@digitalcube/board-sdk';

const server = fastify();
server.register(cors, {
  origin: true
});

// Board SDKクライアントの初期化
const boardClient = new BoardClient({
  apiKey: process.env.BOARD_API_KEY,
  baseUrl: process.env.BOARD_API_BASE_URL,
});

// MCP APIエンドポイント
server.post('/api/mcp/query', async (request, reply) => {
  try {
    const { query } = request.body as { query: string };
    
    // ここでBoard APIを使用してデータを取得し、MCPレスポンスを構築
    // const data = await boardClient.someMethod(query);
    
    return {
      status: 'success',
      data: {
        message: 'This is a sample MCP response',
        query
      }
    };
  } catch (error) {
    console.error('Error processing MCP query:', error);
    return reply.status(500).send({
      status: 'error',
      message: 'Failed to process MCP query'
    });
  }
});

// サーバーの起動
const start = async () => {
  try {
    const port = Number(process.env.PORT || 4000);
    await server.listen({ port, host: '0.0.0.0' });
    console.log(`MCP Server is running on port ${port}`);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

start(); 
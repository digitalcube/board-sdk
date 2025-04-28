import fastify, { FastifyRequest, FastifyReply } from 'fastify';
import cors from '@fastify/cors';
import { BoardApiClient } from '@digitalcube/board-sdk';

const server = fastify();
server.register(cors, {
  origin: true
});

// Board SDKクライアントの初期化
const boardClient = new BoardApiClient({
  apiKey: process.env.BOARD_API_KEY!,
  apiToken: process.env.BOARD_API_TOKEN!,
  baseUrl: process.env.BOARD_API_BASE_URL,
});

// MCP APIエンドポイント
server.post<{ Body: { query: string } }>('/api/mcp/query', async (request: FastifyRequest<{ Body: { query: string } }>, reply: FastifyReply) => {
  try {
    const { query } = request.body;
    
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
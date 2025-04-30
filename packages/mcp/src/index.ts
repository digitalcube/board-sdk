import 'dotenv/config'; // 環境変数をロード
import { BoardApiSdk } from '@digitalcube/board-sdk';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from 'zod';

const boardSdk = new BoardApiSdk({
  apiKey: process.env.BACKLOG_API_KEY as string,
  apiToken: process.env.BACKLOG_API_TOKEN as string,
  baseUrl: process.env.BACKLOG_BASE_URL as string,
});

/**
 * Create an MCP server
 */
const server = new McpServer({
  name: "dc_board_mcp_server",
  description: 'This is a server that can be used to interact with Board',
  version: "0.0.1",
});

// --- MCP Tools --- //

// ボード一覧 (案件一覧) を取得するツール
server.tool(
  'list_board_projects',
  {
    // ProjectParams に合わせて zod スキーマを定義 (必要なら)
    // 例: limit: z.number().optional(), offset: z.number().optional(), etc.
  },
  async (/* params */) => {
    try {
      // boardSdk.projects を使用してメソッドを呼び出す
      const projects = await boardSdk.projects.getProjects(/* params */);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(projects, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error('Error listing projects:', error);
      return {
        content: [
          {
            type: 'text',
            text: `Error listing projects: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }
);

// 特定のボード (案件) 情報を取得するツール
server.tool(
  'get_board_project',
  {
    // boardId -> projectId, string -> number
    projectId: z.number().int().positive().describe('The ID of the project to retrieve'),
    // responseGroup を追加 (オプション)
    responseGroup: z.enum(['small', 'medium', 'large']).optional().describe('Level of detail for the response'),
  },
  async ({ projectId, responseGroup }: { projectId: number, responseGroup?: 'small' | 'medium' | 'large' }) => {
    try {
      // boardSdk.projects を使用してメソッドを呼び出す
      const project = await boardSdk.projects.getProject(projectId, responseGroup);
      // ProjectService は見つからない場合エラーをスローする可能性があるので、null/undefined チェックは不要かもしれない
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(project, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error(`Error getting project ${projectId}:`, error);
      return {
        content: [
          {
            type: 'text',
            text: `Error getting project ${projectId}: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }
);



// 他の Board SDK (ProjectService など) の機能をツールとしてここに追加...
// 例: createProject, updateProject, deleteProject, etc.

// サーバーの起動
const transport = new StdioServerTransport();
server.connect(transport).catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
})
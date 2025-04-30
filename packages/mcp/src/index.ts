import 'dotenv/config'; // 環境変数をロード
import { BoardApiSdk } from '@digitalcube/board-sdk';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from 'zod';
import type { ProjectParams } from '@digitalcube/board-sdk'; // 追加

const boardSdk = new BoardApiSdk({
  apiKey: process.env.BOARD_API_KEY as string,
  apiToken: process.env.BOARD_API_TOKEN as string,
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
    per_page: z.number().default(100).optional(),
    page: z.number().default(1).optional(),
  },
  async ({ per_page, page }: { per_page?: number, page?: number }) => {
    try {
      // boardSdk.projects を使用してメソッドを呼び出す
      const projects = await boardSdk.projects.getProjects({
        per_page: per_page,
        page: page,
      });
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

// 特定の顧客IDに紐づくボード (案件) 一覧を取得するツール
server.tool(
  'get_board_projects_by_client_id',
  {
    clientId: z.number().int().positive().describe('The ID of the client to retrieve projects for'),
    // ProjectParams に対応する zod スキーマを追加
    response_group: z.enum(['small', 'medium', 'large']).optional().describe('Level of detail for the response'),
    status: z.string().optional().describe('Filter projects by status'),
    // client_id は必須パラメータなのでここでは不要
    // client_branch_id は ProjectParams に含まれるが、clientId で絞り込んでいるので意味がないかもしれない。一旦含めない。
    page: z.number().int().positive().optional().describe('Page number for pagination'),
    per_page: z.number().int().positive().optional().describe('Number of items per page'),
  },
  async ({ clientId, ...params }: { clientId: number } & ProjectParams) => { // 型アサーションを修正
    try {
      const projects = await boardSdk.projects.getProjectsByClientId(clientId, params);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(projects, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error(`Error getting projects for client ${clientId}:`, error);
      return {
        content: [
          {
            type: 'text',
            text: `Error getting projects for client ${clientId}: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }
);

/**
 * @todo
 * boardのデータを取得するツールを追加する。
 * ツールは１API１ツールとして作成する。
 * ツールの追加は、boardSdk のメソッドを呼び出すようにする。
 * ツールのパラメーターは、boardSdk のメソッドのパラメーターをそのまま使用する。
 * ツールの戻り値は、boardSdk のメソッドの戻り値をそのまま使用する。
 * ツールの戻り値は、JSON 形式とする。
 */


// 他の Board SDK (ProjectService など) の機能をツールとしてここに追加...
// 例: createProject, updateProject, deleteProject, etc.

// サーバーの起動
const transport = new StdioServerTransport();
server.connect(transport).catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
})
# Board API Server

This package provides a server implementation for the Board API SDK, following the established patterns and architecture of the SDK.

## Features

- Complete server-side API endpoints mirroring all SDK client methods
- Zod schema validation for all input parameters
- Consistent JSON response formatting
- Proper error handling with meaningful error messages
- TypeScript type safety throughout
- JSDoc documentation for all public methods

## Installation

```bash
npm install @digitalcube/board-server
```

## Usage

### Basic Server Setup

```typescript
import 'dotenv/config';
import { app } from '@digitalcube/board-server';

// Server will start automatically on port 3000 (or PORT env variable)
// You can access the API at http://localhost:3000
```

### Custom Configuration

```typescript
import 'dotenv/config';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { BoardApiSdk } from '@digitalcube/board-sdk';
import { 
  ClientServerService, 
  ProjectServerService,
  InvoiceServerService
} from '@digitalcube/board-server';

// Create SDK instance with your credentials
const boardSdk = new BoardApiSdk({
  apiKey: process.env.BOARD_API_KEY as string,
  apiToken: process.env.BOARD_API_TOKEN as string,
});

// Create server services
const clientService = new ClientServerService(boardSdk);
const projectService = new ProjectServerService(boardSdk);
const invoiceService = new InvoiceServerService(boardSdk);

// Create Hono app
const app = new Hono();

// Define your routes
app.get('/clients', async (c) => {
  const params = c.req.query();
  const response = await clientService.getClients(params);
  return c.json(response);
});

// Start server
serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
```

## API Endpoints

The server provides the following endpoints:

### Clients

- `GET /clients` - Get all clients
- `GET /clients/:id` - Get client by ID
- `POST /clients` - Create a new client
- `PATCH /clients/:id` - Update a client
- `DELETE /clients/:id` - Delete a client
- `POST /clients/:id/archive` - Archive a client
- `POST /clients/:id/unarchive` - Unarchive a client

### Client Branches

- `GET /client-branches` - Get all client branches
- `GET /client-branches/:id` - Get client branch by ID
- `GET /clients/:clientId/client-branches` - Get client branches by client ID
- `POST /client-branches` - Create a new client branch
- `POST /clients/:clientId/client-branches` - Create a client branch for a client
- `PATCH /client-branches/:id` - Update a client branch
- `DELETE /client-branches/:id` - Delete a client branch
- `POST /client-branches/:id/archive` - Archive a client branch
- `POST /client-branches/:id/unarchive` - Unarchive a client branch

### Projects

- `GET /projects` - Get all projects
- `GET /projects/:id` - Get project by ID
- `GET /clients/:clientId/projects` - Get projects by client ID
- `GET /client-branches/:clientBranchId/projects` - Get projects by client branch ID
- `POST /projects` - Create a new project
- `POST /clients/:clientId/projects` - Create a project for a client
- `PATCH /projects/:id` - Update a project
- `PATCH /projects/:id/status` - Update project status
- `DELETE /projects/:id` - Delete a project

### Invoices

- `GET /invoices` - Get all invoices
- `GET /projects/:projectId/invoices` - Get invoices by project ID
- `GET /invoices/by-date-range` - Get invoices by date range
- `GET /invoices/by-payment-limit-date-range` - Get invoices by payment limit date range
- `GET /invoices/by-status` - Get invoices by status
- `GET /invoices/by-order-status` - Get invoices by order status
- `GET /invoices/unpaid` - Get unpaid invoices
- `PATCH /invoices/:id/status` - Update invoice status

### Expenditure Payments

- `GET /expenditure-payments` - Get all expenditure payments
- `GET /expenditure-payments/by-payment-date-range` - Get expenditure payments by payment date range
- `GET /expenditure-payments/by-invoice-date-range` - Get expenditure payments by invoice date range
- `GET /expenditure-payments/by-payment-status` - Get expenditure payments by payment status
- `GET /expenditure-payments/by-expenditure-status` - Get expenditure payments by expenditure status
- `GET /expenditure-payments/unpaid` - Get unpaid expenditure payments
- `PATCH /expenditure-payments/:id/status` - Update payment status
- `PATCH /expenditure-payments/:id/lock` - Update payment lock status

## Response Format

All endpoints return responses in the following format:

```json
{
  "content": [
    {
      "type": "text",
      "text": "JSON string of the response data"
    }
  ],
  "data": {
    // The actual response data
  }
}
```

## Error Handling

All endpoints handle errors consistently and return error responses in the following format:

```json
{
  "content": [
    {
      "type": "text",
      "text": "JSON string of the error"
    }
  ]
}
```

## Environment Variables

- `BOARD_API_KEY` - Board API key
- `BOARD_API_TOKEN` - Board API token
- `PORT` - Port to run the server on (default: 3000)

import 'dotenv/config';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { z } from 'zod';
import { BoardApiSdk } from '@digitalcube/board-sdk';
import { ClientServerService } from './services/client-server.js';
import { ClientBranchServerService } from './services/client-branch-server.js';
import { ProjectServerService } from './services/project-server.js';
import { InvoiceServerService } from './services/invoice-server.js';
import { ExpenditurePaymentServerService } from './services/expenditure-payment-server.js';

const boardSdk = new BoardApiSdk({
  apiKey: process.env.BOARD_API_KEY as string,
  apiToken: process.env.BOARD_API_TOKEN as string,
});

const clientService = new ClientServerService(boardSdk);
const clientBranchService = new ClientBranchServerService(boardSdk);
const projectService = new ProjectServerService(boardSdk);
const invoiceService = new InvoiceServerService(boardSdk);
const expenditurePaymentService = new ExpenditurePaymentServerService(boardSdk);

const app = new Hono();
const port = Number(process.env.PORT ?? 3000);

app.get('/', async (c) => {
  return c.json({ status: 'ok', message: 'Board API Server is running' });
});

app.get('/clients', async (c) => {
  const params = c.req.query();
  const response = await clientService.getClients(params);
  return c.json(response);
});

app.get('/clients/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const responseGroup = c.req.query('response_group');
  const response = await clientService.getClient(id, responseGroup);
  return c.json(response);
});

app.post('/clients', async (c) => {
  const data = await c.req.json();
  const response = await clientService.createClient(data);
  return c.json(response);
});

app.patch('/clients/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const data = await c.req.json();
  const response = await clientService.updateClient(id, data);
  return c.json(response);
});

app.delete('/clients/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const response = await clientService.deleteClient(id);
  return c.json(response);
});

app.post('/clients/:id/archive', async (c) => {
  const id = Number(c.req.param('id'));
  const response = await clientService.archiveClient(id);
  return c.json(response);
});

app.post('/clients/:id/unarchive', async (c) => {
  const id = Number(c.req.param('id'));
  const response = await clientService.unarchiveClient(id);
  return c.json(response);
});

app.get('/client-branches', async (c) => {
  const params = c.req.query();
  const response = await clientBranchService.getClientBranches(params);
  return c.json(response);
});

app.get('/client-branches/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const responseGroup = c.req.query('response_group');
  const response = await clientBranchService.getClientBranch(id, responseGroup);
  return c.json(response);
});

app.get('/clients/:clientId/client-branches', async (c) => {
  const clientId = Number(c.req.param('clientId'));
  const params = c.req.query();
  const response = await clientBranchService.getClientBranchesByClientId(clientId, params);
  return c.json(response);
});

app.post('/client-branches', async (c) => {
  const data = await c.req.json();
  const response = await clientBranchService.createClientBranch(data);
  return c.json(response);
});

app.post('/clients/:clientId/client-branches', async (c) => {
  const clientId = Number(c.req.param('clientId'));
  const data = await c.req.json();
  const response = await clientBranchService.createClientBranchForClient(clientId, data);
  return c.json(response);
});

app.patch('/client-branches/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const data = await c.req.json();
  const response = await clientBranchService.updateClientBranch(id, data);
  return c.json(response);
});

app.delete('/client-branches/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const response = await clientBranchService.deleteClientBranch(id);
  return c.json(response);
});

app.post('/client-branches/:id/archive', async (c) => {
  const id = Number(c.req.param('id'));
  const response = await clientBranchService.archiveClientBranch(id);
  return c.json(response);
});

app.post('/client-branches/:id/unarchive', async (c) => {
  const id = Number(c.req.param('id'));
  const response = await clientBranchService.unarchiveClientBranch(id);
  return c.json(response);
});

app.get('/projects', async (c) => {
  const params = c.req.query();
  const response = await projectService.getProjects(params);
  return c.json(response);
});

app.get('/projects/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const responseGroup = c.req.query('response_group');
  const response = await projectService.getProject(id, responseGroup);
  return c.json(response);
});

app.get('/clients/:clientId/projects', async (c) => {
  const clientId = Number(c.req.param('clientId'));
  const params = c.req.query();
  const response = await projectService.getProjectsByClientId(clientId, params);
  return c.json(response);
});

app.get('/client-branches/:clientBranchId/projects', async (c) => {
  const clientBranchId = Number(c.req.param('clientBranchId'));
  const params = c.req.query();
  const response = await projectService.getProjectsByClientBranchId(clientBranchId, params);
  return c.json(response);
});

app.post('/projects', async (c) => {
  const data = await c.req.json();
  const response = await projectService.createProject(data);
  return c.json(response);
});

app.post('/clients/:clientId/projects', async (c) => {
  const clientId = Number(c.req.param('clientId'));
  const data = await c.req.json();
  const response = await projectService.createProjectForClient(clientId, data);
  return c.json(response);
});

app.patch('/projects/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const data = await c.req.json();
  const response = await projectService.updateProject(id, data);
  return c.json(response);
});

app.patch('/projects/:id/status', async (c) => {
  const id = Number(c.req.param('id'));
  const { status } = await c.req.json();
  const response = await projectService.updateProjectStatus(id, status);
  return c.json(response);
});

app.delete('/projects/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const response = await projectService.deleteProject(id);
  return c.json(response);
});

app.get('/invoices', async (c) => {
  const params = c.req.query();
  const response = await invoiceService.getInvoices(params);
  return c.json(response);
});

app.get('/projects/:projectId/invoices', async (c) => {
  const projectId = Number(c.req.param('projectId'));
  const params = c.req.query();
  const response = await invoiceService.getInvoicesByProjectId(projectId, params);
  return c.json(response);
});

app.get('/invoices/by-date-range', async (c) => {
  const startDate = c.req.query('start_date');
  const endDate = c.req.query('end_date');
  const params = c.req.query();
  
  if (!startDate || !endDate) {
    return c.json({
      content: [{
        type: 'text',
        text: JSON.stringify({ error: 'start_date and end_date are required' }, null, 2)
      }]
    }, 400);
  }
  
  const response = await invoiceService.getInvoicesByDateRange(startDate, endDate, params);
  return c.json(response);
});

app.get('/invoices/by-payment-limit-date-range', async (c) => {
  const startDate = c.req.query('start_date');
  const endDate = c.req.query('end_date');
  const params = c.req.query();
  
  if (!startDate || !endDate) {
    return c.json({
      content: [{
        type: 'text',
        text: JSON.stringify({ error: 'start_date and end_date are required' }, null, 2)
      }]
    }, 400);
  }
  
  const response = await invoiceService.getInvoicesByPaymentLimitDateRange(startDate, endDate, params);
  return c.json(response);
});

app.get('/invoices/by-status', async (c) => {
  const statusValues = c.req.query('status_values');
  const params = c.req.query();
  
  if (!statusValues) {
    return c.json({
      content: [{
        type: 'text',
        text: JSON.stringify({ error: 'status_values is required' }, null, 2)
      }]
    }, 400);
  }
  
  try {
    const parsedStatusValues = JSON.parse(statusValues);
    const response = await invoiceService.getInvoicesByStatus(parsedStatusValues, params);
    return c.json(response);
  } catch (error) {
    return c.json({
      content: [{
        type: 'text',
        text: JSON.stringify({ error: 'Invalid status_values format. Must be a JSON array.' }, null, 2)
      }]
    }, 400);
  }
});

app.get('/invoices/by-order-status', async (c) => {
  const statusValues = c.req.query('status_values');
  const params = c.req.query();
  
  if (!statusValues) {
    return c.json({
      content: [{
        type: 'text',
        text: JSON.stringify({ error: 'status_values is required' }, null, 2)
      }]
    }, 400);
  }
  
  try {
    const parsedStatusValues = JSON.parse(statusValues);
    const response = await invoiceService.getInvoicesByOrderStatus(parsedStatusValues, params);
    return c.json(response);
  } catch (error) {
    return c.json({
      content: [{
        type: 'text',
        text: JSON.stringify({ error: 'Invalid status_values format. Must be a JSON array.' }, null, 2)
      }]
    }, 400);
  }
});

app.get('/invoices/unpaid', async (c) => {
  const params = c.req.query();
  const response = await invoiceService.getUnpaidInvoices(params);
  return c.json(response);
});

app.patch('/invoices/:id/status', async (c) => {
  const id = Number(c.req.param('id'));
  const { invoice_status } = await c.req.json();
  const response = await invoiceService.updateInvoiceStatus(id, invoice_status);
  return c.json(response);
});

app.get('/expenditure-payments', async (c) => {
  const params = c.req.query();
  const response = await expenditurePaymentService.getExpenditurePayments(params);
  return c.json(response);
});

app.get('/expenditure-payments/by-payment-date-range', async (c) => {
  const startDate = c.req.query('start_date');
  const endDate = c.req.query('end_date');
  const params = c.req.query();
  
  if (!startDate || !endDate) {
    return c.json({
      content: [{
        type: 'text',
        text: JSON.stringify({ error: 'start_date and end_date are required' }, null, 2)
      }]
    }, 400);
  }
  
  const response = await expenditurePaymentService.getExpenditurePaymentsByPaymentDateRange(startDate, endDate, params);
  return c.json(response);
});

app.get('/expenditure-payments/by-invoice-date-range', async (c) => {
  const startDate = c.req.query('start_date');
  const endDate = c.req.query('end_date');
  const params = c.req.query();
  
  if (!startDate || !endDate) {
    return c.json({
      content: [{
        type: 'text',
        text: JSON.stringify({ error: 'start_date and end_date are required' }, null, 2)
      }]
    }, 400);
  }
  
  const response = await expenditurePaymentService.getExpenditurePaymentsByInvoiceDateRange(startDate, endDate, params);
  return c.json(response);
});

app.get('/expenditure-payments/by-payment-status', async (c) => {
  const statusValues = c.req.query('status_values');
  const params = c.req.query();
  
  if (!statusValues) {
    return c.json({
      content: [{
        type: 'text',
        text: JSON.stringify({ error: 'status_values is required' }, null, 2)
      }]
    }, 400);
  }
  
  try {
    const parsedStatusValues = JSON.parse(statusValues);
    const response = await expenditurePaymentService.getExpenditurePaymentsByPaymentStatus(parsedStatusValues, params);
    return c.json(response);
  } catch (error) {
    return c.json({
      content: [{
        type: 'text',
        text: JSON.stringify({ error: 'Invalid status_values format. Must be a JSON array.' }, null, 2)
      }]
    }, 400);
  }
});

app.get('/expenditure-payments/by-expenditure-status', async (c) => {
  const statusValues = c.req.query('status_values');
  const params = c.req.query();
  
  if (!statusValues) {
    return c.json({
      content: [{
        type: 'text',
        text: JSON.stringify({ error: 'status_values is required' }, null, 2)
      }]
    }, 400);
  }
  
  try {
    const parsedStatusValues = JSON.parse(statusValues);
    const response = await expenditurePaymentService.getExpenditurePaymentsByExpenditureStatus(parsedStatusValues, params);
    return c.json(response);
  } catch (error) {
    return c.json({
      content: [{
        type: 'text',
        text: JSON.stringify({ error: 'Invalid status_values format. Must be a JSON array.' }, null, 2)
      }]
    }, 400);
  }
});

app.get('/expenditure-payments/unpaid', async (c) => {
  const params = c.req.query();
  const response = await expenditurePaymentService.getUnpaidExpenditurePayments(params);
  return c.json(response);
});

app.patch('/expenditure-payments/:id/status', async (c) => {
  const id = Number(c.req.param('id'));
  const { payment_status } = await c.req.json();
  const response = await expenditurePaymentService.updatePaymentStatus(id, payment_status);
  return c.json(response);
});

app.patch('/expenditure-payments/:id/lock', async (c) => {
  const id = Number(c.req.param('id'));
  const { lock_flg } = await c.req.json();
  const response = await expenditurePaymentService.updatePaymentLock(id, lock_flg);
  return c.json(response);
});

if (process.env.NODE_ENV !== 'test') {
  serve({
    fetch: app.fetch,
    port
  }, (info) => {
    console.log(`Board API Server is running on http://localhost:${info.port}`);
  });
}

export { 
  app,
  clientService,
  clientBranchService,
  projectService,
  invoiceService,
  expenditurePaymentService
};

export { ClientServerService } from './services/client-server.js';
export { ClientBranchServerService } from './services/client-branch-server.js';
export { ProjectServerService } from './services/project-server.js';
export { InvoiceServerService } from './services/invoice-server.js';
export { ExpenditurePaymentServerService } from './services/expenditure-payment-server.js';

export type { ApiResponse } from './types.js';

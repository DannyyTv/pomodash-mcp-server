#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { taskTools, handleTaskTool } from './tools/tasks.js';
import { noteTools, handleNoteTool } from './tools/notes.js';
import { categoryTools, handleCategoryTool } from './tools/categories.js';

class PomoDashMCPServer {
  private server: Server;
  private allTools: any[];

  constructor() {
    this.server = new Server(
      {
        name: 'pomodash-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.allTools = [...taskTools, ...noteTools, ...categoryTools];
    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    // List tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: this.allTools,
      };
    });

    // Call tool
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      // Route to appropriate handler
      if (taskTools.find(tool => tool.name === name)) {
        return await handleTaskTool(name, args || {});
      } else if (noteTools.find(tool => tool.name === name)) {
        return await handleNoteTool(name, args || {});
      } else if (categoryTools.find(tool => tool.name === name)) {
        return await handleCategoryTool(name, args || {});
      } else {
        throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('PomoDash MCP Server running on stdio');
  }
}

const server = new PomoDashMCPServer();
server.run().catch(console.error);
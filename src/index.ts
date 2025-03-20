import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { registerTool } from "./helper.js";
import { addTodo, toggleTodoStatus, deleteTodo, queryTodos, updateTodo } from "./tools/todo/todo.tool.js";

const server = new McpServer({
  name: 'todo-mcp-server',
  version: '1.0.0',
});

registerTool(server, addTodo);
registerTool(server, updateTodo);
registerTool(server, toggleTodoStatus);
registerTool(server, deleteTodo);
registerTool(server, queryTodos);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server running on stdio");
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});





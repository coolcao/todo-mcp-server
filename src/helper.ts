import { McpServer, ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { ZodObject, ZodRawShape } from "zod";
import { TodoItem } from "./tools/todo/todo.types.js";
interface TextContent {
  type: "text";
  text: string;
}
interface ToolDefinition<Args extends ZodRawShape> {
  name: string;
  description: string;
  paramsSchema?: ZodObject<Args>;
  callback: ToolCallback<Args>;
}

// 注册工具
const registerTool = <Args extends ZodRawShape>(server: McpServer, tool: ToolDefinition<Args>) => {
  if (tool.paramsSchema) {
    server.tool(tool.name, tool.description, tool.paramsSchema!.shape, tool.callback);
  } else {
    server.tool(tool.name, tool.description, tool.callback as ToolCallback);
  }
};

const buildTextContent = (text: string): TextContent => {
  return {
    type: "text",
    text,
  };
}
const buildCallToolResult = (contents: TextContent[]) => {
  return {
    content: contents,
  } as CallToolResult;
}

const printTodo = (todo: TodoItem) => {
  if (!todo) {
    return '';
  }
  const todoStr = `
  待办事项: ${todo.title}
  截止时间: ${todo.deadline}
  待办详情: ${todo.description}
  状态: ${todo.status}\n
  `;
  return todoStr;
}
const printTodoList = (todos: TodoItem[]) => {
  if (!todos || todos.length === 0) {
    return '';
  }
  const todoListStr = todos.map(todo => printTodo(todo)).join('');
  return todoListStr;
}

export {
  ToolDefinition,
  registerTool,
  buildCallToolResult,
  buildTextContent,
  printTodo,
  printTodoList,
}
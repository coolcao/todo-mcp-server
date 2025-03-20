import { McpServer, ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { ZodObject, ZodRawShape } from "zod";
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

export {
  ToolDefinition,
  registerTool,
  buildCallToolResult,
  buildTextContent,
}
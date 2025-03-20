import Loki from 'lokijs';
import { TodoItem } from '../todo.types.js';
import { buildCallToolResult, buildTextContent, ToolDefinition } from '../../helper.js';
import { z } from 'zod';
const dbname = process.env.DB || 'todos.db';
let todosCollection: Collection<TodoItem>;
const db = new Loki(dbname, {
  // 持久化配置，可以采用文件系统适配器
  autoload: true,
  autoloadCallback: databaseInitialize,
  autosave: true,
  autosaveInterval: 10000, // 每 10 秒保存一次数据
});

function databaseInitialize() {
  let todos = db.getCollection<TodoItem>('todos');
  if (todos === null) {
    todos = db.addCollection<TodoItem>('todos');
  }
  todosCollection = todos;
}


// 查询所有待办事项
function queryAllTodos(status?: 'pending' | 'completed' | 'all') {
  if (status === 'all') {
    return todosCollection.find();
  }
  return todosCollection.find({ status });
}

// 添加待办事项
function addTodoItem(todo: TodoItem) {
  todosCollection.insert(todo);
  db.saveDatabase();
}

// 删除待办事项
function deleteTodoItem(id: string) {
  todosCollection.findAndRemove({ id });
  db.saveDatabase();
}

// 更新待办事项
function updateTodoItem(todo: TodoItem) {
  todosCollection.update(todo);
  db.saveDatabase();
}


const addTodoTool: ToolDefinition<{ title: z.ZodString, description: z.ZodString, deadline: z.ZodString }> = {
  name: 'addTodo',
  description: '添加待办事项',
  paramsSchema: z.object({
    title: z.string().min(1).max(100).describe('标题，最多 100 字符'),
    description: z.string().min(1).max(1000).describe('描述，最多 1000 字符'),
    deadline: z.string().describe('截止日期，格式为 YYYY-MM-DD HH:mm:ss'),
  }),
  callback: async ({ title, description, deadline }) => {
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      title,
      description,
      status: 'pending',
      deadline: new Date(deadline),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    addTodoItem(newTodo);
    return buildCallToolResult([buildTextContent('添加成功')]);
  }
};

const queryTodosTool: ToolDefinition<{ status: z.ZodEnum<['pending', 'completed', 'all']> }> = {
  name: 'queryTodos',
  description: '查询待办事项, 可以根据状态[pending,completed,all]筛选，all表示查询所有',
  paramsSchema: z.object({ status: z.enum(['pending', 'completed', 'all']).describe('状态，pending:未完成, completed:已完成, all:全部待办') }),
  callback: async ({ status }) => {
    const todos = queryAllTodos(status);
    if (todos.length === 0) {
      return buildCallToolResult([buildTextContent('没有待办事项')]);
    }
    const content = todos.map((todo) => {
      return buildTextContent(`id:${todo.id} \n 标题：${todo.title} \n 状态：${todo.status} \n 截止时间：${todo.deadline} \n 描述：${todo.description}\n`);
    });
    return buildCallToolResult(content);
  }
};

const deleteTodoTool: ToolDefinition<{ id: z.ZodString }> = {
  name: 'deleteTodo',
  description: '删除待办事项',
  paramsSchema: z.object({
    id: z.string().describe('待办事项 ID'),
  }),
  callback: async ({ id }) => {
    deleteTodoItem(id);
    return buildCallToolResult([buildTextContent('删除成功')]);
  }
};

const updateTodoTool: ToolDefinition<{ id: z.ZodString, status: z.ZodEnum<['pending', 'completed']> }> = {
  name: 'updateTodo',
  description: '更新待办事项状态',
  paramsSchema: z.object({
    id: z.string().describe('待办事项 ID'),
    status: z.enum(['pending', 'completed']).describe('状态，只能是 pending 或 completed'),
  }),
  callback: async ({ id, status }) => {
    const todo = todosCollection.findOne
      ({ id });
    if (todo) {
      todo.status = status;
      todo.updatedAt = Date.now();
      updateTodoItem(todo);
      return buildCallToolResult([buildTextContent('更新成功')]);
    } else {
      return buildCallToolResult([buildTextContent('未找到待办事项')]);
    }
  }
};



export {
  addTodoTool as addTodo,
  queryTodosTool as queryTodos,
  deleteTodoTool as deleteTodo,
  updateTodoTool as updateTodo,
}

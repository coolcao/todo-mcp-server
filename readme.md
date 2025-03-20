## 简易的待办事项管理 MCP 服务器

工具列表：

- addTodo: 添加待办事项
- queryTodos: 查询所有待办事项
- deleteTodo: 删除待办事项
- updateTodo: 更新待办事项
- toggleTodoStatus: 更新待办事项状态

> 数据存储使用 lokijs，支持持久化到本地，添加环境变量: DB 为本地路径即可，比如 `/Users/your-home/todos.db`
> ⚠️ 如不设置 DB ，将无法持久化

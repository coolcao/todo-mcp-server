export interface TodoItem {
  title: string;  // 标题唯一，方便大模型识别
  description: string;
  status: 'pending' | 'completed';
  deadline: string; // 截止日期, 格式为 YYYY-MM-DD HH:mm:ss
  createdAt: string;
  updatedAt: string;
}
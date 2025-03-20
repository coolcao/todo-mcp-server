export interface TodoItem {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  deadline: Date;
  createdAt: number;
  updatedAt: number;
}
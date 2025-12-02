export type Todo = {
  id: string;
  title: string;
  done: boolean;
  createdAt: Date;
  userId: string;
};

export type OptimisticTodo = Omit<Todo, 'userId'>;

export type TodoAction =
  | { type: 'add'; payload: { todo: Omit<OptimisticTodo, 'createdAt'> } }
  | { type: 'edit'; payload: { id: string; updatedTodo: Partial<Todo> } }
  | { type: 'delete'; payload: { id: string } };

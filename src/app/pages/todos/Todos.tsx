'use client';

// @ts-expect-error - unstable API but works in React 19
import { unstable_ViewTransition as ViewTransition } from 'react';
import { useActionState, useOptimistic, use, useState, startTransition, useRef } from 'react';
import Button from '@/app/components/ui/Button';
import SpinnerIcon from '@/app/components/ui/icons/SpinnerIcon';
import type { Todo } from '@/types/todo';
import { getSortedTodos, getSortOrderLabel, getNextSortOrder, type SortOrder } from '@/utils/todoSort';
import { TodoItem } from './TodoItem';
import { todosReducer } from './functions';

type Props = {
  todosPromise: Promise<Todo[]>;
};

export default function Todos({ todosPromise }: Props) {
  const initialTodos = use(todosPromise);
  const [todos, dispatch, isPending] = useActionState(todosReducer, initialTodos);
  const [optimisticTodos, setOptimisticTodos] = useOptimistic(todos);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  const statusChangeAction = (done: boolean, todo: Todo) => {
    const payload = { id: todo.id, updatedTodo: { ...todo, done } };
    setOptimisticTodos((prev: Todo[]) => {
      return prev.map(item => {
        return item.id === todo.id ? { ...item, done } : item;
      });
    });
    dispatch({ payload, type: 'edit' });
  };

  const deleteAction = (todoId: string) => {
    const payload = { id: todoId };
    setOptimisticTodos((prev: Todo[]) => {
      return prev.filter(item => {
        return item.id !== todoId;
      });
    });
    dispatch({ payload, type: 'delete' });
  };

  const addTodoAction = (title: string) => {
    const id = crypto.randomUUID();
    const createdAt = new Date();
    const todo: Todo = { createdAt, done: false, id, title, userId: '' };

    setOptimisticTodos((prev: Todo[]) => {
      return [todo, ...prev];
    });
    dispatch({ payload: { todo: { done: false, id, title } }, type: 'add' });
  };

  const sortedTodos = getSortedTodos(optimisticTodos, sortOrder);

  return (
    <>
      <AddTodoForm addAction={addTodoAction} />
      {optimisticTodos.length > 0 && <SortButton sortOrderAction={setSortOrder} sortOrder={sortOrder} />}
      <TodoList
        todos={sortedTodos}
        statusChangeAction={statusChangeAction}
        deleteAction={deleteAction}
        isEmpty={optimisticTodos.length === 0}
      />
      <TodoStats todos={optimisticTodos} isPending={isPending} />
    </>
  );
}

function AddTodoForm({ addAction }: { addAction: (title: string) => void }) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(formRef.current!);
    const title = formData.get('title')?.toString();
    if (!title?.trim()) return;

    startTransition(() => {
      addAction(title.trim());
    });
    formRef.current?.reset();
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <input type="text" name="title" placeholder="Add a new todo..." className="flex-1" required />
        <Button hideSpinner type="submit">
          Add Todo
        </Button>
      </div>
    </form>
  );
}

function TodoList({
  todos,
  statusChangeAction,
  deleteAction,
  isEmpty,
}: {
  todos: Todo[];
  statusChangeAction: (done: boolean, todo: Todo) => void;
  deleteAction: (todoId: string) => void;
  isEmpty: boolean;
}) {
  if (isEmpty) {
    return (
      <div className="space-y-2">
        <div className="surface-card-padded">
          <p className="text-text-muted">No todos yet. Add your first todo above! 🎯</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {todos.map(todo => {
        return (
          <ViewTransition key={todo.id}>
            <TodoItem
              done={todo.done}
              statusChangeAction={done => {
                return statusChangeAction(done, todo);
              }}
              deleteAction={() => {
                return deleteAction(todo.id);
              }}
            >
              {todo.title}
            </TodoItem>
          </ViewTransition>
        );
      })}
    </div>
  );
}

function TodoStats({ todos, isPending }: { todos: Todo[]; isPending: boolean }) {
  const completed = todos.filter(todo => {
    return todo.done;
  }).length;
  const remaining = todos.filter(todo => {
    return !todo.done;
  }).length;

  return (
    <div className="mt-8 text-center">
      <p className="text-text-muted text-sm">
        Total: {todos.length} • Completed: {completed} • Remaining: {remaining}
      </p>
      {isPending && (
        <div className="mt-2 animate-pulse text-xs font-medium text-orange-600" aria-live="polite">
          <span className="inline-flex items-center gap-1">
            <SpinnerIcon className="h-3 w-3" />
            Syncing to server…
          </span>
        </div>
      )}
    </div>
  );
}

function SortButton({
  sortOrderAction,
  sortOrder,
  setSortOrder,
}: {
  sortOrderAction?: (order: SortOrder) => Promise<void> | void;
  setSortOrder?: (order: SortOrder) => void;
  sortOrder: SortOrder;
}) {
  const [optimisticSortOrder, setOptimisticSortOrder] = useOptimistic(sortOrder);

  return (
    <div className="mb-4 flex justify-end">
      <Button
        type="button"
        variant="secondary"
        onClick={() => {
          const newSortOrder = getNextSortOrder(sortOrder);
          setSortOrder?.(newSortOrder);
          startTransition(async () => {
            setOptimisticSortOrder(newSortOrder);
            await sortOrderAction?.(newSortOrder);
          });
        }}
        className="text-sm"
      >
        {getSortOrderLabel(optimisticSortOrder)}
      </Button>
    </div>
  );
}

export function TodosSkeleton() {
  return (
    <div className="space-y-2">
      <div className="skeleton-animation mb-7 h-10 rounded-lg" />
      <div className="skeleton-animation h-16 rounded-lg" />
      <div className="skeleton-animation h-16 rounded-lg" />
    </div>
  );
}

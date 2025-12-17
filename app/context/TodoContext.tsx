import { createContext, useContext, useState } from 'react';

type Todo = { id: string; text: string; done: boolean; today: boolean };
type CompletedTodo = { id: string; text: string; completedAt: string };

type TodoContextType = {
  todos: Todo[];
  completedTodos: CompletedTodo[];
  addTodo: (text: string) => void;
  updateTodo: (id: string, text: string) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  markToday: (id: string) => void;
  completeTodo: (id: string) => void;
};

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<CompletedTodo[]>([]);

  const addTodo = (text: string) => {
    setTodos([...todos, { id: Date.now().toString(), text, done: false, today: false }]);
  };

  const updateTodo = (id: string, text: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, text } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const markToday = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, today: true } : t));
  };

  const completeTodo = (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      const completedAt = new Date().toLocaleString();
      setCompletedTodos([...completedTodos, { id: todo.id, text: todo.text, completedAt }]);
      setTodos(todos.filter(t => t.id !== id)); // 完了したらAll/Todayから削除
    }
  };

  return (
    <TodoContext.Provider value={{ todos, completedTodos, addTodo, updateTodo, deleteTodo, toggleTodo, markToday, completeTodo }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error("useTodos must be used inside TodoProvider");
  return ctx;
}
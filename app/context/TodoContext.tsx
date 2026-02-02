import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

type Todo = { id: string; text: string; done: boolean; today: boolean; isRoutine?: boolean; tagId?: string };
type CompletedTodo = { id: string; text: string; completedAt: string; tagId?: string };
type Tag = { id: string; name: string };
type StoredData = {
  todos?: Todo[];
  completedTodos?: CompletedTodo[];
  tags?: Tag[];
  nextId?: number;
};

type TodoContextType = {
  todos: Todo[];
  completedTodos: CompletedTodo[];
  tags: Tag[];
  addTag: (name: string) => string;
  deleteTag: (id: string) => void;
  addTodo: (text: string, isRoutine?: boolean, tagId?: string) => void;
  updateTodo: (id: string, text: string, tagId?: string) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  markToday: (id: string) => void;
  unmarkToday: (id: string) => void;
  completeTodo: (id: string) => void;
};

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const STORAGE_KEY = 'study-app2@todos';

const getMaxId = (items?: { id: string }[]) => {
  if (!items || items.length === 0) return 0;
  return Math.max(
    0,
    ...items.map(item => {
      const parsed = Number(item.id);
      return Number.isFinite(parsed) ? parsed : 0;
    })
  );
};

const computeNextIdFromData = (data: StoredData) => {
  const max = Math.max(getMaxId(data.todos), getMaxId(data.completedTodos), getMaxId(data.tags));
  return max + 1;
};

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<CompletedTodo[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [nextId, setNextId] = useState<number>(1);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const nextIdRef = useRef<number>(1);

  const genId = () => {
    const id = nextIdRef.current.toString();
    const next = nextIdRef.current + 1;
    nextIdRef.current = next;
    setNextId(next);
    return id;
  };

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) {
          if (isMounted) setIsHydrated(true);
          return;
        }
        const parsed: StoredData = JSON.parse(raw);
        if (!isMounted) return;
        setTodos(Array.isArray(parsed.todos) ? parsed.todos : []);
        setCompletedTodos(Array.isArray(parsed.completedTodos) ? parsed.completedTodos : []);
        setTags(Array.isArray(parsed.tags) ? parsed.tags : []);
        const next = typeof parsed.nextId === 'number' && parsed.nextId > 0
          ? parsed.nextId
          : computeNextIdFromData(parsed);
        nextIdRef.current = next;
        setNextId(next);
        setIsHydrated(true);
      } catch {
        if (isMounted) setIsHydrated(true);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    const save = async () => {
      try {
        const payload = JSON.stringify({ todos, completedTodos, tags, nextId });
        await AsyncStorage.setItem(STORAGE_KEY, payload);
      } catch {
        // noop
      }
    };
    save();
  }, [todos, completedTodos, tags, nextId, isHydrated]);

  const addTodo = (text: string, isRoutine: boolean = false, tagId?: string) => {
    setTodos(prev => [...prev, { id: genId(), text, done: false, today: false, isRoutine, tagId }]);
  };

  const addTag = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return '';
    let resolvedId = '';
    setTags(prev => {
      const existing = prev.find(t => t.name.toLowerCase() === trimmed.toLowerCase());
      if (existing) {
        resolvedId = existing.id;
        return prev;
      }
      const id = genId();
      resolvedId = id;
      return [...prev, { id, name: trimmed }];
    });
    return resolvedId;
  };

  const deleteTag = (id: string) => {
    setTags(prev => prev.filter(t => t.id !== id));
    setTodos(prev => prev.map(t => t.tagId === id ? { ...t, tagId: undefined } : t));
    setCompletedTodos(prev => prev.map(c => c.tagId === id ? { ...c, tagId: undefined } : c));
  };

  const updateTodo = (id: string, text: string, tagId?: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, text, tagId } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const markToday = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, today: true } : t));
  };

  const unmarkToday = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, today: false } : t));
  };

  const completeTodo = (id: string) => {
    setTodos(prev => {
      const todo = prev.find(t => t.id === id);
      if (!todo) return prev;
      const completedAt = new Date().toLocaleString();
      const completedItem = { id: genId(), text: todo.text, completedAt, tagId: todo.tagId };
      setCompletedTodos(prevCompleted => {
        const next = [completedItem, ...prevCompleted];
        return next.length > 30 ? next.slice(0, 30) : next;
      });
      if (todo.isRoutine) {
        // For routines: remove from Today only, keep in All Todos
        return prev.map(t => t.id === id ? { ...t, today: false } : t);
      }
      // Non-routine: remove completely
      return prev.filter(t => t.id !== id); // 完了したらAll/Todayから削除
    });
  };

  return (
    <TodoContext.Provider value={{ todos, completedTodos, tags, addTag, deleteTag, addTodo, updateTodo, deleteTodo, toggleTodo, markToday, unmarkToday, completeTodo }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error("useTodos must be used inside TodoProvider");
  return ctx;
}
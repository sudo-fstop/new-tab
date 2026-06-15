export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem("todos");
    if (!raw) return [];
    return JSON.parse(raw) as Todo[];
  } catch {
    return [];
  }
}

export function saveTodos(todos: Todo[]): void {
  localStorage.setItem("todos", JSON.stringify(todos));
}

export function addTodo(todos: Todo[], text: string): Todo[] {
  const trimmed = text.trim();
  if (!trimmed) return todos;
  const todo: Todo = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    text: trimmed,
    completed: false,
  };
  return [todo, ...todos];
}

export function toggleTodo(todos: Todo[], id: string): Todo[] {
  return todos.map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t,
  );
}

export function deleteTodo(todos: Todo[], id: string): Todo[] {
  return todos.filter((t) => t.id !== id);
}

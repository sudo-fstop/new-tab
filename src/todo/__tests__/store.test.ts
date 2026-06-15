import { describe, it, expect, beforeEach, vi } from "vitest";
import { loadTodos, saveTodos, addTodo, toggleTodo, deleteTodo } from "../store";
import type { Todo } from "../store";

function createLocalStorageMock(): Storage {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
}

describe("store", () => {
  let mockStorage: Storage;

  beforeEach(() => {
    mockStorage = createLocalStorageMock();
    vi.stubGlobal("localStorage", mockStorage);
  });

  describe("loadTodos", () => {
    it("returns empty array when localStorage has no todos key", () => {
      expect(loadTodos()).toEqual([]);
    });

    it("returns parsed array when localStorage has valid JSON", () => {
      const todos: Todo[] = [
        { id: "abc", text: "Test", completed: false },
      ];
      mockStorage.setItem("todos", JSON.stringify(todos));
      expect(loadTodos()).toEqual(todos);
    });

    it("returns empty array on malformed JSON", () => {
      mockStorage.setItem("todos", "not valid json{{{");
      expect(loadTodos()).toEqual([]);
    });
  });

  describe("saveTodos", () => {
    it("writes JSON to localStorage under todos key", () => {
      const todos: Todo[] = [{ id: "a", text: "Hello", completed: true }];
      saveTodos(todos);
      expect(JSON.parse(mockStorage.getItem("todos")!)).toEqual(todos);
    });
  });

  describe("addTodo", () => {
    it("prepends a new todo with the given text", () => {
      const existing: Todo[] = [{ id: "old", text: "Old", completed: false }];
      const result = addTodo(existing, "New task");
      expect(result).toHaveLength(2);
      expect(result[0].text).toBe("New task");
      expect(result[0].completed).toBe(false);
      expect(typeof result[0].id).toBe("string");
      expect(result[1]).toEqual(existing[0]);
    });

    it("returns unchanged array when text is empty", () => {
      const todos: Todo[] = [{ id: "a", text: "X", completed: false }];
      expect(addTodo(todos, "")).toBe(todos);
      expect(addTodo(todos, "   ")).toBe(todos);
    });
  });

  describe("toggleTodo", () => {
    it("flips completed state of matching todo", () => {
      const todos: Todo[] = [{ id: "a", text: "X", completed: false }];
      const result = toggleTodo(todos, "a");
      expect(result[0].completed).toBe(true);
    });

    it("returns unchanged array when id not found", () => {
      const todos: Todo[] = [{ id: "a", text: "X", completed: false }];
      const result = toggleTodo(todos, "nonexistent");
      expect(result).toEqual(todos);
    });
  });

  describe("deleteTodo", () => {
    it("removes the todo with matching id", () => {
      const todos: Todo[] = [
        { id: "a", text: "A", completed: false },
        { id: "b", text: "B", completed: false },
      ];
      const result = deleteTodo(todos, "a");
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("b");
    });

    it("returns unchanged array when id not found", () => {
      const todos: Todo[] = [{ id: "a", text: "X", completed: false }];
      const result = deleteTodo(todos, "nonexistent");
      expect(result).toEqual(todos);
    });
  });
});

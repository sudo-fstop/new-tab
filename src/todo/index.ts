import { injectStyles } from "./style";
import { createWidget, renderList, show } from "./render";
import { loadTodos, saveTodos, addTodo, toggleTodo, deleteTodo } from "./store";
import type { Todo } from "./store";

export function initTodo(): void {
  injectStyles();

  let todos: Todo[] = loadTodos();

  const widget = createWidget();
  const listEl = widget.querySelector(".todo-widget__list") as HTMLUListElement;
  const input = widget.querySelector(".todo-widget__input") as HTMLInputElement;

  function refresh(): void {
    renderList(listEl, todos, {
      onToggle(id) {
        todos = toggleTodo(todos, id);
        saveTodos(todos);
        refresh();
      },
      onDelete(id) {
        todos = deleteTodo(todos, id);
        saveTodos(todos);
        refresh();
      },
    });
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const text = input.value.trim();
      if (!text) return;
      todos = addTodo(todos, text);
      saveTodos(todos);
      input.value = "";
      refresh();
    }
  });

  refresh();

  const container = document.getElementById("widgets");
  if (container) {
    container.appendChild(widget);
  } else {
    document.body.appendChild(widget);
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      show(widget);
    });
  });
}

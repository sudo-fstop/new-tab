import type { Todo } from "./store";

export function createWidget(): HTMLElement {
  const widget = document.createElement("div");
  widget.className = "todo-widget";

  const title = document.createElement("div");
  title.className = "todo-widget__title";
  title.textContent = "Todos";

  const inputRow = document.createElement("div");
  inputRow.className = "todo-widget__input-row";

  const input = document.createElement("input");
  input.type = "text";
  input.className = "todo-widget__input";
  input.placeholder = "Add a todo\u2026";

  inputRow.appendChild(input);

  const list = document.createElement("ul");
  list.className = "todo-widget__list";

  widget.appendChild(title);
  widget.appendChild(inputRow);
  widget.appendChild(list);

  return widget;
}

export function renderList(
  listEl: HTMLUListElement,
  todos: Todo[],
  callbacks: { onToggle: (id: string) => void; onDelete: (id: string) => void },
): void {
  listEl.innerHTML = "";

  if (todos.length === 0) {
    const empty = document.createElement("li");
    empty.className = "todo-widget__empty";
    empty.textContent = "No todos yet";
    listEl.appendChild(empty);
    return;
  }

  for (const todo of todos) {
    const li = document.createElement("li");
    li.className = "todo-widget__item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-widget__checkbox";
    checkbox.checked = todo.completed;
    checkbox.addEventListener("click", () => callbacks.onToggle(todo.id));

    const text = document.createElement("span");
    text.className = `todo-widget__text${todo.completed ? " todo-widget__text--completed" : ""}`;
    text.textContent = todo.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "todo-widget__delete";
    deleteBtn.textContent = "\u2715";
    deleteBtn.addEventListener("click", () => callbacks.onDelete(todo.id));

    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(deleteBtn);
    listEl.appendChild(li);
  }
}

export function show(widget: HTMLElement): void {
  widget.classList.add("visible");
}

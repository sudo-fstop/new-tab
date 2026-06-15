import { describe, it, expect, vi } from "vitest";
import { createWidget, renderList, show } from "../render";
import type { Todo } from "../store";

describe("render", () => {
  describe("createWidget", () => {
    it("returns an element with class todo-widget", () => {
      const widget = createWidget();
      expect(widget.classList.contains("todo-widget")).toBe(true);
    });

    it("contains an input element with class todo-widget__input", () => {
      const widget = createWidget();
      const input = widget.querySelector(".todo-widget__input");
      expect(input).not.toBeNull();
      expect(input?.tagName).toBe("INPUT");
    });

    it("contains a ul element with class todo-widget__list", () => {
      const widget = createWidget();
      const list = widget.querySelector(".todo-widget__list");
      expect(list).not.toBeNull();
      expect(list?.tagName).toBe("UL");
    });
  });

  describe("renderList", () => {
    it("shows empty placeholder when todos array is empty", () => {
      const ul = document.createElement("ul");
      renderList(ul, [], { onToggle: vi.fn(), onDelete: vi.fn() });
      const empty = ul.querySelector(".todo-widget__empty");
      expect(empty).not.toBeNull();
      expect(empty?.textContent).toBe("No todos yet");
    });

    it("renders correct number of list items for given todos", () => {
      const ul = document.createElement("ul");
      const todos: Todo[] = [
        { id: "1", text: "First", completed: false },
        { id: "2", text: "Second", completed: false },
      ];
      renderList(ul, todos, { onToggle: vi.fn(), onDelete: vi.fn() });
      const items = ul.querySelectorAll(".todo-widget__item");
      expect(items).toHaveLength(2);
    });

    it("marks completed todos with completed text class and checked checkbox", () => {
      const ul = document.createElement("ul");
      const todos: Todo[] = [{ id: "1", text: "Done", completed: true }];
      renderList(ul, todos, { onToggle: vi.fn(), onDelete: vi.fn() });
      const text = ul.querySelector(".todo-widget__text--completed");
      expect(text).not.toBeNull();
      const checkbox = ul.querySelector(
        ".todo-widget__checkbox",
      ) as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
    });

    it("calls onToggle callback with correct id when checkbox clicked", () => {
      const ul = document.createElement("ul");
      const onToggle = vi.fn();
      const todos: Todo[] = [{ id: "abc", text: "Test", completed: false }];
      renderList(ul, todos, { onToggle, onDelete: vi.fn() });
      const checkbox = ul.querySelector(
        ".todo-widget__checkbox",
      ) as HTMLInputElement;
      checkbox.click();
      expect(onToggle).toHaveBeenCalledWith("abc");
    });

    it("calls onDelete callback with correct id when delete button clicked", () => {
      const ul = document.createElement("ul");
      const onDelete = vi.fn();
      const todos: Todo[] = [{ id: "xyz", text: "Test", completed: false }];
      renderList(ul, todos, { onToggle: vi.fn(), onDelete });
      const btn = ul.querySelector(".todo-widget__delete") as HTMLButtonElement;
      btn.click();
      expect(onDelete).toHaveBeenCalledWith("xyz");
    });
  });

  describe("show", () => {
    it('adds "visible" class to widget element', () => {
      const el = document.createElement("div");
      show(el);
      expect(el.classList.contains("visible")).toBe(true);
    });
  });
});

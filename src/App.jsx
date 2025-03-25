import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useState } from "react";
import "./App.css"; // Подключаем CSS-файл

// Zustand store with persist middleware
const useTodoStore = create(
  persist(
    (set) => ({
      tasks: [],
      addTask: (text) =>
        set((state) => ({
          tasks: [...state.tasks, { id: Date.now(), text, completed: false }],
        })),
      removeTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        })),
      updateTask: (id, newText) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, text: newText } : task
          ),
        })),
    }),
    { name: "todo-storage" }
  )
);

export default function App() {
  const { tasks, addTask, removeTask, toggleTask, updateTask } = useTodoStore();
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const filteredTasks = tasks.filter((task) =>
    filter === "all"
      ? true
      : filter === "completed"
      ? task.completed
      : !task.completed
  );

  return (
    <div className="todo-container">
      <h1 className="todo-title">📌 ToDo App</h1>
      <div className="todo-input-container">
        <input
          className="todo-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new task..."
        />
        <button
          className="todo-add-button"
          onClick={() => {
            addTask(text);
            setText("");
          }}
        >
          ➕
        </button>
      </div>
      <div className="todo-filters">
        <button
          className={filter === "all" ? "active-filter" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "completed" ? "active-filter" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
        <button
          className={filter === "pending" ? "active-filter" : ""}
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>
      </div>
      <ul className="todo-list">
        {filteredTasks.map((task) => (
          <li key={task.id} className="todo-item">
            {editingId === task.id ? (
              <input
                className="todo-edit-input"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
            ) : (
              <span className={task.completed ? "completed-task" : ""}>
                {task.text}
              </span>
            )}
            <div className="todo-buttons">
              {editingId === task.id ? (
                <button
                  className="todo-save-button"
                  onClick={() => {
                    updateTask(task.id, editText);
                    setEditingId(null);
                  }}
                >
                  💾
                </button>
              ) : (
                <button
                  className="todo-edit-button"
                  onClick={() => {
                    setEditingId(task.id);
                    setEditText(task.text);
                  }}
                >
                  ✏️
                </button>
              )}
              <button
                className="todo-complete-button"
                onClick={() => toggleTask(task.id)}
              >
                ✔
              </button>
              <button
                className="todo-delete-button"
                onClick={() => removeTask(task.id)}
              >
                ❌
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

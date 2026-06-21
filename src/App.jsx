import { useState, useEffect } from "react";

function App() {
  const [task, setTask] = useState("");

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState("all");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (task.trim() === "") return;

    if (editId) {
      setTasks(
        tasks.map((t) => (t.id === editId ? { ...t, text: task } : t))
      );
      setEditId(null);
      setTask("");
      return;
    }

    const newTask = {
      id: Date.now(),
      text: task,
      completed: false,
    };

    setTasks((prev) => [...prev, newTask]);
    setTask("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const editTask = (item) => {
    setTask(item.text);
    setEditId(item.id);
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const clearCompleted = () => {
    setTasks(tasks.filter((t) => !t.completed));
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="container">
      <div className="todo-card">
        <header className="header">
          <div className="header-icon">✓</div>
          <h1>Beautiful Todo</h1>
          <p className="header-subtitle">Stay organized, one task at a time</p>
          {tasks.length > 0 && (
            <div className="task-stats">
              <span>{activeCount} active</span>
              <span>·</span>
              <span>{tasks.length} total</span>
            </div>
          )}
        </header>

        <div className="input-section">
          <input
            type="text"
            placeholder={editId ? "Update your task..." : "What needs to be done?"}
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <button className="btn-primary" onClick={addTask}>
            {editId ? "Update" : "Add"}
          </button>
        </div>

        <div className="filter-buttons">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={filter === "active" ? "active" : ""}
            onClick={() => setFilter("active")}
          >
            Active
          </button>
          <button
            className={filter === "completed" ? "active" : ""}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
        </div>

        <div className="task-list">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <p>
                {filter === "completed"
                  ? "No completed tasks yet"
                  : filter === "active"
                    ? "All caught up! No active tasks"
                    : "No tasks yet — add one above!"}
              </p>
            </div>
          ) : (
            filteredTasks.map((item) => (
              <div
                className={`task ${item.completed ? "task--done" : ""}`}
                key={item.id}
              >
                <div className="task-left">
                  <label className="task-checkbox">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleTask(item.id)}
                    />
                    <span className="checkmark" />
                  </label>
                  <span
                    className={`task-text ${item.completed ? "completed" : ""}`}
                  >
                    {item.text}
                  </span>
                </div>

                <div className="task-actions">
                  <button
                    className="icon-btn edit-btn"
                    onClick={() => editTask(item)}
                    aria-label="Edit task"
                  >
                    ✏️
                  </button>
                  <button
                    className="icon-btn delete-btn"
                    onClick={() => deleteTask(item.id)}
                    aria-label="Delete task"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {completedCount > 0 && (
          <div className="footer">
            <button className="btn-clear" onClick={clearCompleted}>
              Clear {completedCount} completed
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

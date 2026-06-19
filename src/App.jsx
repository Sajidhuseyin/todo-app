 import { useState, useEffect } from "react";

function App() {
  const [task, setTask] = useState("");

  // IMPORTANT: load directly from localStorage safely
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState("all");
  const [editId, setEditId] = useState(null);

  // Save whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add task
  const addTask = () => {
  if (task.trim() === "") return;

  // Update existing task
  if (editId) {
    setTasks(
      tasks.map((t) =>
        t.id === editId
          ? { ...t, text: task }
          : t
      )
    );

    setEditId(null);
    setTask("");
    return;
  }

  // Add new task
  const newTask = {
    id: Date.now(),
    text: task,
    completed: false,
  };

  setTasks((prev) => [...prev, newTask]);
  setTask("");
};

  // Delete task
  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };
  
  // Edit task
  const editTask = (item) => {
    setTask(item.text);
    setEditId(item.id);
  };

  // Toggle complete
  const toggleTask = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const filteredTasks = tasks.filter((t) => {
  if (filter === "active") return !t.completed;
  if (filter === "completed") return t.completed;
  return true;
});

  return (
    <div className="container">
      <div className="todo-card">
        <h1>Todo App</h1>

        {/* Input */}
        <div className="input-section">
          <input
            type="text"
            placeholder="Enter task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}

          />

          <button onClick={addTask}>{editId ? "Update" : "Add"} </button>
        </div>
        <div className="filter-buttons">

  <button onClick={() => setFilter("all")}>
    All
  </button>

  <button onClick={() => setFilter("active")}>
    Active
  </button>

  <button onClick={() => setFilter("completed")}>
    Completed
  </button>

</div>

        {/* List */}
        <div className="task-list">
          {filteredTasks.map((item) => (
            <div className="task" key={item.id}>
              <div className="task-left">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleTask(item.id)}
                />

                <span className={item.completed ? "completed" : ""}>
                  {item.text}
                </span>
              </div>

               <div>
                <button className="edit-btn" onClick={() => editTask(item)} >Edit
                </button>
                <button className="delete-btn" onClick={() => deleteTask(item.id)} > Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
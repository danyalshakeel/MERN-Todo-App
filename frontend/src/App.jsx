import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/todos");
        setTodos(response.data);
      } catch (error) {
        console.log("Error fetching todos:", error);
      }
    };
    fetchTodos();
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      const response = await axios.post("http://localhost:5000/api/todos", {
        title: newTodo,
      });
      setTodos([...todos, response.data]);
      setNewTodo("");
    } catch (error) {
      console.log("Error while adding Todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.log("Error while deleting Todo:", error);
    }
  };

  const toggleDone = async (id, currentDone) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/todos/${id}`,
        { done: !currentDone }
      );
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
    } catch (error) {
      console.log("Error while updating Todo:", error);
    }
  };

  const startEditing = (todo) => {
    setEditingTodoId(todo._id);
    setEditedTitle(todo.title);
  };

  const cancelEditing = () => {
    setEditingTodoId(null);
    setEditedTitle("");
  };

  const saveEdit = async (id) => {
    if (!editedTitle.trim()) return;
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/todos/${id}`,
        { title: editedTitle }
      );
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
      cancelEditing();
    } catch (error) {
      console.log("Error while editing Todo:", error);
    }
  };

  const completedCount = todos.filter((todo) => todo.done).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-lg p-8 border border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            My Tasks
          </h1>
          <p className="text-gray-500 mt-2">
            {todos.length === 0
              ? "No tasks yet. Add one below!"
              : `${completedCount} of ${todos.length} tasks completed`}
          </p>
        </div>

        {/* Progress bar */}
        {todos.length > 0 && (
          <div className="mb-6">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500 ease-out"
                style={{
                  width: `${(completedCount / todos.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Add Todo Form */}
        <form
          className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl mb-6 border-2 border-transparent focus-within:border-violet-300 focus-within:bg-white transition-all duration-300"
          onSubmit={addTodo}
        >
          <div className="pl-2">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
            required
            className="flex-1 px-2 py-3 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/30 active:scale-95"
          >
            Add
          </button>
        </form>

        {/* Todo List */}
        <ul className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
          {todos.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <svg
                  className="w-10 h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <p className="text-gray-500">Your task list is empty</p>
            </div>
          ) : (
            todos.map((todo) => (
              <li
                key={todo._id}
                className={`group p-4 rounded-2xl border-2 transition-all duration-300 hover:shadow-md ${
                  todo.done
                    ? "bg-gray-50 border-gray-100"
                    : "bg-white border-gray-100 hover:border-violet-200"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Custom Checkbox */}
                    <button
                      onClick={() => toggleDone(todo._id, todo.done)}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        todo.done
                          ? "bg-gradient-to-r from-violet-500 to-indigo-600 border-transparent"
                          : "border-gray-300 hover:border-violet-400"
                      }`}
                    >
                      {todo.done && (
                        <svg
                          className="w-3.5 h-3.5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>

                    {/* Title or Edit Input */}
                    {editingTodoId === todo._id ? (
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="flex-1 px-3 py-2 border-2 border-violet-300 rounded-xl focus:outline-none focus:border-violet-500 bg-white"
                        autoFocus
                      />
                    ) : (
                      <span
                        className={`text-lg truncate transition-all duration-300 ${
                          todo.done
                            ? "line-through text-gray-400"
                            : "text-gray-700"
                        }`}
                      >
                        {todo.title}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1">
                    {editingTodoId === todo._id ? (
                      <>
                        <button
                          onClick={() => saveEdit(todo._id)}
                          className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all duration-200"
                          title="Save"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-all duration-200"
                          title="Cancel"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(todo)}
                          className="p-2 text-gray-400 hover:text-violet-500 hover:bg-violet-50 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100"
                          title="Edit"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteTodo(todo._id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100"
                          title="Delete"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>

        {/* Footer */}
        {todos.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-400">
              {todos.length - completedCount} tasks remaining
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
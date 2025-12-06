import express from "express";
import Todo from "../models/todo.model.js";

const router = express.Router();

// GET all todos
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 }); // Sort by newest first
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Create new todo
router.post("/", async (req, res) => {
  try {
    // Fix 1: Use 'new Todo()' with 'save()' OR just 'Todo.create()' - not both
    const newTodo = new Todo({
      title: req.body.title,
    });
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH - Update todo
router.patch("/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (req.body.title !== undefined) {
      todo.title = req.body.title;
    }
    if (req.body.done !== undefined) {
      todo.done = req.body.done;
    }

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Fix 2: Add 'req' and 'res' parameters to the delete route
router.delete("/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json({ message: "Todo deleted successfully", todo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
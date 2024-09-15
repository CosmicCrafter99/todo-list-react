const express = require('express');
const Todo = require('../models/Todo');

const router = express.Router();

// Получение задач с фильтрацией
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    const { filter } = req.query;

    try {
        let query = { userId };

        if (filter === 'completed') {
            query.completed = true;
        } else if (filter === 'incomplete') {
            query.completed = false;
        }

        const todos = await Todo.find(query);
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Создание новой задачи
router.post('/', async (req, res) => {
    const { text, userId } = req.body;
    try {
        const newTodo = new Todo({
            text,
            userId
        });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка при создании задачи' });
    }
});

// Обновление статуса задачи
router.put('/:id/text', async (req, res) => {
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            { text: req.body.text },
            { new: true }
        );
        res.json(updatedTodo);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка при обновлении текст задачи' });
    }
});

// Обновление статуса задачи
router.put('/:id/status', async (req, res) => {
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            { completed: req.body.completed },
            { new: true }
        );
        res.json(updatedTodo);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка при обновлении статуса задачи' });
    }
});

// Удаление задачи
router.delete('/:id', async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.json({ message: 'Задача удалена' });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка при удалении задачи' });
    }
});

module.exports = router;
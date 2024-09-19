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
    const { text, userId, order } = req.body;
    try {
        const newTodo = new Todo({
            text,
            userId,
            order
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

// Маршрут для обновления порядка задач
router.put('/:userId/order', async (req, res) => {
    const { userId } = req.params;
    const { tasks } = req.body;

    try {
        // Обновление порядка задач в базе данных
        for (let i = 0; i < tasks.length; i++) {
            await Todo.updateOne({ _id: tasks[i]._id, userId }, { $set: { order: i } });
        }

        res.status(200).json({ message: 'Порядок задач обновлен' });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка при обновлении порядка задач', error: err });
    }
});

module.exports = router;
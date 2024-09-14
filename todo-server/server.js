const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const todoRoutes = require('./routes/todos');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Подключение маршрутов
app.use('/api/todos', todoRoutes);

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Подключено к MongoDB'))
    .catch(err => console.log('Ошибка подключения к MongoDB:', err));

// Запуск сервера
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
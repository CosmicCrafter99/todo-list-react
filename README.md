# Todo List React App

Это простое приложение для управления задачами, созданное с использованием React для фронтенда и Node.js/Express для бэкенда.

## Структура проекта

-`todo-client/` - Фронтенд часть приложения (React)

-`todo-server/` - Бэкенд часть приложения (Node.js/Express)

## Установка и запуск

### Фронтенд

1. Перейдите в директорию `client`:

   ```sh
   cd todo-client 
   ```
2. Установите зависимости:

   ```sh

   npm install 
   ```
3. Запустите приложение:

   ```sh

   npm start 
   ```

### Бэкенд

1. Перейдите в директорию `server`:

   ```sh

   cd todo-server 
   ```
2. Установите зависимости:

   ```sh

   npm install 
   ```
3. Создайте файл `.env` в корне директории `server` и добавьте переменные окружения:

   ```env

   PORT=3001

   MONGO_URI=your_mongodb_connection_string

   ```
4. Запустите сервер:

   ```sh

   npm start 
   ```

## Использование

После запуска фронтенда и бэкенда, откройте браузер и перейдите по адресу `http://localhost:3000` для использования приложения.

## Компоненты

### App.jsx

Главный компонент приложения, который управляет состоянием задач и взаимодействует с сервером для получения и обновления данных.

### TodoForm.jsx

Компонент формы для добавления новой задачи.

### TodoList.jsx

Компонент списка задач. Сортирует задачи так, чтобы завершенные задачи отображались последними.

### TodoItem.jsx

Компонент отдельной задачи. Включает функциональность для редактирования, удаления и завершения задачи. Если задача завершена, кнопки "Save" и "Delete" не отображаются. Также добавлена кнопка "Cancel" для отмены редактирования.
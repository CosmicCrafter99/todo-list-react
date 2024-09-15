# Todo Server

Это серверная часть приложения для управления задачами (Todo). Приложение разработано с использованием Node.js и Express.

## Установка

1. Клонируйте репозиторий:

   ```sh
   git clone https://github.com/your-username/todo-server.git
   ```
2. Перейдите в директорию проекта:

   ```sh
   cd todo-server
   ```
3. Установите зависимости:

   ```sh
   npm install
   ```

## Настройка переменных окружения

Создайте файл `.env` в корневой директории проекта и добавьте туда ваши переменные окружения. Например:

```env
PORT=3001
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.bspfs.mongodb.net/todo-db 
```

## Запуск сервера

Для запуска сервера в режиме разработки выполните:

```
npm run start 
```

Сервер будет доступен по адресу [http://localhost:3001](vscode-file://vscode-app/Users/dariagritsienko/Desktop/Visual%20Studio%20Code.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html).

## Структура проекта

* `src/` - исходный код приложения

  * `models/` - модели данных
  * `routes/` - маршруты
  * `server.js` - основной файл приложения

## Используемые технологии

* [Node.js](vscode-file://vscode-app/Users/dariagritsienko/Desktop/Visual%20Studio%20Code.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)
* [Express](vscode-file://vscode-app/Users/dariagritsienko/Desktop/Visual%20Studio%20Code.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)
* [Mongoose](vscode-file://vscode-app/Users/dariagritsienko/Desktop/Visual%20Studio%20Code.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)

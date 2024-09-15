
# Todo Client

Это клиентская часть приложения для управления задачами (Todo). Приложение разработано с использованием React и Vite.

## Установка

1. Клонируйте репозиторий:

   ```sh

   git clone https://github.com/your-username/todo-client.git 
   ```
2. Перейдите в директорию проекта:

   ```sh

   cd todo-client 
   ```
3. Установите зависимости:

   ```sh

   npm install 
   ```

## Настройка переменных окружения

Создайте файл `.env` в корневой директории проекта и добавьте туда ваши переменные окружения. Например:

```env

VITE_API_URL=http://localhost:3001/api/todos 
```

## Запуск приложения

Для запуска приложения в режиме разработки выполните:

```
npm run start
```

Приложение будет доступно по адресу [http://localhost:3000](vscode-file://vscode-app/Users/dariagritsienko/Desktop/Visual%20Studio%20Code.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html).

## Сборка приложения

Для сборки приложения выполните:

```
npm run build 
```

Собранное приложение будет находиться в директории `dist`.

## Тестирование

Для запуска тестов выполните:

```
npm run test 
```

## Структура проекта

* `src/` - исходный код приложения
  * `components/` - компоненты React
  * `App.jsx` - главный компонент приложения
  * `index.jsx` - точка входа в приложение
* `public/` - статические файлы
* `dist/` - собранное приложение (создается после выполнения команды `npm run build`)

## Используемые технологии

* [React](vscode-file://vscode-app/Users/dariagritsienko/Desktop/Visual%20Studio%20Code.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)
* [Vite](vscode-file://vscode-app/Users/dariagritsienko/Desktop/Visual%20Studio%20Code.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)
* [Axios](vscode-file://vscode-app/Users/dariagritsienko/Desktop/Visual%20Studio%20Code.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)

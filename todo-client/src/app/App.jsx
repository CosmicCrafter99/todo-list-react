import Home from '../pages/home/Home';
import AppHeader from '../shared/ui/app-header/AppHeader';
import TodoPage from '../pages/todo/TodoPage';
import './styles/App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

/**
 * Главный компонент приложения с подключением к серверу
 * @component
 * @returns {JSX.Element}
 */
function App() {
  return (
    <Router>
      <div className="app">
        <AppHeader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/todo" element={<TodoPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
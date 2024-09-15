import PropTypes from 'prop-types';
import './TodoFilter.css';

/**
 * Компонент фильтрации задач.
 * @param {Object} props - Свойства компонента.
 * @param {string} props.filter - Текущий фильтр.
 * @param {function(string): void} props.setFilter - Функция для установки фильтра.
 * @returns {JSX.Element} Компонент TodoFilter.
 */
function TodoFilter({ filter, setFilter }) {
    return (
        <div className="todo-filter">
            <button
                className={`filter-button ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
            >
                All
            </button>
            <button
                className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
                onClick={() => setFilter('completed')}
            >
                Completed
            </button>
            <button
                className={`filter-button ${filter === 'incomplete' ? 'active' : ''}`}
                onClick={() => setFilter('incomplete')}
            >
                Incomplete
            </button>
        </div>
    );
}

TodoFilter.propTypes = {
    filter: PropTypes.string.isRequired,
    setFilter: PropTypes.func.isRequired,
};

export default TodoFilter;
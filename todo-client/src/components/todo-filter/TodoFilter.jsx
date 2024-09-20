import PropTypes from 'prop-types';
import './TodoFilter.css';

/**
 * Компонент фильтрации задач.
 * @param {Object} props - Свойства компонента.
 * @param {string} props.filter - Текущий фильтр.
 * @param {string} props.deadlineFilter - Текущий фильтр по дедлайну.
 * @param {function(string): void} props.setDeadlineFilter - Функция для установки фильтра по дедлайну.
 * @param {function(string): void} props.setFilter - Функция для установки фильтра.
 * @returns {JSX.Element} Компонент TodoFilter.
 */
function TodoFilter({ filter, setFilter, deadlineFilter, setDeadlineFilter }) {
    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const handleDeadlineFilterChange = (event) => {
        setDeadlineFilter(event.target.value);
    };

    return (
        <div className="todo-filter">
            <select id="filter" value={filter} onChange={handleFilterChange}>
                <option value="all">All</option>
                <option value="completed">Completed</option>
                <option value="incomplete">Incomplete</option>
            </select>
            <select id="deadline-filter" value={deadlineFilter} onChange={handleDeadlineFilterChange}>
                <option value="all-time">All time</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="this-week">This week</option>
                <option value="next-week">Next week</option>
            </select>
        </div>
    );
}

TodoFilter.propTypes = {
    filter: PropTypes.string.isRequired,
    setFilter: PropTypes.func.isRequired,
    deadlineFilter: PropTypes.string.isRequired,
    setDeadlineFilter: PropTypes.func.isRequired,
};

export default TodoFilter;
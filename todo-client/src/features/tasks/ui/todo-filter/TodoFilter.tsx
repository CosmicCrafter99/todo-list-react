import { DeadlineFilter, Filter } from '../../../../shared/types/filters';
import './TodoFilter.css';

interface TodoFilterProps {
    filter: Filter;
    setFilter: (filter: Filter) => void;
    deadlineFilter: DeadlineFilter;
    setDeadlineFilter: (deadlineFilter: DeadlineFilter) => void;
}

/**
 * Компонент фильтрации задач.
 * @param {TodoFilterProps} props - Свойства компонента.
 * @returns {JSX.Element} Компонент TodoFilter.
 */
const TodoFilter: React.FC<TodoFilterProps> = ({ filter, setFilter, deadlineFilter, setDeadlineFilter }) => {
    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter(event.target.value as Filter);
    };

    const handleDeadlineFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setDeadlineFilter(event.target.value as DeadlineFilter);
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
};

export default TodoFilter;

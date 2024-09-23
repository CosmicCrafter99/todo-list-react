import { Task } from '../types/task';
import { Filter, DeadlineFilter } from '../types/filters';

/**
 * Filters and sorts tasks based on their completion status and deadline.
 *
 * @param {Task[]} tasks - The array of tasks to filter.
 * @param {Filter} filter - The filter to apply based on task completion status. 
 *                          Can be 'all', 'completed', or 'incomplete'.
 * @param {DeadlineFilter} deadlineFilter - The filter to apply based on task deadlines.
 *                                          Can be 'all-time', 'today', 'tomorrow', 'this-week', or 'next-week'.
 * @returns {Task[]} - The filtered and sorted array of tasks.
 */
export const filterTasks = (tasks: Task[], filter: Filter, deadlineFilter: DeadlineFilter): Task[] => {
    let filteredTasks = tasks;

    if (filter !== 'all') {
        filteredTasks = filteredTasks.filter(task => filter === 'completed' ? task.completed : !task.completed);
    }

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Понедельник текущей недели
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7); // Воскресенье текущей недели

    const startOfNextWeek = new Date(endOfWeek);
    startOfNextWeek.setDate(endOfWeek.getDate()); // Понедельник следующей недели
    const endOfNextWeek = new Date(startOfNextWeek);
    endOfNextWeek.setDate(startOfNextWeek.getDate() + 7); // Воскресенье следующей недели

    switch (deadlineFilter) {
        case 'today':
            filteredTasks = filteredTasks.filter(task => {
                if (!task.deadline) return false;
                const taskDate = new Date(task.deadline);
                return taskDate.toDateString() === today.toDateString();
            });
            break;
        case 'tomorrow':
            filteredTasks = filteredTasks.filter(task => {
                if (!task.deadline) return false;
                const taskDate = new Date(task.deadline);
                return taskDate.toDateString() === tomorrow.toDateString();
            });
            break;
        case 'this-week':
            filteredTasks = filteredTasks.filter(task => {
                if (!task.deadline) return false;
                const taskDate = new Date(task.deadline);
                return taskDate >= startOfWeek && taskDate <= endOfWeek;
            });
            break;
        case 'next-week':
            filteredTasks = filteredTasks.filter(task => {
                if (!task.deadline) return false;
                const taskDate = new Date(task.deadline);
                return taskDate >= startOfNextWeek && taskDate <= endOfNextWeek;
            });
            break;
        default:
            break;
    }

    if (deadlineFilter !== 'all-time') {
        filteredTasks.sort((a, b) => {
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        });
    }

    return filteredTasks;
};
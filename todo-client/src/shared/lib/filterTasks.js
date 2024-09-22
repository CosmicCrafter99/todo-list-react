export const filterTasks = (tasks, filter, deadlineFilter) => {
    let filteredTasks = tasks;

    if (filter !== 'all') {
        filteredTasks = filteredTasks.filter(task => filter === 'completed' ? task.completed : !task.completed);
    }

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Начало и конец текущей недели
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Понедельник текущей недели
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7); // Воскресенье текущей недели

    // Начало и конец следующей недели
    const startOfNextWeek = new Date(endOfWeek);
    startOfNextWeek.setDate(endOfWeek.getDate()); // Понедельник следующей недели
    const endOfNextWeek = new Date(startOfNextWeek);
    endOfNextWeek.setDate(startOfNextWeek.getDate() + 7); // Воскресенье следующей недели

    switch (deadlineFilter) {
        case 'today':
            filteredTasks = filteredTasks.filter(task => {
                const taskDate = new Date(task.deadline);
                return taskDate.toDateString() === today.toDateString();
            });
            break;
        case 'tomorrow':
            filteredTasks = filteredTasks.filter(task => {
                const taskDate = new Date(task.deadline);
                return taskDate.toDateString() === tomorrow.toDateString();
            });
            break;
        case 'this-week':
            filteredTasks = filteredTasks.filter(task => {
                const taskDate = new Date(task.deadline);
                return taskDate >= startOfWeek && taskDate <= endOfWeek;
            });
            break;
        case 'next-week':
            filteredTasks = filteredTasks.filter(task => {
                const taskDate = new Date(task.deadline);
                return taskDate >= startOfNextWeek && taskDate <= endOfNextWeek;
            });
            break;
        default:
            break;
    }


    if (deadlineFilter !== 'all-time') {
        // Сортировка по возрастанию дедлайна
        filteredTasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    }

    return filteredTasks;
};
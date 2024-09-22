export const getIsDeadlineOverdue = (deadline) => {
    const deadlineDateTime = new Date(deadline);
    const now = new Date();
    const deadlineTime = deadline.includes('T') ? deadline.split('T')[1].slice(0, 5) : '';
    const isDeadlineOverdue = deadlineDateTime < now && !(deadlineDateTime.toDateString() === now.toDateString() && !deadlineTime);

    return isDeadlineOverdue;
}
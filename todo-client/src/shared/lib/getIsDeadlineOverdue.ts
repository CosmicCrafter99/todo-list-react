/**
 * Determines if the given deadline is overdue.
 *
 * @param {string} deadline - The deadline date and time in ISO 8601 format.
 * @returns {boolean} - Returns `true` if the deadline is overdue, otherwise `false`.
 */
export const getIsDeadlineOverdue = (deadline: string): boolean => {
    const deadlineDateTime = new Date(deadline);
    const now = new Date();
    const deadlineTime = deadline.includes('T') ? deadline.split('T')[1].slice(0, 5) : '';
    const isDeadlineOverdue = deadlineDateTime < now && !(deadlineDateTime.toDateString() === now.toDateString() && !deadlineTime);

    return isDeadlineOverdue;
}
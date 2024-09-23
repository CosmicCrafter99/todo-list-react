/**
 * Formats a deadline date and time into an ISO 8601 string.
 *
 * @param {string | null} deadlineDate - The date of the deadline in YYYY-MM-DD format, or null if no date is provided.
 * @param {string | null} deadlineTime - The time of the deadline in HH:MM format, or null if no time is provided.
 * @returns {string} The formatted deadline as an ISO 8601 string.
 *
 * @example
 * // Returns '2023-10-05T14:30:00'
 * formatDeadline('2023-10-05', '14:30');
 *
 * @example
 * // Returns '2023-10-05T00:00:00'
 * formatDeadline('2023-10-05', null);
 *
 * @example
 * // Returns '2023-10-05T14:30:00' (if the current date is 2023-10-05 and the current time is before 14:30)
 * formatDeadline(null, '14:30');
 *
 * @example
 * // Returns '2023-10-06T14:30:00' (if the current date is 2023-10-05 and the current time is after 14:30)
 * formatDeadline(null, '14:30');
 */
export const formatDeadline = (deadlineDate: string | null, deadlineTime: string | null): string => {
    let deadline = deadlineDate || '';

    if (deadlineTime) {
        const today = new Date();
        const [hours, minutes] = deadlineTime.split(':').map(Number);
        today.setHours(hours, minutes, 0, 0);

        if (deadlineDate) {
            deadline = `${deadlineDate}T${deadlineTime}:00`;
        } else {
            if (today < new Date()) {
                today.setDate(today.getDate() + 1);
            }
            const day = String(today.getDate()).padStart(2, '0');
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const year = today.getFullYear();
            deadline = `${year}-${month}-${day}T${deadlineTime}:00`;
        }
    }

    return deadline;
}
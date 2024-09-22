export const formatDeadline = (deadlineDate, deadlineTime) => {
    let deadline = deadlineDate;

    if (deadlineTime) {
        const today = new Date();
        const [hours, minutes] = deadlineTime.split(':');
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
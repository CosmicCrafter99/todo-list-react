export interface Task {
    _id: string;
    text: string;
    description: string;
    completed: boolean;
    order: number;
    deadline?: string;
    userId: string;
}

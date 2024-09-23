import axios from 'axios';
import { API_URL } from '../config/constants';
import { Task } from '../types/task';

export const postTask = async (task: Task): Promise<Task> => {
    const res = await axios.post<Task>(`${API_URL}`, task);
    return res.data;
}
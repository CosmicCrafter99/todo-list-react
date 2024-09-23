import axios from 'axios';
import { API_URL } from '../config/constants';
import { Task } from '../types/task';

export const putOrder = async (uid: string, tasks: Task[]): Promise<any> => {
    const res = await axios.put(`${API_URL}/${uid}/order`, { tasks });
    return res.data;
}
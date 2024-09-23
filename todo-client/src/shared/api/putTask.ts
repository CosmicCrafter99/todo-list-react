import axios from 'axios';
import { API_URL } from '../config/constants';
import { Task } from '../types/task';

export const putTask = async (task: Task): Promise<any> => {
    const res = await axios.put(`${API_URL}/${task._id}`, task);
    return res.data;
}
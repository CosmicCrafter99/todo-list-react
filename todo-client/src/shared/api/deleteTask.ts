import axios from 'axios';
import { API_URL } from '../config/constants';

export const deleteTask = async (taskId: string): Promise<any> => {
    const res = await axios.delete(`${API_URL}/${taskId}`);
    return res.data;
}
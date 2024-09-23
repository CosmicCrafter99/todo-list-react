import axios from 'axios';
import { API_URL } from '../config/constants';
import { Task } from '../types/task';

export const getTasks = async (uid: string, filter: string): Promise<Task[]> => {
    const res = await axios.get(`${API_URL}/${uid}`, {
        params: { filter }
    });

    return res.data;
};
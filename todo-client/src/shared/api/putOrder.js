import axios from 'axios';
import { API_URL } from '../config/constants';

export const putOrder = async (uid, tasks) => {
    const res = await axios.put(`${API_URL}/${uid}/order`, { tasks });

    return res.data;
}
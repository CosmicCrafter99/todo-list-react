import axios from 'axios';
import { API_URL } from '../config/constants';

export const postTask = async (task) => {
    const res = await axios.post(`${API_URL}`, task);
    return res.data;
}
import axios from 'axios';
import { API_URL } from '../config/constants';

export const putTask = async (task) => {
    const res = await axios.put(`${API_URL}/${task._id}`, task);
    return res.data;
}
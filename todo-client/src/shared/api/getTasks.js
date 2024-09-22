import axios from 'axios';
import { API_URL } from '../config/constants';

export const getTasks = async (uid, filter) => {
    const res = await axios.get(`${API_URL}/${uid}`, {
        params: { filter }
    });

    return res.data;
};
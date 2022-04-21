import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = 'https://fast-fire-api.herokuapp.com/api';

const ffApi = axios.create({baseURL});

ffApi.interceptors.request.use(
    async (config: any) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    }
);

export default ffApi;
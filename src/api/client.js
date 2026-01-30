import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Centralized Axios client for backend API interaction, configured with base URL
// and environment-specific overrides.
const client = axios.create({
    baseURL: API_URL,
});

export const searchRestaurants = async (params) => {
    const response = await client.get('/search', { params });
    return response.data;
};

export const getCities = async () => {
    const response = await client.get('/cities');
    return response.data;
};

export const getCuisines = async () => {
    const response = await client.get('/cuisines');
    return response.data;
};

export const getMealTypes = async () => {
    const response = await client.get('/meal-types');
    return response.data;
};

export const detectCity = async (lat, lon) => {
    const response = await client.get('/detect-city', { params: { lat, lon } });
    return response.data;
};

export default client;

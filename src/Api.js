import axios from 'axios';

const BASE_URL = "http://localhost:5000/items";

export const fetchItems = () => axios.get(BASE_URL);
export const fetchItemById = (id) => axios.get(`${BASE_URL}/${id}`);
export const updateItem = (id, data) => axios.put(`${BASE_URL}/${id}`, data);
export const deleteItem = (id) => axios.delete(`${BASE_URL}/${id}`);



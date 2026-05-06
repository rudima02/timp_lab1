import axios from 'axios';

const BASE_URL = "http://217.71.129.139:5082/items";

export const fetchItems = () => axios.get(BASE_URL);
export const fetchItemById = (id) => axios.get(`${BASE_URL}/${id}`);
export const updateItem = (id, data) => axios.put(`${BASE_URL}/${id}`, data);
export const deleteItem = (id) => axios.delete(`${BASE_URL}/${id}`);



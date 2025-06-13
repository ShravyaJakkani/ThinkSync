import axios from 'axios';

const BASE_URL = 'https://thinksync-backend.onrender.com';

export const fetchPoetryPosts = async () => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

export const createPoetryPost = async (formData) => {
  const res = await axios.post(BASE_URL, formData);
  return res.data;
};

export const deletePoetryPost = async (id, pin) => {
  const res = await axios.delete(`${BASE_URL}/${id}`, {
    data: { pin },
  });
  return res.data;
};

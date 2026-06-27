import axios from 'axios';

// const BASE_URL = 'https://thinksync-backend.onrender.com/api/poetry';
const API_URL='http://127.0.0.1:5050/api/poetry';

export const fetchPoetryPosts = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createPoetryPost = async (formData) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/auth`,   // ✅ IMPORTANT CHANGE
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ ADD THIS
      },
    }
  );

  return response.data;
};
export const deletePoetryPost = async (id) => {
  return axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

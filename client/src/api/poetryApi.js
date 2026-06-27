import axios from 'axios';

const API_URL='https://thinksync-backend.onrender.com/api/poetry';

export const fetchPoetryPosts = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createPoetryPost = async (formData) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/auth`, 
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`, 
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

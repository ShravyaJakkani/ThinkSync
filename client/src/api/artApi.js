import axios from 'axios';

// const BASE_URL = 'https://thinksync-backend.onrender.com/api/art';
const API_URL='http://127.0.0.1:5050/api/art';

export const fetchArtPosts = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createArtPost = async (formData) => {
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

export const deleteArtPost = async (id) => {
  return axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
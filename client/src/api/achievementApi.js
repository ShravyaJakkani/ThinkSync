import axios from 'axios';

//const API_URL = 'https://thinksync-backend.onrender.com/api/achievement';
const API_URL='http://127.0.0.1:5050/api/achievement';

export const fetchAchievementPosts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createAchievementPost = async (formData) => {
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


export const deleteAchievementPost = async (id) => {
  return axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

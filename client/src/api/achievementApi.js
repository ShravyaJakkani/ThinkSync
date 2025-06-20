import axios from 'axios';

const API_URL = 'https://thinksync-backend.onrender.com/api/achievement';

export const fetchAchievementPosts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createAchievementPost = async (postData) => {
  const response = await axios.post(API_URL, postData); 
  return response.data;
};


export const deleteAchievementPost = async (id, pin) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    data: { pin },
  });
  return response.data;
};

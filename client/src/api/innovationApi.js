import axios from 'axios';

const API_URL = 'https://thinksync-backend.onrender.com/api/innovation';

export const fetchInnovationPosts = async () => {
  const response = await axios.get(API_URL);
  console.log("Backend response:", response.data); // 🔍
  return response.data.posts;
};


export const createInnovationPost = async (postData) => {
  const response = await axios.post(API_URL, postData); 
  return response.data;
};


export const deleteInnovationPost = async (id, pin) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    data: { pin },
  });
  return response.data;
};

import axios from 'axios';

const API_URL = 'https://thinksync-backend.onrender.com/api/innovation';

export const fetchInnovationPosts = async () => {
  try {
    const response = await axios.get("https://thinksync-backend.onrender.com/api/innovation");
    return response.data;
  } catch (error) {
    console.error("Error in fetchInnovationPosts:", error.message);
    throw error;
  }
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

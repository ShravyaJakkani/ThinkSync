import axios from 'axios';

const API_URL = 'https://thinksync-backend.onrender.com';

export const fetchOpportunityPosts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createOpportunityPost = async (postData) => {
  const response = await axios.post(API_URL, postData); // no headers
  return response.data;
};


export const deleteOpportunityPost = async (id, pin) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    data: { pin },
  });
  return response.data;
};

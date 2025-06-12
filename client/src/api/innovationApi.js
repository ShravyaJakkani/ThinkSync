import axios from 'axios';

const API_URL = 'http://localhost:5000/api/innovation';

export const fetchInnovationPosts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createInnovationPost = async (postData) => {
  const response = await axios.post(API_URL, postData); // no headers
  return response.data;
};


export const deleteInnovationPost = async (id, pin) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    data: { pin },
  });
  return response.data;
};

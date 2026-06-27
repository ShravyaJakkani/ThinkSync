import axios from 'axios';

// const API_URL = 'https://thinksync-backend.onrender.com/api/opportunity';
const API_URL='http://127.0.0.1:5050/api/opportunity';

export const fetchOpportunityPosts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createOpportunityPost = async (formData) => {
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


export const deleteOpportunityPost = async (id) => {
  return axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

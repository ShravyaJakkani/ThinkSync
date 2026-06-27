import axios from 'axios';

// const API_URL = 'https://thinksync-backend.onrender.com/api/innovation';
const API_URL='https://thinksync-backend.onrender.com/api/innovation';

export const fetchInnovationPosts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error in fetchInnovationPosts:", error.message);
    throw error;
  }
};

export const createInnovationPost = async (formData) => {
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
export const deleteInnovationPost = async (id) => {
  return axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

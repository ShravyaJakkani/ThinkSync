import axios from 'axios';

const API_URL='https://thinksync-backend.onrender.com/api/announcement';

export const fetchAnnouncementPosts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createAnnouncementPost = async (formData) => {
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


export const deleteAnnouncementPost = async (id) => {
  return axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

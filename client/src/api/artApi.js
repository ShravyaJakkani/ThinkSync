import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/art';

export const fetchArtPosts = async () => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

export const createArtPost = async (formData) => {
  const res = await axios.post(BASE_URL, formData);
  return res.data;
};

export const deleteArtPost = async (id, pin) => {
  const res = await axios.delete(`${BASE_URL}/${id}`, {
    data: { pin },
  });
  return res.data;
};

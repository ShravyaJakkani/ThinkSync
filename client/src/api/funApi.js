import axios from "axios";

const API_URL = "https://thinksync-backend.onrender.com";

export const fetchFunPosts = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createFunPost = async (formData) => {
  const data = new FormData();
  data.append("title", formData.title);
  data.append("image", formData.image);
  data.append("pin", formData.pin);

  const res = await axios.post(API_URL, data);
  return res.data;
};

export const deleteFunPost = async (id, pin) => {
  await axios.delete(`${API_URL}/${id}`, { data: { pin } });
};

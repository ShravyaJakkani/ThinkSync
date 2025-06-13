import axios from "axios";

const API_URL = "https://thinksync-backend.onrender.com";

export const fetchQuestionPapers = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const uploadQuestionPaper = async (formData) => {
  const data = new FormData();
  data.append("image", formData.image);
  data.append("pin", formData.pin);

  const res = await axios.post(API_URL, data);
  return res.data;
};

export const deleteQuestionPaper = async (id, pin) => {
  await axios.delete(`${API_URL}/${id}`, { data: { pin } });
};

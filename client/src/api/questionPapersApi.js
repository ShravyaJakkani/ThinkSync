import axios from "axios";

// const API_URL = "https://thinksync-backend.onrender.com/api/questionpapers";
const API_URL='http://127.0.0.1:5050/api/questionpapers';

export const fetchQuestionPapers = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const uploadQuestionPaper = async (formData) => {
  const token = localStorage.getItem("token");

  const res = await axios.post(
    `${API_URL}/auth`,
    formData, // ✅ directly send
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const deleteQuestionPaper = async (id) => {
  return axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

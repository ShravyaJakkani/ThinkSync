import axios from "axios";
import React, { useState } from "react";
import { uploadQuestionPaper } from "../api/questionPapersApi";
import { useNavigate } from "react-router-dom";

const QuestionPaperForm = () => {
  const [formData, setFormData] = useState({ title:"",file: null });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

   const handleSubmit = async (e) => {
                e.preventDefault();
              
                const token = localStorage.getItem("token");
              
                if (!token) {
                  alert("Please login first");
                  navigate("/login");
                  return;
                }
              
                const data = new FormData();
                data.append("title", formData.title);
                data.append("file", formData.file);
              
                try {
                  await uploadQuestionPaper(data);
              
                  alert("Post created successfully");
              
                  setFormData({
                    title: "",
                    file: null,
                  });
              
                  navigate("/questionpapers", { replace: true });
              
                } catch (err) {
                  console.error("Upload error:", err.response?.data || err.message);
                  alert("Failed to post");
                }
              };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4" id="frm">
  <h1 className="text-xl font-bold">Upload Question Paper</h1>
  <table className="w-full border-spacing-2" id="tbl">
    <tbody>
    <tr>
        <td className="p-2 font-semibold">Title:</td>
        <td className="p-2">
          <input
            type="text"
            name="title"
            placeholder="Title"
            onChange={handleChange}
            required
            className="border p-2 w-full"
          />
        </td>
      </tr>
      <tr>
        <td className="p-2 font-semibold">Select File:</td>
        <td className="p-2">
          <input
            type="file"
            name="file"
            required
            onChange={handleChange}
            className="w-full"
          />
        </td>
      </tr>
      <tr>
        <td colSpan={2} className="p-2 text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Upload
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</form>

  );
};

export default QuestionPaperForm;

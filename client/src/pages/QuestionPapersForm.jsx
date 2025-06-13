import axios from "axios";
import React, { useState } from "react";
import { uploadQuestionPaper } from "../api/questionPapersApi";
import { useNavigate } from "react-router-dom";

const QuestionPaperForm = () => {
  const [formData, setFormData] = useState({ title:"",image: null, pin: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     const Data = new FormData();
    Data.append("title",formData.title)
    Data.append("image", formData.image); 
    Data.append("pin", formData.pin);
  
    try {
      await axios.post("https://thinksync-backend.onrender.com/api/questionpapers", Data);
      alert("Uploaded successfully!");
      navigate("/questionpapers",{replace:true});
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
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
            name="image"
            required
            onChange={handleChange}
            className="w-full"
          />
        </td>
      </tr>
      <tr>
        <td className="p-2 font-semibold">Secret PIN:</td>
        <td className="p-2">
          <input
            type="password"
            name="pin"
            placeholder="Secret PIN"
            required
            onChange={handleChange}
            className="border p-2 w-full"
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

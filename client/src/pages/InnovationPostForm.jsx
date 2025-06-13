import React, { useState } from "react";
import { createInnovationPost } from "../api/innovationApi";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const InnovationPostForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    userId: "",
    image: null,
    pin: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({
        ...prev,
        image: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("userId",formData.userId);
    data.append("pin", formData.pin);
    data.append("image", formData.image); 
  
    try {
      const res = await axios.post("https://thinksync-backend.onrender.com/api/innovation", data);
      if (res.status === 201) {
        alert("Post created successfully");
        navigate("/innovation",{replace:true});
      }
    } catch (err) {
      
    console.error("Upload error:", err.response?.data || err.message);
      alert("Failed to post");
    }
  };
  
  
  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4" id="frm">
      <h1 className="text-xl font-bold">Create Innovation Post</h1>
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
        <td className="p-2 font-semibold">Author:</td>
        <td className="p-2">
          <input
            type="text"
            name="userId"
            placeholder="Author"
            onChange={handleChange}
            required
            className="border p-2 w-full"
          />
        </td>
      </tr>
      <tr>
        <td className="p-2 font-semibold align-top">Content:</td>
        <td className="p-2">
          <textarea
            name="content"
            placeholder="Content"
            onChange={handleChange}
            required
            className="border p-2 w-full"
            rows={4}
          ></textarea>
        </td>
      </tr>
      <tr>
        <td className="p-2 font-semibold">Image:</td>
        <td className="p-2">
          <input
            type="file"
            name="image"
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
            placeholder="Secret PIN for deletion"
            onChange={handleChange}
            required
            className="border p-2 w-full"
          />
        </td>
      </tr>
      <tr>
        <td colSpan={2} className="p-2 text-center">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Submit Post
          </button>
        </td>
      </tr>
    </tbody>
  </table>
    </form>
  );
};

export default InnovationPostForm;

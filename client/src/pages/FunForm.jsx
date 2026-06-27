import React, { useState } from "react";
import { createFunPost } from "../api/funApi";
import { useNavigate } from "react-router-dom";

const FunForm = () => {
  const [formData, setFormData] = useState({ title: "", image: null, pin: "" });
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
      
        const token = localStorage.getItem("token");
      
        if (!token) {
          alert("Please login first");
          navigate("/login");
          return;
        }
      
        const data = new FormData();
        data.append("title", formData.title);
        data.append("content", formData.content);
        data.append("image", formData.image);
      
        try {
          await createFunPost(data);
      
          alert("Post created successfully");
      
          setFormData({
            title: "",
            content: "",
            image: null,
          });
      
          navigate("/fun", { replace: true });
      
        } catch (err) {
          console.error("Upload error:", err.response?.data || err.message);
          alert("Failed to post");
        }
      };

  return (
    <form onSubmit={handleSubmit} className="p-6" id="frm">
  <h1 className="text-xl font-bold mb-4">Add Fun Content</h1>
  <table className="table-auto w-full border border-gray-300" id="tbl">
    <tbody>
      <tr className="border">
        <td className="p-2 font-semibold w-1/4">Content</td>
        <td className="p-2">
          <input
            type="text"
            name="title"
            placeholder="Title"
            required
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </td>
      </tr>
      <tr className="border">
        <td className="p-2 font-semibold">Image</td>
        <td className="p-2">
          <input
            type="file"
            name="image"
            required
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </td>
      </tr>
      <tr>
        <td>
          <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
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

export default FunForm;

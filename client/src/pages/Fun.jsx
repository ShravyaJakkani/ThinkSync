import React, { useEffect, useState } from "react";
import { fetchFunPosts, deleteFunPost } from "../api/funApi";
import { Link } from "react-router-dom";
import axios from "axios";
import { marked } from "marked";

const Fun = () => {
  const [posts, setPosts] = useState([]);

  const loadPosts = async () => {
    const data = await fetchFunPosts();
    setPosts(data);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = async (id) => {
    const pin = prompt("Enter PIN to delete:");
    if (!pin) return;
    try {
      await deleteFunPost(id, pin);
      loadPosts();
    } catch {
      alert("Delete failed");
    }
  };

  const handleLike = async (postId) => {
      const currentUser = localStorage.getItem("username") || "guest";
      try {
        const res = await axios.post(
          `http://localhost:5000/api/fun/${postId}/like`,
          { username: currentUser }
        );
        setPosts((prev) =>
          prev.map((post) =>
            post._id === postId ? { ...post, likes: res.data.likes } : post
          )
        );
      } catch (err) {
        console.error("Like error:", err);
      }
    };
  const currentUser = localStorage.getItem("username");

  return (
    <div className="p-6" id="posts">
      <h1 className="text-2xl font-bold mb-4">Fun Zone</h1>
      <Link
        to="/fun/upload"
        className="bg-green-600 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        + Add to Fun Zone
      </Link>
      <hr></hr>
      <div className="grid grid-cols-2 gap-4">
        {posts.map((post) => (
          <div key={post._id} className="relative border rounded p-2">
            
            <img
              src={`http://localhost:5000${post.image}`}
              alt="fun"
              style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover' }}
            />
            <p dangerouslySetInnerHTML={{ __html: marked(post.title) }}></p>
                <button
                  onClick={() => handleLike(post._id)} className="like-button">
                   ❤️ {post.likes?.includes(currentUser) ? "Unlike" : "Like"}
                </button>
              <p>{post.likes?.length || 0} like(s)</p>
                 
            <button
              onClick={() => handleDelete(post._id)}
              className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
            <hr></hr>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Fun;

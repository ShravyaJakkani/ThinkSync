import React, { useEffect, useState } from "react";
import { fetchPoetryPosts, deletePoetryPost } from "../api/poetryApi";
import { Link } from "react-router-dom";
import axios from "axios";


const Poetry = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    loadPosts();
  }, [location.pathname]);

  const loadPosts = async () => {
    try {
      const data = await fetchPoetryPosts();
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    }
  };

 const handleDelete = async (id) => {
  const pin = prompt("Enter your secret PIN to delete this post:");
  if (!pin) return;
  try {
    await deletePoetryPost(id, pin);

    // Refetch posts after delete
    const updated = await fetchPoetryPosts();
    setPosts(Array.isArray(updated) ? updated : []);
    
  } catch (err) {
    alert("Incorrect PIN or failed to delete.");
  }
};

  const handleLike = async (postId) => {
      const currentUser = localStorage.getItem("username") || "guest";
      try {
        const res = await axios.post(
          `https://thinksync-backend.onrender.com/api/poetry/${postId}/like`,
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
      <h1 className="text-3xl font-bold mb-4 text-center">Poetry Posts</h1>
      <hr />
      <div className="flex justify-center mb-4">
        <Link
          to="/poetry/post"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          +Create New Post
        </Link>
      </div>
      <div className="space-y-6">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts yet.</p>
        ) : (
          posts.map((post, index) => (
            <div key={index} className="bg-white p-4 rounded shadow relative border border-gray-200">
              <hr></hr>
              <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
              <p className="text-sm text-gray-600 mb-1">Posted by: <strong>{post.userId}</strong></p> 
              {post.image && (
                <img
                  src={post.image}
                  style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover' }}
                />
              )}
              <br></br>
  <button
      onClick={() => handleLike(post._id)}
      className="like-button">
      ❤️ {post.likes?.includes(currentUser) ? "Unlike" : "Like"}
    </button>

    <p>{post.likes?.length || 0} like(s)</p>
   
              <button
                onClick={() => handleDelete(post._id)}

                className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
              <hr></hr>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Poetry;

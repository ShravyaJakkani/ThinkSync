import React, { useEffect, useState } from "react";
import { fetchAchievementPosts, deleteAchievementPost } from "../api/achievementApi";
import { Link } from "react-router-dom";
import { marked } from "marked";
import axios from "axios";
const Achievements = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    loadPosts();
  }, [location.pathname]);

  const loadPosts = async () => {
    try {
      const data = await fetchAchievementPosts();
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    }
  };

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this post?");
  if (!confirmDelete) return;

  try {
    await deleteAchievementPost(id); // ✅ no pin
    loadPosts(); // refresh posts
  } catch (err) {
    alert("Failed to delete post");
    console.error(err);
  }
};
const handleLike = async (postId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `https://thinksync-backend.onrender.com/api/achievement/${postId}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setPosts((prev) =>
      prev.map((post) =>
        post._id === postId ? { ...post, likes: res.data.likes } : post
      )
    );

  } catch (err) {
    console.error("Like error:", err.response?.data || err.message);
  }
};

const currentUserId = localStorage.getItem("userId");
  return (
    <div className="p-6" id="posts">
      <h1 className="text-3xl font-bold mb-4 text-center">Achievement Posts</h1>
      <hr />
      <div className="flex justify-center mb-4">
        <Link
          to="/achievementform"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          +Create New Post
        </Link>
      </div>
      <div className="space-y-6">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts yet.</p>
        ) : (
            posts.map((post) => {
  const isLiked = post.likes?.some(
    (id) => id === currentUserId || id?._id === currentUserId
  );

  return (
    <div key={post._id} className="bg-white p-4 rounded shadow relative border border-gray-200">
      
      <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
      <p className="mb-2">{post.content}</p>

      {post.image && (
        <img
          src={post.image}
          style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover' }}
        />
      )}

      <br />

      <button onClick={() => handleLike(post._id)}>
        ❤️ {isLiked ? "Unlike" : "Like"}
      </button>

      <p>{post.likes?.length || 0} like(s)</p>

      {(post.user?._id || post.user) === currentUserId && (
        <button onClick={() => handleDelete(post._id)}>Delete</button>
      )}

      <hr />
    </div>
  );
}))
        }
      </div>
    </div>
  );
};

export default Achievements;

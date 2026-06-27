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
       const confirmDelete = window.confirm("Are you sure you want to delete this post?");
       if (!confirmDelete) return;
     
       try {
         await deleteFunPost(id); // ✅ no pin
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
      // `https://thinksync-backend.onrender.com/api/achievement/${postId}/like`,
      `https://thinksync-backend.onrender.com/api/fun/${postId}/like`,
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
      <h1 className="text-2xl font-bold mb-4">Fun Zone</h1>
      <Link
        to="/fun/upload"
        className="bg-green-600 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        + Add to Fun Zone
      </Link>
      <hr></hr>
      <div className="grid grid-cols-2 gap-4">
        {posts.map((post) => {
  const isLiked = post.likes?.some(
    (id) => id === currentUserId || id?._id === currentUserId
  );

  return (
    <div key={post._id} className="relative border rounded p-2">

      <img
        src={post.image}
        style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover' }}
      />

      <p dangerouslySetInnerHTML={{ __html: marked(post.title) }}></p>

      {/* ✅ LIKE BUTTON */}
      <button onClick={() => handleLike(post._id)} className="like-button">
        ❤️ {isLiked ? "Unlike" : "Like"}
      </button>

      <p>{post.likes?.length || 0} like(s)</p>

      {/* ✅ DELETE BUTTON */}
      {(post.user?._id || post.user) === currentUserId && (
        <button onClick={() => handleDelete(post._id)}>Delete</button>
      )}

      <hr />
    </div>
  );
})}
         
      </div>
    </div>
  );
};

export default Fun;

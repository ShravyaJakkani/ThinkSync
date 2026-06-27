import React, { useEffect, useState } from "react";
import { fetchArtPosts, deleteArtPost } from "../api/artApi";
import { Link } from "react-router-dom";
import axios from "axios";
const Art = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    loadPosts();
  }, [location.pathname]);

  const loadPosts = async () => {
    try {
      const data = await fetchArtPosts();
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    }
  };

  const handleDelete = async (id) => {
      const confirmDelete = window.confirm("Are you sure you want to delete this post?");
      if (!confirmDelete) return;
    
      try {
        await deleteArtPost(id); 
        loadPosts(); 
      } catch (err) {
        alert("Failed to delete post");
        console.error(err);
      }
    };
const handleLike = async (postId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `https://thinksync-backend.onrender.com/api/art/${postId}/like`,
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
      <h1 className="text-3xl font-bold mb-4 text-center">Art Posts</h1>
      <hr />
      <div className="flex justify-center mb-4">
        <Link
          to="/art/create"
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
         return(
          <div key={post._id} className="bg-white p-4 rounded shadow relative border border-gray-200">
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
             
                <button onClick={() => handleLike(post._id)}>
        ❤️ {isLiked ? "Unlike" : "Like"}
      </button>
              <p>{post.likes?.length || 0} like(s)</p>
                 
                    
              {post.user === localStorage.getItem("userId") && (
  <button onClick={() => handleDelete(post._id)}>Delete</button>
)}
              <hr></hr>
            </div>
        );
}))
        }
      </div>
    </div>
  );
};


export default Art;

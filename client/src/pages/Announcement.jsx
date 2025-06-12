import React, { useEffect, useState } from "react";
import { fetchAnnouncementPosts, deleteAnnouncementPost } from "../api/announcementApi";
import { Link } from "react-router-dom";

const Announcement = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    loadPosts();
  }, [location.pathname]);

  const loadPosts = async () => {
    try {
      const data = await fetchAnnouncementPosts();
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    }
  };

  const handleDelete = async (id) => {
    const pin = prompt("Enter your secret PIN to delete this post:");
    if (!pin) return;
    try {
      await deleteAnnouncementPost(id, pin);
      loadPosts(); // refresh posts
    } catch (err) {
      alert("Incorrect PIN or failed to delete.");
    }
  };

  return (
    <div className="p-6" id="posts">
      <h1 className="text-3xl font-bold mb-4 text-center">Announcement Posts</h1>
      <hr />
      <div className="flex justify-center mb-4">
        <Link
          to="/announcementform"
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
              <h3 className="text-xl font-semibold mb-2">{post.title}</h3> 
               <p className="mb-2">{post.content}</p>
              {post.image && (
                <img
                  src={post.image}
                  style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover' }}
                />
              )}
              <br></br>
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

export default Announcement;

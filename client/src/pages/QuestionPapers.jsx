import React, { useEffect, useState } from "react";
import { fetchQuestionPapers, deleteQuestionPaper } from "../api/questionPapersApi";
import { Link } from "react-router-dom";

const QuestionPapers = () => {
  const [papers, setPapers] = useState([]);

  const loadPapers = async () => {
    const data = await fetchQuestionPapers();
    setPapers(data);
  };

  useEffect(() => {
    loadPapers();
  }, []);

 const handleDelete = async (id) => {
            const confirmDelete = window.confirm("Are you sure you want to delete this post?");
            if (!confirmDelete) return;
          
            try {
              await deleteQuestionPaper(id); // ✅ no pin
              loadPapers(); // refresh posts
            } catch (err) {
              alert("Failed to delete post");
              console.error(err);
            }
          };
 

  return (
    <div className="p-6" id="posts">
      <h1 className="text-2xl font-bold mb-4">Question Papers</h1>
      <Link
        to="/questionpapers/upload"
        className="bg-green-600 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        + Upload New Paper
      </Link>
      <p> </p>
      <div className="grid grid-cols-2 gap-4">
        {papers.map((paper) => (
          <div key={paper._id} className="relative">
            <h3 className="text-xl font-semibold mb-2">Title:{paper.title}</h3>
            <a
             href={paper.file}
             target="_blank"
             rel="noopener noreferrer"
             className="text-blue-600 underline">
             View PDF
            </a>
          <br></br>
            {(paper.user?._id || paper.user) === localStorage.getItem("userId") && (
  <button onClick={() => handleDelete(paper._id)}>Delete</button>
)}
            <hr></hr>
          </div>
        ))}
        
      </div>
      
    </div>
  );
};

export default QuestionPapers;

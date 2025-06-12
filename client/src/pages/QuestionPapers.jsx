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
    const pin = prompt("Enter PIN to delete:");
    if (!pin) return;
    try {
      await deleteQuestionPaper(id, pin);
      loadPapers();
    } catch (err) {
      alert("Delete failed");
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
             href={`http://localhost:5000${paper.image}`}
             target="_blank"
             rel="noopener noreferrer"
             className="text-blue-600 underline">
             View PDF
            </a>
          <br></br>
            <button
              onClick={() => handleDelete(paper._id)}
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

export default QuestionPapers;

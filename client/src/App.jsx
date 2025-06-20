import React ,{useState} from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Innovation from './pages/Innovation';
import Poetry from './pages/Poetry';
import QuestionPapers from './pages/QuestionPapers';
import Fun from './pages/Fun';
import FunForm from './pages/FunForm';
import Art from './pages/Art';
import ArtPostForm from './pages/ArtPostForm';
import Announcement from './pages/Announcement';
import Achievements from './pages/Achievements';
import Opportunities from './pages/Opportunities';
import InnovationPostForm from './pages/InnovationPostForm';
import PoetryPostForm from './pages/PoetryPostForm';
import QuestionPapersForm from './pages/QuestionPapersForm';

import './App.css';

import { useEffect } from 'react';
import AnnouncementPostForm from './pages/AnnouncementPostForm';
import AchievementForm from './pages/AchievementForm';
import OpportunityForm from './pages/OpportunityForm';

const categories = [
  { name: "Innovation", path: "/innovation" },
  { name: "Poetry", path: "/poetry" },
  { name: "Question Papers", path: "/questionpapers" },
  { name: "Fun", path: "/fun" },
  { name: "Art", path: "/art" },
  { name: "Announcement", path: "/announcement" },
  { name: "Achievements", path: "/achievements" },
  { name: "Opportunities", path: "/opportunities" },
];

function Home() {
  return (
    <div className="app-container">
      <h1 className="main-title">ThinkSync</h1>

      <br></br>
      <div className="card-container">
        {categories.map(({ name, path }) => (
          
          <Link key={name} to={path} className="card">
            <h2>{name}</h2>
            <p>Explore posts related to {name.toLowerCase()}.</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem("username"));

  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/innovation" element={<Innovation />} />
        <Route path="/innovation/post" element={<InnovationPostForm />} />
        <Route path="/poetry" element={<Poetry />} />
        <Route path="/poetry/post" element={<PoetryPostForm />} />
        <Route path="/questionpapers" element={<QuestionPapers />} />
        <Route path="/questionpapers/upload" element={<QuestionPapersForm/>} />
        <Route path="/fun" element={<Fun />} />
        <Route path="/fun/upload" element={<FunForm />} />
        <Route path="/art" element={<Art />} />
        <Route path="/art/create" element={<ArtPostForm />} />
        <Route path="/announcement" element={<Announcement />} />
        <Route path="/announcementform" element={<AnnouncementPostForm />} />
        <Route path="/achievementform" element={<AchievementForm />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/opportunityform" element={<OpportunityForm />} />
      </Routes>
  );
}

export default App;


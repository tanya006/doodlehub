import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import BackgroundElements from "./background/BackgroundElements";

const LandingPage = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");

  const goToRoom = () => {
    if (!roomId.trim()) return;
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="landing-container">
      <BackgroundElements />

      <div className="landing-card">
        <h1>DOODLEHUB</h1>
        <p>A Real-Time Collaborative Whiteboard.</p>

        <input
          placeholder="Enter room name"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />

        <button onClick={goToRoom}>Create / Join Room</button>
      </div>
    </div>
  );
};

export default LandingPage;

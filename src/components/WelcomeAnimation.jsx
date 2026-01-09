import React from "react";
import "./WelcomeAnimation.css";
import video from "../assets/anime.mov"

const WelcomeAnimation = ({ onFinish }) => {
  return (
    <div className="welcome-screen">
      <div className="main">
        <video
          className="welcome-video"
          src={video}   // public/ ichida
          autoPlay
          muted
          playsInline
          onEnded={onFinish}
        />
      </div>
    </div>
  );
};

export default WelcomeAnimation;

import React from "react";
import "./WelcomeAnimation.css";
import video from "../assets/anime.mp4";

const WelcomeAnimation = ({ onFinish }) => {
  return (
    <div className="welcome-screen">
      <div className="video-box">
        <video
          className="welcome-video"
          src={video}
          autoPlay
          muted
          playsInline
          onEnded={() => onFinish?.()}
        />
      </div>
    </div>
  );
};

export default WelcomeAnimation;

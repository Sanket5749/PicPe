import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const StoryViewer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { media } = location.state || {};

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100 bg-dark"
      style={{ padding: "1rem" }}
    >
      <button
        onClick={() => navigate(-1)}
        className="btn btn-light mb-3 align-self-start"
      >
        ← Back
      </button>
      {media ? (
        <img
          src={media}
          alt="Story"
          style={{ maxWidth: "90vw", maxHeight: "80vh", objectFit: "contain" }}
        />
      ) : (
        <p className="text-white">No story found</p>
      )}
    </div>
  );
};

export default StoryViewer;
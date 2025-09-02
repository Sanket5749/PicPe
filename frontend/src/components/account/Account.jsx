import React, { useState, useEffect } from "react";
import Footer from "../Footer.jsx";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { handleSuccess } from "../utils.js";
import { Button } from "@/components/ui/button";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import "../LikeButton.css";

function Account() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const fetchUser = async () => {
    try {
      const res = await fetch("https://pic-pe-api.vercel.app/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data.user || null);
      setPosts(data.posts || []);
      const likesMap = {};
      data.posts.forEach((post) => {
        likesMap[post._id] = post.likes.includes(userId);
      });
      setLikedPosts(likesMap);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to load user");
      setLoading(false);
    }
  };

  const fetchComments = async (postId) => {
    const res = await fetch(`https://pic-pe-api.vercel.app/comments/post/${postId}`);
    const data = await res.json();
    setComments((prev) => ({ ...prev, [postId]: data.comments || [] }));
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    posts.forEach((post) => fetchComments(post._id));
  }, [posts]);

  const toggleLike = async (postId) => {
    const isLiked = likedPosts[postId];
    const endpoint = `https://pic-pe-api.vercel.app/post/${postId}/${
      isLiked ? "dislike" : "like"
    }`;
    try {
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        const updatedLikes = isLiked
          ? posts
              .find((p) => p._id === postId)
              .likes.filter((id) => id !== userId)
          : [...posts.find((p) => p._id === postId).likes, userId];
        setLikedPosts((prev) => ({ ...prev, [postId]: !isLiked }));
        setPosts((prev) =>
          prev.map((post) =>
            post._id === postId ? { ...post, likes: updatedLikes } : post
          )
        );
      }
    } catch (err) {
      console.error("Toggle like failed:", err);
    }
  };

  const handleCommentChange = (postId, value) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  const handleCommentSubmit = async (e, postId) => {
    e.preventDefault();
    const text = commentInputs[postId];
    if (!text) return;
    await fetch("https://pic-pe-api.vercel.app/comments/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ postId, text }),
    });
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    fetchComments(postId);
  };

  const handleDeleteComment = async (commentId, postId) => {
    await fetch(`https://pic-pe-api.vercel.app/comments/${commentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchComments(postId);
  };

  const handleDeletePost = async (postId) => {
    try {
      const res = await fetch(`https://pic-pe-api.vercel.app/post/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        handleSuccess(data.message);
        setPosts((prev) => prev.filter((post) => post._id !== postId));
      } else {
        console.error(data.message || "Failed to delete post");
      }
    } catch (err) {
      console.error("Error deleting post:", err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    handleSuccess("User Logout Successfully");
    setTimeout(() => navigate("/login"), 2000);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="min-h-screen container flex flex-col justify-between bg-black">
      <div className="flex-grow">
        <div className="row mt-4">
          <div className="col-4">
            <img
              src="/user.jpg"
              className="h-50 rounded-lg border"
              alt="User"
            />
          </div>
          <div className="col-8 text-white">
            <div className="d-flex justify-content-between">
              <h5>{user.username}</h5>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    style={{ color: "black" }}
                    onClick={handleLogout}
                  >
                    <LogoutIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Logout</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="row">
              <div className="col">{user.followers?.length || 0} followers</div>
              <div className="col">{user.following?.length || 0} following</div>
              <div className="col">{posts.length} posts</div>
            </div>
          </div>
        </div>

        <h3 className="text-white">Your Posts</h3>
        {posts.length === 0 ? (
          <p className="text-white">No posts yet.</p>
        ) : (
          <div className="d-flex flex-wrap gap-3">
            {posts.map((post) => (
              <div
              key={post._id}
              className="card bg-dark text-white p-2"
              style={{ width: "300px", height: "400px" }}
              >
                <p>@{user.username}</p>
                <img
                  src={post.media}
                  className="card-img-top"
                  alt="Post"
                  style={{ height: "150px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <p className="card-text">{post.caption}</p>

                  <button
                    className={`like-button ${
                      likedPosts[post._id] ? "liked" : ""
                    }`}
                    onClick={() =>{ toggleLike(post._id),  window.location.reload()}}
                  >
                    {likedPosts[post._id] ? (
                      <FavoriteIcon />
                    ) : (
                      <FavoriteBorderIcon />
                    )}{" "}
                    {post.likes.length}
                  </button>

                  {user._id === post.owner && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className="btn btn-sm text-white"
                          onClick={() => handleDeletePost(post._id)}
                          style={{ fontSize: "1.5rem", float: "right" }}
                        >
                          <DeleteIcon />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete Post</p>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  <form
                    onSubmit={(e) => handleCommentSubmit(e, post._id)}
                    className="d-flex gap-2 mt-2"
                  >
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Add a comment..."
                      value={commentInputs[post._id] || ""}
                      onChange={(e) =>
                        handleCommentChange(post._id, e.target.value)
                      }
                    />
                    <Button
                      variant="outline"
                      type="submit"
                      className="text-black"
                    >
                      Add
                    </Button>
                  </form>

                  <div>
                    {(comments[post._id] || []).map((c, idx) => (
                      <div
                        key={idx}
                        className="text-white d-flex align-items-center justify-content-between"
                      >
                        <span>
                          <b>@{c.user?.username || "User"}:</b> {c.text}
                        </span>
                        {c.user && c.user._id === user._id && (
                          <button
                            className="btn btn-sm text-white"
                            onClick={() => handleDeleteComment(c._id, post._id)}
                            style={{ fontSize: "1rem" }}
                          >
                            <DeleteIcon />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ToastContainer />
      <Footer />
    </div>
  );
}

export default Account;

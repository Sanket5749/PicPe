import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import Footer from "../Footer.jsx";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import "../LikeButton.css";

function Accounts() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [comments, setComments] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const token = localStorage.getItem("token");
  const loggedInUserId = localStorage.getItem("userId");

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const res = await fetch(`https://pic-pe-api.vercel.app/auth/${id}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.message || "User not found");

        setUser(data.user);
        setPosts(data.posts || []);
        setIsFollowing(
          data.user.followers?.includes(loggedInUserId)
        );

        const likesMap = {};
        data.posts.forEach(
          (post) => (likesMap[post._id] = post.likes.includes(loggedInUserId))
        );
        setLikedPosts(likesMap);
      } catch (err) {
        setError(err.message || "Error fetching user");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [id]);

  useEffect(() => {
    posts.forEach((post) => fetchComments(post._id));
  }, [posts]);

  const fetchComments = async (postId) => {
    const res = await fetch(`https://pic-pe-api.vercel.app/comments/post/${postId}`);
    const data = await res.json();
    setComments((prev) => ({ ...prev, [postId]: data.comments || [] }));
  };

  const handleFollow = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`https://pic-pe-api.vercel.app/auth/${id}/follow`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setIsFollowing(true);
        setUser((prev) => ({
          ...prev,
          followers: [...(prev.followers || []), loggedInUserId],
        }));
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnfollow = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`https://pic-pe-api.vercel.app/auth/${id}/unfollow`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setIsFollowing(false);
        setUser((prev) => ({
          ...prev,
          followers: (prev.followers || []).filter((f) => f !== loggedInUserId),
        }));
      }
    } finally {
      setActionLoading(false);
    }
  };

  const toggleLike = async (postId) => {
    const isLiked = likedPosts[postId];
    const endpoint = `https://pic-pe-api.vercel.app/post/${postId}/${isLiked ? "dislike" : "like"}`;
    try {
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        const updatedLikes = isLiked
          ? posts.find((p) => p._id === postId).likes.filter((id) => id !== loggedInUserId)
          : [...posts.find((p) => p._id === postId).likes, loggedInUserId];

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

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!user) return <div className="text-white">User not found</div>;

  return (
    <div className="min-h-screen container flex flex-col justify-between bg-black text-white">
      <div className="row mt-4">
        <div className="col-4">
          <img src="/user.jpg" className="h-50 rounded-lg border" alt="User" />
        </div>
        <div className="col-8">
          <h2>{user.username}</h2>
          <p>Followers: {user.followers?.length || 0}</p>
          <p>Following: {user.following?.length || 0}</p>
          <Button
            variant="contained"
            color={isFollowing ? "error" : "primary"}
            onClick={isFollowing ? handleUnfollow : handleFollow}
            disabled={actionLoading}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
        </div>
      </div>

      <div className="row">
        <h3 className="text-white">User Posts</h3>
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <div className="d-flex flex-wrap gap-3">
            {posts.map((post) => (
              <div key={post._id} className="card bg-dark text-white p-2" style={{ width: "300px", height: "auto" }}>
                <p>@{user.username}</p>
                <img src={post.media} className="card-img-top" alt="post" style={{ height: "150px", objectFit: "cover" }} />
                <div className="card-body">
                  <p className="card-text">{post.caption}</p>
                  <button
                    className={`like-button ${likedPosts[post._id] ? "liked" : ""}`}
                    onClick={() => {toggleLike(post._id),  window.location.reload()}}
                  >
                    {likedPosts[post._id] ? <FavoriteIcon /> : <FavoriteBorderIcon />}{" "}
                    {post.likes.length}
                  </button>

                  <form onSubmit={(e) => handleCommentSubmit(e, post._id)} className="d-flex gap-2 mt-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Add a comment..."
                      value={commentInputs[post._id] || ""}
                      onChange={(e) => handleCommentChange(post._id, e.target.value)}
                    />
                    <Button variant="outlined" type="submit" className="bg-white text-black">
                      Add
                    </Button>
                  </form>

                  <div className="mt-2" style={{ maxHeight: "130px", overflowY: "auto" }}>
                    {(comments[post._id] || []).map((c, idx) => (
                      <div key={idx} className="d-flex justify-content-between align-items-center text-white">
                        <span><b>@{c.user?.username || "User"}</b>: {c.text}</span>
                        {c.user && c.user._id === loggedInUserId && (
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
      <Footer/>
    </div>
  );
}

export default Accounts;

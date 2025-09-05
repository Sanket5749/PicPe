import React, { useEffect, useState } from "react";
import Footer from "../Footer.jsx";
import { Button } from "@/components/ui/button";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "../LikeButton.css";

function Home() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [stories, setStories] = useState([]);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const fetchPosts = async () => {
    const res = await fetch("https://pic-pe-api.vercel.app/post/display");
    const data = await res.json();
    setPosts(data.posts || []);
  };

  const fetchStories = async () => {
    try {
      const res = await fetch("https://pic-pe-api.vercel.app/story/display", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setStories(data.storys || []);
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  };

  const fetchComments = async (postId) => {
    const res = await fetch(`https://pic-pe-api.vercel.app/comments/post/${postId}`);
    const data = await res.json();
    setComments((prev) => ({ ...prev, [postId]: data.comments || [] }));
  };

  useEffect(() => {
    fetchPosts();
    fetchStories();
  }, []);

  useEffect(() => {
    posts.forEach((post) => {
      fetchComments(post._id);
      setLikedPosts((prev) => ({
        ...prev,
        [post._id]: post.likes.includes(userId),
      }));
    });
  }, [posts]);

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

  const toggleLike = async (postId) => {
    const isLiked = likedPosts[postId];
    const route = isLiked ? "dislike" : "like";

    try {
      const res = await fetch(
        `https://pic-pe-api.vercel.app/post/${postId}/${route}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();

      if (data.success) {
        const updatedLikes = isLiked
          ? posts.find((p) => p._id === postId).likes.filter((id) => id !== userId)
          : [...posts.find((p) => p._id === postId).likes, userId];

        setLikedPosts((prev) => ({ ...prev, [postId]: !isLiked }));
        setPosts((prev) =>
          prev.map((post) =>
            post._id === postId ? { ...post, likes: updatedLikes } : post
          )
        );
      }
    } catch (err) {
      console.error("Toggle like error:", err);
    }
  };

  const sortedStories = [...stories].sort((a, b) => {
    if (a.owner._id === userId) return -1;
    if (b.owner._id === userId) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen container flex flex-col justify-between bg-black">
      <div
        className="row flex-nowrap overflow-auto py-3 mb-3 px-2 border-bottom border-secondary"
        style={{ maxWidth: "100%" }}
      >
        <div className="col-auto text-center px-2">
          <Link to="/story" className="text-decoration-none">
            <div
              className="d-flex align-items-center justify-content-center border border-secondary"
              style={{
                height: "70px",
                width: "70px",
                borderRadius: "50%",
                overflow: "hidden",
                backgroundColor: "#f8f9fa",
              }}
            >
              <p className="m-0 fs-2 text-dark">+</p>
            </div>
            <small className="text-white d-block mt-1">Add</small>
          </Link>
        </div>

        {sortedStories.map((story, idx) => (
          <div key={idx} className="col-auto text-center px-2">
            <Link
              to={`/story-view`}
              state={{ media: story.media }}
              className="text-decoration-none"
            >
              <div
                className="border border-danger"
                style={{
                  height: "70px",
                  width: "70px",
                  borderRadius: "50%",
                  overflow: "hidden",
                }}
              >
                <img
                  src={story.media}
                  alt={`story-${idx}`}
                  style={{ height: "100%", width: "100%", objectFit: "cover" }}
                />
              </div>
              <small className="text-white d-block mt-1">
                {story.owner?._id === userId ? "Your Story" : story.owner?.username || "User"}
              </small>
            </Link>
          </div>
        ))}
      </div>
      <div className="flex-grow my-4">
        <h1 className="text-white mb-4">PicPe📷</h1>
        {posts.length === 0 ? (
          <p className="text-white text-center">No posts found.</p>
        ) : (
          <div className="d-flex flex-wrap justify-content-center gap-3">
            {posts.map((post) => (
              <div
                key={post._id}
                className="card bg-dark text-white p-2"
                style={{ width: "300px" }}
              >
{/*                 <p>@{post.owner.username}</p> */}
                <p>@User</p>
                <img
                  src={post.media}
                  alt="Post"
                  className="card-img-top"
                  style={{ height: "150px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <p className="card-text mb-2">{post.caption}</p>

                  <button
                    className={`like-button ${likedPosts[post._id] ? "liked" : ""}`}
                    onClick={() => {toggleLike(post._id); window.location.reload()}}
                  >
                    {likedPosts[post._id] ? <FavoriteIcon /> : <FavoriteBorderIcon />}{" "}
                    {post.likes.length}
                  </button>

                  <form
                    onSubmit={(e) => handleCommentSubmit(e, post._id)}
                    className="d-flex gap-2 my-2"
                  >
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Add a comment..."
                      value={commentInputs[post._id] || ""}
                      onChange={(e) => handleCommentChange(post._id, e.target.value)}
                    />
                    <Button variant="outline" type="submit" className="text-black">
                      Add
                    </Button>
                  </form>

                  <div
                    className="comments overflow-auto"
                    style={{ maxHeight: "120px" }}
                  >
                    {(comments[post._id] || []).map((c, idx) => (
                      <div
                        key={idx}
                        className="text-white d-flex align-items-center justify-content-between"
                      >
                        <div>
                          <b>@{c.user?.username || "User"}:</b> {c.text}
                        </div>
                        {c.user && userId === c.user._id && (
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

export default Home;




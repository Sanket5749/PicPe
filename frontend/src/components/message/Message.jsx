import React, { useState, useEffect } from "react";
import Footer from '../footer.jsx'
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from '@mui/icons-material/Send';
import "./Message.css"

function Message() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const url = "https://pic-pe-api.vercel.app/auth/me";
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch user");
        const result = await response.json();
        setUser(result.user || null);
      } catch (error) {
        setUser(null);
         console.error("Error fetching users:", error);
      }
    };
    const fetchUsers = async () => {
      try {
        const url = "https://pic-pe-api.vercel.app/auth/display";
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch users");
        const result = await response.json();
        setUsers(result.users || []);
      } catch (error) {
        setUsers([]);
        console.error("Error fetching users:", error);
      }
    };
    fetchUser();
    fetchUsers();
  }, []);

  const fetchMessages = async (otherId) => {
    if (!otherId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://pic-pe-api.vercel.app/messages/with/${otherId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setMessages(data.messages);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text || !selectedUser) return;
    const token = localStorage.getItem("token");
    const res = await fetch("https://pic-pe-api.vercel.app/messages/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ receiverId: selectedUser._id, text }),
    });
    const data = await res.json();
    if (data.success) {
      setText("");
      fetchMessages(selectedUser._id);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    const token = localStorage.getItem("token");
    await fetch(`https://pic-pe-api.vercel.app/messages/${messageId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (selectedUser) fetchMessages(selectedUser._id);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username &&
      user &&
      u._id !== user._id &&
      u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
<div className="container-fluid d-flex flex-column bg-black min-vh-100 px-3 py-2">
  <div className="d-flex align-items-center gap-3 border-bottom pb-2 mb-3">
    <img src="/user.jpg" alt="user" className="rounded-circle" style={{ width: 50, height: 50 }} />
    <h5 className="text-white m-0">{user ? user.username : "Undefined"}</h5>
  </div>

  <input
    type="text"
    className="form-control bg-dark text-white mb-3"
    placeholder="Search username"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <div className="d-flex flex-row overflow-x-auto mb-3 gap-2">
    {filteredUsers.map((u) => (
      <button
        key={u._id}
        className={`btn btn-sm ${selectedUser && selectedUser._id === u._id ? 'btn-light' : 'btn-outline-light'}`}
        onClick={() => {
          setSelectedUser(u);
          fetchMessages(u._id);
        }}
      >
        {u.username}
      </button>
    ))}
  </div>

  <div className="flex-grow-1 overflow-auto px-2" style={{ maxHeight: "60vh" }}>
    {loading ? (
      <p className="text-white">Loading...</p>
    ) : messages.length === 0 ? (
      <p className="text-white">Start a conversation</p>
    ) : (
      messages.map((msg) => (
        <div
          key={msg._id}
          className={`d-flex my-2 ${msg.sender === user?._id ? 'justify-content-end' : 'justify-content-start'}`}
        >
          <div className={`p-2 rounded-pill ${msg.sender === user?._id ? 'bg-primary text-white' : 'bg-light text-dark'}`}>
            {msg.text}
            {msg.sender === user?._id && (
              <button
                className="btn btn-sm text-white ms-2"
                onClick={() => handleDeleteMessage(msg._id)}
              >
                <DeleteIcon fontSize="small" />
              </button>
            )}
          </div>
        </div>
      ))
    )}
  </div>

  <form onSubmit={handleSend} className="d-flex align-items-center gap-2 mt-3">
    <input
      type="text"
      className="form-control bg-dark text-white"
      placeholder="Type a message..."
      value={text}
      onChange={(e) => setText(e.target.value)}
      disabled={!selectedUser}
    />
    <button className="btn btn-primary" type="submit" disabled={!text || !selectedUser}>
      <SendIcon />
    </button>
  </form>

  <Footer />
</div>
  )
}

export default Message

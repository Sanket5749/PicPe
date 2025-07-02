import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home/Home.jsx";
import Account from "./components/account/Account.jsx";
import Create from "./components/create/Create.jsx";
import Explore from "./components/explore/Explore.jsx";
import Message from "./components/message/Message.jsx";
import Signup from "./components/signup/Signup.jsx";
import Login from "./components/login/Login.jsx";
import PageNotFound from "./components/PageNotFound.jsx";
import Accounts from "./components/accounts/Accounts.jsx";
import Story from "./components/story/Story.jsx";
import StoryView from "./components/storyView/StoryView.jsx";

function ProtectedRoute({ element }) {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute element={<Home />} />} />

        <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
        <Route
          path="/account"
          element={<ProtectedRoute element={<Account />} />}
        />
        <Route
          path="/create"
          element={<ProtectedRoute element={<Create />} />}
        />
        <Route
          path="/story"
          element={<ProtectedRoute element={<Story />} />}
        />
        <Route
          path="/story-view"
          element={<ProtectedRoute element={<StoryView />} />}
        />
        <Route
          path="/explore"
          element={<ProtectedRoute element={<Explore />} />}
        />
        <Route
          path="/message"
          element={<ProtectedRoute element={<Message />} />}
        />
        <Route
          path="/account/:id"
          element={<ProtectedRoute element={<Accounts />} />}
        />

        <Route
          path="/signup"
          element={
            !localStorage.getItem("token") ? <Signup /> : <Navigate to="/" />
          }
        />
        <Route
          path="/login"
          element={
            !localStorage.getItem("token") ? <Login /> : <Navigate to="/" />
          }
        />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import CreateIcon from "@mui/icons-material/Create";
import ExploreIcon from "@mui/icons-material/Explore";
import ChatIcon from "@mui/icons-material/Chat";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

function Footer() {
  const [value, setValue] = React.useState("recents");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <BottomNavigation sx={{ width:"100%", backgroundColor : "black", color : "white" }}  value={value} onChange={handleChange}>
      <BottomNavigationAction
        label="Home"
        value="home"
        icon={<HomeIcon />}
        component={Link}
        to="/"
        style={{color : "white"}}
      />
      <BottomNavigationAction
        label="Create"
        value="create"
        icon={<CreateIcon />}
        component={Link}
        to="/create"
        style={{color : "white"}}
      />
        <BottomNavigationAction
          label="Message"
          value="message"
          icon={<ChatIcon />}
          component={Link}
          to="/message"
          style={{color : "white"}}
        />
        <BottomNavigationAction
          label="Explore"
          value="explore"
          icon={<ExploreIcon />}
          component={Link}
          to="/explore"
          style={{color : "white"}}
        />
      <BottomNavigationAction
        label="Account"
        value="account"
        icon={<AccountCircleIcon />}
        component={Link}
        to="/account"
        style={{color : "white"}}
      />
    </BottomNavigation>
  );
}

export default Footer;

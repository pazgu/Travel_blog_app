import React, { useState} from "react";
import {AppBar, Box, Toolbar, Typography, Button, Tabs, Tab} from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store";
import { useLocation } from "react-router-dom";

const Header = () => {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const [value, setValue] = useState(); //initialized to undefined so no button will be pressed
  const dispatch = useDispatch();
  const location = useLocation();

  return (
    <AppBar
      position="sticky"
      sx={{
        background:
          "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(76,39,163,1) 0%, rgba(100,63,157,1) 15%, rgba(29,139,144,1) 78%, rgba(66,104,142,1) 100%)",
      }}
    >
      {/*Material-UI component that represents a navigation bar*/}
      <Toolbar>
        {/*Material-UI component that represents the content within the navigation bar*/}
        <Typography variant="h4">Travel Blog App</Typography> {/*display text*/}
        {isLoggedIn && (
          <Box display="flex" marginLeft={"auto"} marginRight={"auto"}>
           <Tabs
            textColor="inherit"
            value={location.pathname} // Set the value of the current selected tab to the current pathname
            onChange={(_, val) => setValue(val)}
          >
            <Tab LinkComponent={Link} to="/blogs" value="/blogs" label="All Blogs" />
            <Tab LinkComponent={Link} to="/myBlogs" value="/myBlogs" label="My Blogs" />
            <Tab LinkComponent={Link} to="/blogs/add" value="/blogs/add" label="Add Blog" />
          </Tabs>
          </Box>
        )}
        <Box display="flex" marginLeft="auto">
          {!isLoggedIn ? (
            <>
              <Button
                LinkComponent={Link}
                to="/auth"
                variant="contained"
                sx={{ margin: 1, borderRadius: 5, backgroundColor: "#643f9d" }}
                color="secondary"
              >
                Login
              </Button>
              {/*the contained property render the button with a solid background color and a border*/}
              <Button
                LinkComponent={Link}
                to="/auth"
                variant="contained"
                sx={{ margin: 1, borderRadius: 5, backgroundColor: "#643f9d" }}
                color="secondary"
              >
                Sign up
              </Button>
            </>
         ) : (
            <Button
              onClick={() => dispatch(authActions.logout())}
              LinkComponent={Link}
              to="/auth"
              variant="contained"
              sx={{ margin: 1, borderRadius: 5, backgroundColor: "#643f9d" }}
              color="secondary"
            >
              Log out
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

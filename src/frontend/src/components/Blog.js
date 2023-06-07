/*
This component renders a Material UI Card with various components inside it.
The Card displays a description about the blog and includes an image,
a button to expand and collapse additional information about the blog 
and event handlers to toggle the additional options when the button is clicked.
*/

import React from 'react';
import { styled } from '@mui/material/styles';
import {
  Avatar,
  Card,
  Box,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Typography,
  CardActions,
  Collapse,
  Tooltip
} from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns'; // Import the date-fns library

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const Blog = ({ title, description, imageurl, userName, isUser, id }) => {
  const [expanded, setExpanded] = React.useState(false);
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/myBlogs/${id}`); //navigate to blogDetail component
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  
  const deleteRequest = async () => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/blog/${id}`);
      const data = await res.data;
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = () => {
    deleteRequest().then(() => navigate("/").then(() => navigate("/blogs")));
  };

  const LikeButton = () => {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    const handleLikeClick = () => {
      setIsLiked((prevIsLiked) => !prevIsLiked);
      setLikeCount((prevLikeCount) => (isLiked ? prevLikeCount - 1 : prevLikeCount + 1));
      localStorage.setItem(`postClapsCount-${id}`, likeCount + 1);
    };
    useEffect(() => {
      // Retrieve the likes count from local storage
      const savedClapsCount = localStorage.getItem(`postClapsCount-${id}`);
    
      if (savedClapsCount) {
        setLikeCount(Number(savedClapsCount));
      }
    }, []);

    return (
      <Tooltip title={`${likeCount} ${likeCount === 1 ? 'like' : 'likes'}`} placement="top">
      <IconButton
        aria-label={isLiked ? 'Unlike' : 'Like'}
        onClick={handleLikeClick}
        color={isLiked ? 'error' : 'disabled'}
      >
        <FavoriteIcon />
      </IconButton>
    </Tooltip>
    );
  };
  const currentDate = new Date(); // Get the current date
  return (
    <div>
      <Card sx={{ width: "40%", margin: "auto", marginTop: 2, padding: 2, boxShadow: "5px 5px 20px #000", ":hover": { boxShadow: "20px 20px 20px #000" } }}>
        {isUser && (
          <Box display="flex">
            <Tooltip title="Edit" placement="top">
              <IconButton onClick={handleEdit} sx={{ marginLeft: "auto" }}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete" placement="top">
              <IconButton onClick={handleDelete}>
                <DeleteIcon color='error' />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "#643f9d" }} aria-label="avatar">
              {userName}
            </Avatar>
          }
          title={title}
          subheader={format(currentDate, 'MMMM dd, yyyy')} // Format and display the current date
        />
        <CardMedia component="img" height="400" src="pexels.jpeg" alt={`${imageurl }`} />
        <CardContent>
          <hr />
          <br />
          <Typography variant="body2" color="text.secondary">
            <b>{userName}</b> {": "}{description}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <LikeButton />
          <Tooltip title="Share" placement="top">
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="show more" placement="top">
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </Tooltip>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>
              To see the full description please wait for the updated version :)
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    </div>
  );
};

export default Blog;

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Box, InputLabel, TextField, Typography, Button } from "@mui/material";

const BlogDetail = () => {
  const id = useParams().id; //to get the id from the url path
  const [blog, setblog] = useState();
  const labelStyles = { mb: 1, mt: 2, fontSize: "24px", fontWeight: "bold" }; //object to style the input labels
  const navigate = useNavigate();
  const [inputs, setInputs] = useState();
  const handleChange = (e) => {
    //to update the input values when they change
    setInputs((prevState) => ({
      ...prevState, //The spread operator is used to create a copy of the existing state object
      [e.target.name]: e.target.value, //dynamically update the name attribute of the input field
    }));
  };
  const fetchDetails = async () => {
    try{
      const res = await axios.get(`http://localhost:5000/api/blog/${id}`); //retreive the data from the user's blog 
      const data = await res.data;
      return data;
    } catch (err) {
      console.error(err);
    }
  } 

  useEffect(() => {
   fetchDetails().then(data => { 
    setblog(data.blog); //update the state with the retrieved blog data
    setInputs({
      title: data.blog.title, //set the title input value to the blog's title
      description: data.blog.description,
      imageURL: data.blog.imageURL,
    })
   })
  }, [id]); //fetch the details whenever the id changes

  const UpdateBlog = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/blog/update/${id}`, {
      title: inputs.title, //retrieve the last title and description added
      description: inputs.description,
    })
    const data = await res.data;
    return data;
    } catch (err) {
      console.error(err);
    } 
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log(inputs);
    UpdateBlog().then(data => console.log(data)).then(() => navigate("/myblogs")) //after updating the blog 
  }

  return (
    <div>
      {inputs && 
       <form onSubmit={handleSubmit}>
        <Box
          border={3}
          borderColor="purple"
          borderRadius={10}
          boxShadow={"10px 10px 20px #ccc"}
          padding={3}
          margin={"auto"}
          marginTop={3}
          display={"flex"}
          flexDirection={"column"}
          width={"80%"}
          bgcolor="rgba(255, 255, 255, 0.7)"
        >
          <Typography
            fontWeight={"bold"}
            padding={3}
            color="black"
            variant="h2"
            textAlign={"center"}
          >
            Post Your Blog
          </Typography>
          <InputLabel sx={labelStyles}>Title</InputLabel>
          <TextField
            name="title"
            value={inputs.title}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />
          <InputLabel sx={labelStyles}>Description</InputLabel>
          <TextField
            name="description"
            value={inputs.description}
            onChange={handleChange}
            margin="normal"      
            variant="outlined"
          />
          <Button
            sx={{ mt: 2, borderRadius: 4, backgroundColor: "#643f9d" }}
            variant="contained"
            type="submit"
          > Submit
          </Button>
        </Box>
      </form>
      }
    </div>
  )
}

export default BlogDetail
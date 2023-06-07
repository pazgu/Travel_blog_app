import { Box, InputLabel, TextField, Typography, Button, ThemeProvider, createTheme } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddBlog = () => {
  const labelStyles = { mb: 1, mt: 2, fontSize: "24px", fontWeight: "bold" };
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({ //initilize the input fields
    title: "",
    description: "",
    imageURL: "",
  });
  const [selectedImage, setSelectedImage] = useState(null); // Store the selected image file
  const [imageURL, setImageURL] = useState(""); // Store the image URL

  const handleChange = (e) => {
    //to update the input values when they change
    setInputs((prevState) => ({
      ...prevState, //The spread operator is used to create a copy of the existing state object
      [e.target.name]: e.target.value, //dynamically update the name attribute of the input field
    }));
  };
  //Function to send a request to add a blog
  const sendRequestToAddBlog = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/blog/add", {
        title: inputs.title,
        description: inputs.description,
        image: inputs.imageURL,
        user: localStorage.getItem("userId"),
      });
      const data = await res.data;
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (selectedImage) {
      try {
        const formData = new FormData();
        formData.append("image", selectedImage); // Append the selected image file to the form data
  
        // Send a request to upload the image
        const uploadRes = await axios.post("http://localhost:5000/api/blog/upload", formData);
        const { filePath } = uploadRes.data;
  
        // Send a request to add the blog with the uploaded image URL and original filename
        const addBlogRes = await axios.post("http://localhost:5000/api/blog/add", {
          title: inputs.title,
          description: inputs.description,
          image: filePath, // Use the original filename instead of the filepath
          user: localStorage.getItem("userId"),
        });
  
        const data = addBlogRes.data;
        console.log(data); // Handle the response data as needed
        navigate("/myBlogs");
      } catch (error) {
        console.error(error);
      }
    } else {
      // Handle the case where no image is selected
      alert("Please select an image");
    }
  };

  const darkTheme = createTheme({ //to toggle between themes
    palette: {
      mode: "dark",
      primary: {
        main: "#643f9d",
      },
      background: {
        default: "#393e46",
        paper: "#424242",
      },
    },
  });
  
  const lightTheme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#643f9d",
      },
      background: {
        default: "#fff",
        paper: "#f5f5f5",
      },
    },
  });

  const [themeMode, setThemeMode] = useState("light"); // Initialize with light theme
  const theme = themeMode === "dark" ? darkTheme : lightTheme;

  const handleThemeChange = () => {
    setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    
  };

  // Function to handle file selection
  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // Get the selected file from the input element
    setSelectedImage(file); // Store the selected image file
    setImageURL(URL.createObjectURL(file)); // Create a URL object from the file and set it as the image URL
  };

  return (
    <ThemeProvider theme={theme}>
    <div>
      <form onSubmit={handleSubmit}>
        <Box
          bgcolor={theme.palette.background.paper}
          border={3}
          borderColor={theme.palette.primary.main}
          borderRadius={10}
          boxShadow={"10px 10px 20px #ccc"}
          padding={3}
          margin={"auto"}
          marginTop={3}
          display={"flex"}
          flexDirection={"column"}
          width={"80%"}
        >
          <Typography
            fontWeight={"bold"}
            padding={3}
            color={theme.palette.text.primary}
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
          <InputLabel sx={labelStyles}>Image</InputLabel>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload} // Handle file selection
          />
          {imageURL && <img src={imageURL} alt="Selected" width={"100px"} height={"100px"} />} {/* Display the selected image */}
          <Button
            sx={{ mt: 2, borderRadius: 4, backgroundColor: "#643f9d" }}
            variant="contained"
            type="submit"
          > post
          </Button>
          <Button sx={{ mt: 2, borderRadius: 4, }} onClick={handleThemeChange}>Toggle Theme</Button>
        </Box>

      </form>
    </div>
    </ThemeProvider>
  );
};

export default AddBlog;

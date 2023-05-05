import { Box, TextField, Typography, Button } from "@mui/material";
import React, { useState } from "react";
import axios from "axios"; //used to make HTTP requests from the web page to the back-end API

const Auth = () => {
  // as to authentication
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState, //The spread operator is used to create a copy of the existing state object
      [e.target.name]: e.target.value, //dynamically update the name attribute of the input field
    }));
  };

  const sendRequest = async () => {
    try {
       //the res variable below sends an HTTP POST request to the login URL with the object representing the user credentials
      const res = await axios.post("http://localhost:5000/api/user/login", {
        email: inputs.email,
        password: inputs.password,
      });
      if (res) { //checks is res is not null or undefined before accessing its data property
        const data = await res.data;
        return data; //Once a response is received from the server, the code extracts the data from the response and returns it
      }
    } catch (err) { //try to catch an error occur during the API call 
      console.log(err);
    }
  }; //after the request sent, the server should validate the user's credentials and respond with an authentication token (piece of data that is unique and is used to identify the user) if successful
  
  //After sendRequest is called, handleSubmit finishes executing without waiting for sendRequest to complete
  const handleSubmit = (e) => {
    e.preventDefault(); //prevents the page from refreshing or navigating to a new page on form submission
    console.log(inputs);
    sendRequest();
  };

  const [isSignup, setisSignup] = useState(false);
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box
          maxWidth={500}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          boxShadow="10px 10px 20px #ccc"
          padding={3}
          margin="auto"
          marginTop={3}
          borderRadius={5}
        >
          <Typography variant="h3" padding={2}>
            {isSignup ? "Signup" : "Login"}
          </Typography>
          {isSignup && (
            <TextField
              name="name"
              onChange={handleChange}
              value={inputs.name}
              placeholder="Name"
              margin="dense"
            />
          )}
          <TextField
            name="email"
            onChange={handleChange}
            value={inputs.email}
            type="email"
            placeholder="Email"
            margin="dense"
          />
          <TextField
            name="password"
            onChange={handleChange}
            value={inputs.password}
            type="password"
            placeholder="Password"
            margin="dense"
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ borderRadius: 2, backgroundColor: "#643f9d", margin: "10px" }}
            color="secondary"
          >
            Submit
          </Button>
          <Button
            onClick={() => setisSignup(!isSignup)}
            sx={{ borderRadius: 2 }}
          >
            Change to {isSignup ? "Login" : "Signup"}
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default Auth;

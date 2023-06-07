import { Box, TextField, Typography, Button } from "@mui/material";
import React, { useState } from "react";
import axios from "axios"; //used to make HTTP requests from the web page to the back-end API
import { useDispatch } from "react-redux";
import { authActions } from "../store";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  // as to authentication
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
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

  const validateInputs = () => {
    let isValid = true;
    const updatedErrors = { ...errors };

    // Name validation (if present)
    if (inputs.name.trim() && inputs.name.length < 2) {
      updatedErrors.name = "Name should have at least 2 characters";
      isValid = false;
    } else {
      updatedErrors.name = "";
    }
    // Email validation
    if (!inputs.email.trim()) {
      updatedErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(inputs.email)) {
      updatedErrors.email = "Invalid email format";
      isValid = false;
    } else {
      updatedErrors.email = "";
    }

 // Password validation
 if (!inputs.password.trim()) {
  updatedErrors.password = "Password is required";
  isValid = false;
} else if (inputs.password.length < 6) {
  updatedErrors.password = "Password should have at least 6 characters";
  isValid = false;
} else {
  updatedErrors.password = "";
}
  setErrors(updatedErrors);
  return isValid;
  };

  const sendRequestAuthentication = async (type = "login") => {
    try {
      //the res variable below sends an HTTP POST request to the login URL with the object representing the user credentials
      const res = await axios.post(`http://localhost:5000/api/user/${type}`, {
        name: inputs.name,
        email: inputs.email,
        password: inputs.password,
      });
      const data = await res.data;
      console.log(data); //to get the user credentials and the message object
      return data; //Once a response is received from the server, the code extracts the data from the response and returns it  
    } catch (err) {
      console.error(err);
    }
  }; //after the request sent, the server should validate the user's credentials and respond with an authentication token (piece of data that is unique and is used to identify the user) if successful

  //After sendRequestAuthentication is called, handleSubmit finishes executing without waiting for sendRequest to complete
  const handleSubmit = (e) => {
    e.preventDefault(); //prevents the page from refreshing or navigating to a new page on form submission
    console.log(inputs);
    if (validateInputs()) {
    if (isSignup) {
      sendRequestAuthentication("signup").then((data) => localStorage.setItem("userId", data.user._id)) //store the user id 
        .then(() => dispatch(authActions.login())) //dispatches the authActions.login() action, which updates the authentication state of the application accordingly.
        .then(() => navigate("/blogs"))
        .then((data) => console.log(data));
    } else {
      sendRequestAuthentication().then((data) => localStorage.setItem("userId", data.user._id))
      //I used localStorage to store the user id, instead of redux store so even after the user logs out the id will be saved
        .then(() => dispatch(authActions.login()))
        .then(() => navigate("/blogs"))
        .then((data) => console.log(data));
    }
  }
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
           boxShadow="10px 10px 10px #000"
           padding={3}
           margin="auto"
           marginTop={0.2}
           borderRadius={5}
           bgcolor="rgba(255, 255, 255, 0.7)" // Set a semi-transparent white background for better visibility
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
              error={!!errors.name}
              helperText={errors.name}
            />
          )}
          <TextField
            name="email"
            onChange={handleChange}
            value={inputs.email}
            type="email"
            placeholder="Email"
            margin="dense"
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            name="password"
            onChange={handleChange}
            value={inputs.password}
            type="password"
            placeholder="Password"
            margin="dense"
            error={!!errors.password}
            helperText={errors.password}
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
            sx={{
              borderRadius: 2,
              color: "#000",
              fontWeight: "bold",
            }}
          >
            Change to {isSignup ? "Login" : "Signup"}
          </Button>
        </Box>
      </form>
    </div>
  );
  
};


export default Auth;

import User from "../model/User";
import bcrypt from "bcryptjs";

//The async function getAllUser below is a middleware function that retrieves all users from the database and sends a response to the client.
export const getAllUser = async (req, res, next) => {
  //the parameters are for request and response to and from the http
  //In Express, middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application's request-response cycle.
  let users; //undefined as default
  try {
    users = await User.find(); //to attempt to retrieve all users from the database
  } catch (err) {
    console.log(err);
  }
  if (!users) {
    return res.status(404).json({ message: "No Users Found" });
  }
  return res.status(200).json({ users }); //http status code of 200 means that the request has succeeded
};

//since we're fetching data from the database using User.find(), which is an asynchronous operation, we need to use async and await to ensure that we're able to wait for the result of the database operation before continuing with the rest of the function's logic.

export const signup = async (req, res, next) => {
  const { name, email, password } = req.body; //extracts the fields from the req.body object using destructuring assignment
  //shorthand of:
  //const name = req.body.name;
  //const email = req.body.email;
  //const password = req.body.password;
  let existingUser;
  try {
    existingUser = await User.findOne({ email }); //email is the key value
  } catch (err) {
    return console.log(err);
  }
  if (existingUser) {
    return res.status(400).json({ message: "User Already Exists! Login Instead" });
  }
  const encryptedPassword = bcrypt.hashSync(password); //encryptes the password
  const user = new User({
    name,
    email,
    password: encryptedPassword,
    blogs: []
  });

  try {
    await user.save(); // Saves the new user object to the database
  } catch (err) {
    return console.log(err);
  }
  return res.status(201).json({ user }); //http status code of 201 means that a new resource has been successfully created
};

export const login = async (req, res, next) => {
  const {email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email }); 
  } catch (err) {
    return console.log(err);
  }
  if (!existingUser) {
    return res.status(404).json({ message: "Invalid Email. Please Sign In To Join Our Journey" });
  }
  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password); // Compares the provided password with the stored password
  if (!isPasswordCorrect){
    return res.status(400).json({message: "Incorrect Password"});
  }
  return res.status(200).json({message: "Login Successfully!"})
};

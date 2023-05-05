import Express from "express";
import { getAllUser, signup, login } from "../controllers/user-controller";

const userRouter = Express.Router();

userRouter.get("/", getAllUser); //When a GET request is sent to the root route ("/"), it will trigger the function to handle the request and respond with the data.
userRouter.post("/signup", signup); //When a POST request is sent to this route, it will trigger the signup function.
userRouter.post("/login", login); //When a POST request is sent to this route, it will trigger the login function.

export default userRouter;

//This file defines a route for getting all users, and exports the router object so it can be used by other parts of the application.

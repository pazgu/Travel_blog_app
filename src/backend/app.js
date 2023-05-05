import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/user-routes";
import blogRouter from "./routes/blog_routers";

const app = express();
app.use(express.json()); //parse all the data to json format
app.use("/api/user", userRouter);
//sets up a middleware function using the use() method. The middleware function will be called for any incoming requests that match the route "/api/user".
app.use("/api/blog", blogRouter);

mongoose
  .connect("mongodb+srv://admin:89K87daj83GfcC8@cluster0.ayyd19y.mongodb.net/Travel_Blog?retryWrites=true&w=majority") //connects to the MongoDB database
  .then(() => app.listen(3000)) //starts the express application listening on port 5000 for incoming requests.
  .then(() =>
    console.log("Connected To DataBase And Listening To localhost 5000")
  )
  .catch((err) => console.log(err));

  //username: admin
  //password to cluster : 89K87daj83GfcC8
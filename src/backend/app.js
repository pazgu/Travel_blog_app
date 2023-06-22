import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/user-routes";
import blogRouter from "./routes/blog_routers";
import cors from "cors";
import config from "./congif";

const app = express();
app.use(cors()); // Allow all cors requests
app.use(express.json()); //parse all the data to json format
app.use("/api/user", userRouter);
//The middleware function will be called for any incoming requests that match the route "/api/user".
app.use("/api/blog", blogRouter);

mongoose
 .connect(config.dbConnectionString) //connects to the MongoDB database
  .then(() => app.listen(5000)) //starts the express application listening on port 5000 for incoming requests.
  .then(() =>
    console.log("Connected To DataBase And Listening To localhost 5000")
  )
  .catch((err) => console.error(err));

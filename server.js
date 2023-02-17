import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { Post } from "./models/Post.js";
import { User } from "./models/User.js";
import { Comment } from "./models/Comment.js";

const MONGO_URI = "mongodb://localhost/TEST_blog_db";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connection to database established!"))
  .catch((err) => console.log("[ERROR] Connection failed!", err.message));

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json()); // BODY PARSER

app.get("/", async (req, res) => {
  try {
    res.send("<h1>Welcome to Relations API</h1>");
  } catch (err) {
    next(err);
  }
});

app.get("/user", async (req, res, next) => {
  try {
    const usersAll = await User.find();
    res.json(usersAll);
  } catch (err) {
    next(err);
  }
});

app.post("/user", async (req, res, next) => {
  try {
    const userNew = await User.create(req.body);
    res.json(userNew);
  } catch (err) {
    next(err);
  }
});

app.get("/post", async (req, res, next) => {
  try {
    const post = await Post.find();
    res.json(post);
  } catch (err) {
    next(err);
  }
});

app.get("/post/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    res.json(post);
  } catch (err) {
    next(err);
  }
});

app.post("/post", async (req, res, next) => {
  try {
    const postNew = await Post.create(req.body);
    res.json(postNew);
  } catch (err) {
    next(err);
  }
});

app.patch("/post/:id", async (req, res, next) => {
  try {
    const postUpdated = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(postUpdated);
  } catch (err) {
    next(err);
  }
});

// SUBROUTES
// - ADD comment
app.post("/post/:id/comments", async (req, res, next) => {
  const postId = req.params.id;
  const commentData = req.body;

  // two techniques
  // technique 1. grab parent and update children directly

  try {
    // step 1: grab the parent
    const post = await Post.findById(postId)
    // step 2: insert the comment into the comments collection
    const commentNew = await Comment.create(commentData)
    // step 3: add the created comment ID to the nested array
    postToUpdate.likes.push(commentNew._id)
    await post.save() // save the post object
    res.json(post)
  }
  catch(err) {
    console.log(err);
    next(err)
  }

  // technique 2. mongo update query (=> $push, $pull, $pop, $addToSet, $inc)
  // step 1: add the comment to DB to get an ID
  const commentNew = await Comment.create(commentData)
  // step 2: push the ID of the new comment into the nested comments array of the parent
  try {
    const post = await Post.findByIdAndUpdate(postId, {
      $push: {
        comments: commentNew._id
      }
    }, {
      new: true
    })
    res.json(post);
  }
  catch(err) {
    console.log(err)
    next(err)
  }

})

// - DELETE Route for nested comments: /post/:postId/comments/:commentId
app.delete("/post/:postId/comments/:commentId", async (req, res, next) => {

  const { postId, commentId } = req.params

  try {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        // pull removes an item from a nested array / array of subdocuments
        $pull: {
          comments: commentId,
        },
      },
      {
        new: true,
      }
    );
    res.json(post);
  } catch (err) {
    console.log(err);
    next(err);
  }


})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});

const express = require("express");
const path = require("path");
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static("public"));

app.use((req,res,next)=>{
  console.log("request recieved");
  next();
});

app.get("/", (req,res)=>{
  res.sendFile(path.join(__dirname, "/views/practice.html"));
});

app.use((req , res , next)=>{
    res.status(404).send("404 - error");
    next();
});

app.get("/about", (req,res)=>{
  res.send("I'm the about page - TODO: HTML");
});


app.listen(HTTP_PORT, ()=>{
  console.log("server listening on: " + HTTP_PORT);
});
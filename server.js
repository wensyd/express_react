//////////////////////////////////
// Dependencies
/////////////////////////////////
// get .env variables
require("dotenv").config()
// pull PORT from .env, give it a default of 3000 (object destructuring)
const {PORT = 3001, DATABASE_URL} = process.env
// import express
const express = require("express")
// create the application object
const app = express()
// import mongoose
const mongoose = require("mongoose")
// import middleware
const cors = require("cors")
const morgan = require("morgan")


/////////////////////////////////
// Database Connection
////////////////////////////////
// establish connection
mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

// Connection Events
mongoose.connection
.on("open", () => console.log("You are connected to Mongo"))
.on("close", () => console.log("You are disconnected from Mongo"))
.on("error", (error) => console.log(error))

/////////////////////////////////
//Middleware
//////////////////////////////////
app.use(cors()) // prevent cors errors, opens up access for frontend
app.use(morgan("dev")) //logging
app.use(express.json()) // parse json bodies


////////////////////////////////
// Models
////////////////////////////////

// the people schema
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String
}, {timestamps: true})

const People = mongoose.model("People", PeopleSchema)





////////////////////////////////
// Routes
////////////////////////////////
// create a test route
app.get("/", (req, res) => {
    res.send("Hello World")
})


//people index route 
// get request to /people, returns all people as json 
app.get("/people", async (req, res) => {
    try {
        // send all people
        res.json(await People.find({}));
      } catch (error) {
        res.status(400).json({ error });
      }
    });
    
// People create route
// post request to /people, uses request body to make new people
app.post("/people", async (req, res) => {
    try {
      // screate a new person
      res.json(await People.create(req.body));
    } catch (error) {
      res.status(400).json({ error });
    }
  });

  // People update  route
// put request /people/:id, updates person based on id with request body
app.put("/people/:id", async (req, res) => {
    try {
        // update a person
        res.json(await People.findByIdAndUpdate(req.params.id, req.body, {new: true}));
      } catch (error) {
        res.status(400).json({ error });
      }
})

// Destroy Route 
// delete request to /people/:id, deletes the person specified
app.delete("/people/:id", async (req, res) => {
    try {
        // delete a person
        res.json(await People.findByIdAndRemove(req.params.id));
      } catch (error) {
        res.status(400).json({ error });
      }
})



/////////////////////////////////
// Server Listener
/////////////////////////////////
app.listen(PORT, () => {console.log(`listening on PORT ${PORT}`)})
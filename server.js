/************************************************************************ *********
* WEB422 – Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students. *
* Name: ________Oliver Liu______________ Student ID: ____109262204__________ Date: _______2023-01-18_________
* Cyclic Link: _______________________________________________________________
* ********************************************************************************/


const express = require("express");
const cors = require('cors')
require('dotenv').config();

const MoviesDB = require("./modules/moviesDB.js");
const { join } = require("path");
const db = new MoviesDB();
const app = express();
const HTTP_PORT = process.env.PORT || 8080;


app.use(cors())

app.use(express.json())

app.get('/',(req,res)=>{
    res.json({message: "API Listening"})
})

app.post("/api/movies", async (req,res)=>{
    try{
      let result = await db.addNewMovie(req.body);
      res.json(result);
    }catch(err){
      res.status(404).json({message: err});
    }
    
  });

app.get("/api/movies", (req,res)=>{
    if(!req.query.page && !req.query.perPage)
        return res.status(400).json({message: 'page and perPage are needed'})

    db.getAllMovies(req.query.page,req.query.perPage,req.query.title).then(data=>{
      res.json(data);
    }).catch(err=>{
      res.status(404).json({message: err});
    });
  });


  app.get("/api/movies/:id", async (req,res)=>{
    try{  
      let data = await db.getMovieById(req.params.id);
      res.json(data);
    }catch(err){
      res.status(404).json({message: err});
    }
});
app.put("/api/movies/:id",(req,res)=>{
    db.updateMovieById(req.body,req.params.id).then((data) => {
        res.status(201).json({message: 'Movie Updated'});
    })
    .catch((err) => {
        res.status(404).json({message:err})
    })
})
app.delete("/api/users/:id",(req,res)=>{
    db.deleteMovieById(req.params.id).then((data)=>{
        res.status(201).json({message: 'Movie Deleted'});
    }).catch(err=>{
        res.status(404).json({message:err});
    })
})


db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{ app.listen(HTTP_PORT, ()=>{
    console.log(`server listening on: ${HTTP_PORT}`); });
    }).catch((err)=>{ console.log(err);
});
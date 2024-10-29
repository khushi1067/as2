/********************************************************************************* 

WEB322 – Assignment 02 

I declare that this assignment is my own work in accordance with Seneca
Academic Policy. No part of this assignment has been copied manually or 
electronically from any other source (including 3rd party web sites) or 
distributed to other students. I acknoledge that violation of this policy
to any degree results in a ZERO for this assignment and possible failure of
the course. 

Name:   
Student ID:   
Date:  
Cyclic Web App URL:  
GitHub Repository URL:  

********************************************************************************/  

const express = require('express');
const storeService = require("./store-service");
const path = require("path");
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect("/about");
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, "/views/about.html"))
});

app.get('/store', (req,res)=>{
    storeService.getPublishedItems().then((data=>{
        res.json(data);
    })).catch(err=>{
        res.json({message: err});
    });
});

app.get('/items', (req,res)=>{
    storeService.getAllItems().then((data=>{
        res.json(data);
    })).catch(err=>{
        res.json({message: err});
    });
});

app.get('/categories', (req,res)=>{
    storeService.getCategories().then((data=>{
        res.json(data);
    })).catch(err=>{
        res.json({message: err});
    });
});

app.get('/items/add', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/addItem.html'));
});


app.use((req,res)=>{
    res.status(404).send("404 - Page Not Found")
})

storeService.initialize().then(()=>{
    app.listen(HTTP_PORT, () => { 
        console.log('server listening on: ' + HTTP_PORT); 
    });
}).catch((err)=>{
    console.log(err);
})




const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
    cloud_name: 'YourCloudName',
    api_key: 'YourAPIKey',
    api_secret: 'YourAPISecret',
    secure: true
});

const upload = multer(); // no disk storage


/*
const express = require('express');
const path = require('path');
const storeService = require('./store-service');
const app = express();
 

require('pg'); // explicitly require the "pg" module
const Sequelize = require('sequelize');

app.use(express.static('public'));

app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
    res.redirect('/about');
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, "views/about.html"));
});

app.get('/shop', (req, res) => {
    storeService.getPublishedItems()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.json({ message: err });
        });
});

app.get('/items', (req, res) => {
    storeService.getAllItems()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.json({ message: err });
        });
});

app.get('/categories', (req, res) => {
    storeService.getCategories()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.json({ message: err });
        });
});

app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

storeService.initialize()
    .then(() => {
        const PORT = process.env.PORT || 8080;
        app.listen(PORT, () => {
            console.log(`Express http server listening on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error(err);
    });

*/

   
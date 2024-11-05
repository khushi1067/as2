/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: __Khushi Abhay Bhandari______ Student ID: _106774235____ Date: _01-11-2024_
*
*  Vercel Web App URL: __assignment-3-8fshwx01j-khushi-bhandaris-projects-15087a2f.vercel.app
*  GitHub Repository URL: _git@github.com:khushi1067/as2.git__
*
********************************************************************************/ 



const express = require('express');
const storeService = require("./store-service");
const path = require("path");
const app = express();



const HTTP_PORT = process.env.PORT || 8080;


const multer = require("multer");
const upload = multer();
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

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


cloudinary.config({
    cloud_name: 'dagl6ayla',
    api_key: '942819521975566',
    api_secret: 'aBfxbZdlSoBlHx5F3p-GOsV0Ov4',
    secure: true
});




app.get('/items/add', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/addItem.html'));
});///////////////////////


app.post('/items/add', upload.single("featureImage"), (req, res) => {
    if (req.file) {
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream((error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                });
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        async function upload(req) {
            let result = await streamUpload(req);
            return result;
        }

        upload(req).then((uploaded) => {
            processItem(uploaded.url);
        });
    } else {
        processItem("");
    }

    function processItem(imageUrl) {
        req.body.featureImage = imageUrl;

        storeService.addItem(req.body)
            .then(
                () => res.redirect('/items')
            )
            .catch(
                err => res.status(500).send(err)
            );
    }
});


app.get('/items', (req, res) => {
    if (req.query.category) {
        storeService.getItemsByCategory(req.query.category)
            .then(
                items => res.json(items)
            )
            .catch(
                err => res.status(404).send(err)
            );
    } else if (req.query.minDate) {
        storeService.getItemsByMinDate(req.query.minDate)
            .then(
                items => res.json(items)
            )
            .catch(
                err => res.status(404).send(err)
            );
    } else {
        storeService.getAllItems() 
            .then(
                items => res.json(items)
            )
            .catch(
                err => res.status(500).send(err)
            );
    }
});

app.get('/item/:id', (req, res) => {
    storeService.getItemById(req.params.id)
        .then(
            item => res.json(item)
        )
        .catch(
            err => res.status(404).send(err)
        );
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




app.get('/shop', (req, res) => {
    storeService.getPublishedItems()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.json({ message: err });
        });
});

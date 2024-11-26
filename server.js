/*********************************************************************************
*  WEB322 – Assignment 04
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
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

const stripJs = require('strip-js');


const exphbs = require('express-handlebars');

const app = express();
 

app.engine('.hbs', exphbs.engine({
  extname: '.hbs', 
  helpers: {
    
    navLink: function (url, options) {
      return (
        '<li class="nav-item"><a ' +
        (url === app.locals.activeRoute ? ' class="nav-link active" ' : ' class="nav-link" ') +
        ' href="' + url + '">' + options.fn(this) + '</a></li>'
      );
    },
 
    equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3) throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue !== rvalue) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    },
    safeHTML: function (context) {
        return stripJs(context);
    }
  }
}));




app.set('view engine', '.hbs'); 
app.set('views', path.join(__dirname, 'views')); 

const HTTP_PORT = process.env.PORT || 8080;
cloudinary.config({
    cloud_name: 'dagl6ayla',
    api_key: '942819521975566',
    api_secret: 'aBfxbZdlSoBlHx5F3p-GOsV0Ov4',
    secure: true
});

const upload = multer(); 
const itemData = require("./store-service");

app.use(express.static('public'));


app.get('/', (req, res) => {
    res.redirect("/shop");
});

app.get('/about', (req, res) => {
  
   res.render('about');
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
      res.render("items",{items:data});
    })).catch(err=>{
        res.render("items", {message: "no results"});
    });
});

app.get("/categories", (req, res) => {
    storeService.getCategories()
        .then((data) => {
            res.render("categories", { categories: data });
        })
        .catch((err) => {
            console.error("Error retrieving categories:", err);
            res.render("categories", { message: "no results" });
        });
});




app.get('/items/add',(req,res)=>{
   res.render('addItem')
});


app.get("/shop", async (req, res) => {
    let viewData = {};
  
    try {
      let items = [];
  
      if (req.query.category) {

        items = await itemData.getPublishedItemsByCategory(req.query.category);
      } else {

        items = await itemData.getPublishedItems();
      }
  
      items.sort((a, b) => new Date(b.itemDate) - new Date(a.itemDate));
  
      let item = items[0];
  
      viewData.items = items;
      viewData.item = item;
    } catch (err) {
      viewData.message = "no results";
    }
  
    try {
      let categories = await itemData.getCategories();
  
      viewData.categories = categories;
    } catch (err) {
      viewData.categoriesMessage = "no results";
    }
  
    res.render("shop", { data: viewData });
  });


app.get('/shop/:id', async (req, res) => {

    let viewData = {};
  
    try{
  
        let items = [];
  
        if(req.query.category){

            items = await itemData.getPublishedItemsByCategory(req.query.category);
        }else{

            items = await itemData.getPublishedItems();
        }
  
        items.sort((a,b) => new Date(b.itemDate) - new Date(a.itemDate));
  
        viewData.items = items;
  
    }catch(err){
        viewData.message = "no results";
    }
  
    try{

        viewData.item = await itemData.getItemById(req.params.id);
    }catch(err){
        viewData.message = "no results"; 
    }
  
    try{
     
        let categories = await itemData.getCategories();
  
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }
  
    res.render("shop", {data: viewData})
  });

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
            .then(() => res.redirect('/items'))
            .catch(err => res.status(500).send(err));
    }
});

app.get('/items', (req, res) => {
    if (req.query.category) {
        storeService.getItemsByCategory(req.query.category)
            .then(items => res.render('items', { items }))
            .catch(err => res.status(404).send(err));
    } 
    else if (req.query.minDate) {
        storeService.getItemsByMinDate(req.query.minDate)
            .then(items => res.render('items', { items }))
            .catch(err => res.status(404).send(err));
    } 
    else {
        storeService.getAllItems()
            .then(items => res.render('items', { items }))
            .catch(err => res.status(500).send(err));
    }
});


app.get('/item/:id', (req, res) => {
    storeService.getItemById(req.params.id)
        .then(item => res.json(item))
        .catch(err => res.status(404).send(err));
});

app.use((req,res)=>{
    res.status(404).render("404")
})

storeService.initialize().then(()=>{
    app.listen(HTTP_PORT, () => { 
        console.log('server listening on: ' + HTTP_PORT); 
    });
}).catch((err)=>{
    console.log(err);
})
app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    app.locals.viewingCategory = req.query.category;
    next();
});



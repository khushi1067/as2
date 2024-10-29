
const fs = require("fs");

let posts = [];
let categories = [];

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/items.json', 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                posts = JSON.parse(data);

                fs.readFile('./data/categories.json', 'utf8', (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        categories = JSON.parse(data);
                        resolve();
                    }
                });
            }
        });
    });
}

module.exports.getAllItems = function(){
    return new Promise((resolve,reject)=>{
        (posts.length > 0 ) ? resolve(posts) : reject("no results returned"); 
    });
}

module.exports.getPublishedItems = function(){
    return new Promise((resolve,reject)=>{
        (items.length > 0) ? resolve(items.filter(item => items.published)) : reject("no results returned");
    });
}

module.exports.getCategories = function(){
    return new Promise((resolve,reject)=>{
        (categories.length > 0 ) ? resolve(categories) : reject("no results returned"); 
    });
}


/*const fs = require('fs');
const path = require('path');

let items = [];
let categories = [];

module.exports = {
    initialize: function () {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(__dirname, 'data', 'items.json'), 'utf8', (err, data) => {
                if (err) {
                    reject("Unable to read items.json");
                } else {
                    try {
                        items = JSON.parse(data);
                        fs.readFile(path.join(__dirname, 'data', 'categories.json'), 'utf8', (err, data) => {
                            if (err) {
                                reject("Unable to read categories.json");
                            } else {
                                try {
                                    categories = JSON.parse(data);
                                    resolve();
                                } catch (parseErr) {
                                    reject("Error parsing categories.json");
                                }
                            }
                        });
                    } catch (parseErr) {
                        reject("Error parsing items.json");
                    }
                }
            });
        });
    },
    getAllItems: function () {
        return new Promise((resolve, reject) => {
            if (items.length > 0) {
                resolve(items);
            } else {
                reject("no results returned");
            }
        });
    },
    getPublishedItems: function () {
        return new Promise((resolve, reject) => {
            const publishedItems = items.filter(item => item.published);
            if (publishedItems.length > 0) {
                resolve(publishedItems);
            } else {
                reject("no results returned");
            }
        });
    },
    getCategories: function () {
        return new Promise((resolve, reject) => {
            if (categories.length > 0) {
                resolve(categories);
            } else {
                reject("no results returned");
            }
        });
    }
};

*/
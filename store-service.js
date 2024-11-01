const fs = require('fs');

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
};

module.exports.getAllItems = function () {
    return new Promise((resolve, reject) => {
        posts.length > 0 ? resolve(posts) : reject("no results returned");
    });
};

module.exports.getPublishedItems = function () {
    return new Promise((resolve, reject) => {
        const publishedItems = posts.filter(item => item.published);
        publishedItems.length > 0 ? resolve(publishedItems) : reject("no results returned");
    });
};

module.exports.getCategories = function () {
    return new Promise((resolve, reject) => {
        categories.length > 0 ? resolve(categories) : reject("no results returned");
    });
};

module.exports.addItem = function (itemData) {
    return new Promise((resolve, reject) => {
        itemData.published = itemData.published ? true : false;
        itemData.id = posts.length + 1;
        posts.push(itemData);
        resolve(itemData);
    });
};

module.exports.getItemsByCategory = function (category) {
    return new Promise((resolve, reject) => {
        const filteredItems = posts.filter(item => item.category === category);
        filteredItems.length > 0 ? resolve(filteredItems) : reject("no results returned");
    });
};

module.exports.getItemsByMinDate = function (minDateStr) {
    return new Promise((resolve, reject) => {
        const filteredItems = posts.filter(item => new Date(item.postDate) >= new Date(minDateStr));
        filteredItems.length > 0 ? resolve(filteredItems) : reject("no results returned");
    });
};

module.exports.getItemById = function (id) {
    return new Promise((resolve, reject) => {
        const item = posts.find(item => item.id === parseInt(id));
        item ? resolve(item) : reject("no result returned");
    });
};
/*
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

function addItem(itemData) {
    return new Promise((resolve) => {
        itemData.published = itemData.published || false;
        itemData.id = items.length + 1;
        items.push(itemData);
        resolve(itemData);
    });
}
module.exports = { addItem };


function getItemsByCategory(category) {
    return new Promise((resolve, reject) => {
        const filteredItems = items.filter(item => item.category == category);
        if (filteredItems.length > 0) resolve(filteredItems);
        else reject("no results returned");
    });
}

function getItemsByMinDate(minDateStr) {
    return new Promise((resolve, reject) => {
        const minDate = new Date(minDateStr);
        const filteredItems = items.filter(item => new Date(item.postDate) >= minDate);
        if (filteredItems.length > 0) resolve(filteredItems);
        else reject("no results returned");
    });
}

function getItemById(id) {
    return new Promise((resolve, reject) => {
        const item = items.find(item => item.id == id);
        if (item) resolve(item);
        else reject("no result returned");
    });
}

*/
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
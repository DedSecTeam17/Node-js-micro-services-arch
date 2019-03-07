const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const Book = require('./models/book');


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({type: 'application/*+json'}));


app.listen(4545, () => {
    mongoose.connect('mongodb://admin:mohamed1337@ds349045.mlab.com:49045/books_service', {useNewUrlParser: true});
    console.log("Test");
});


/// get all books from db
app.get('/book', async (req, res) => {

    try {
        const books = await Book.find({}).limit(10);
        sendJsonResponse(res, books, 200);


    } catch (e) {
        sendJsonResponse(res, "error", 200);
    }


    res.send("Asd");
});


app.get('/book/:_id', async (req, res) => {

    try {
        const book = await Book.findById({_id: req.params._id});
        sendJsonResponse(res, book, 200);


    } catch (e) {
        sendJsonResponse(res, "error", 200);
    }
    res.send("Asd");
});

app.post('/book', async (req, res) => {
    var book = new Book({
        title: req.body.title,
        author: req.body.author,
        numberOfPage: req.body.numberOfPage,
        publisher: req.body.publisher

    });
    try {
        var save_book = await book.save();
        sendJsonResponse(res, save_book, 200);
    } catch (e) {
        sendJsonResponse(res, "error occur", 200);
    }

});

app.put('/book/:_id', async (req, res) => {

    try {
        const book = await Book.findOneAndUpdate({_id: req.params._id}, req.body);
        sendJsonResponse(res, book, 201);
    } catch (e) {
        sendJsonResponse(res, "error", 404);
    }


});


app.del('/book/:_id', async (req, res) => {
    try {
        const book = await Book.findOneAndRemove({_id: req.params._id});
        sendJsonResponse(res, null, 402);
        next();
    } catch (e) {
        sendJsonResponse(res, "error", 404);

    }

});


function sendJsonResponse(res, data, status) {
    res.status(status);
    res.send(data);
}

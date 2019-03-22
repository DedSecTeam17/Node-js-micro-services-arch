const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const Book = require('./models/book');
const  axios=require('axios');
require('dotenv').load();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({type: 'application/*+json'}));


app.listen(process.env.PORT, () => {
    mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true});
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


app.delete('/book/:_id', async (req, res) => {
    axios.get('http://localhost:6666/order/book/' + mongoose.Types.ObjectId(req.params._id)).then(async (response) => {
        console.log( response.data);

        // integrity
        if (response.data.length!==0) {
            console.log( "w");
            sendJsonResponse(res, {
                message: "integrity constraint violation this customer used by order service delete order first then delete the customer"
            }, 404);
        } else {

            sendJsonResponse(res,"", 200);
            // await deleteBook(req.params._id, res);
        }
    })
        .catch(async (err) => {
            //    no order found you can delete it
            // await deleteBook(req.params._id, res);
            sendJsonResponse(res,err, 200);

        });






});


async  function  deleteBook(id,res) {
    try {
        const book = await Book.findOneAndRemove({_id: id});
        sendJsonResponse(res, null, 402);

    } catch (e) {
        sendJsonResponse(res, "error", 404);

    }
}

function sendJsonResponse(res, data, status) {
    res.status(status);
    res.send(data);
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').load();

const Customer = require('./models/customer');


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({type: 'application/*+json'}));


app.listen(process.env.PORT, () => {
    mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true}).then(() => {
        console.log("connected to customer db")
    });
    console.log("Test");
});


app.get('/customers', async (req, res) => {
    try {
        const customers = await Customer.find({}).limit(10);
        sendJsonResponse(res, customers, 201);
    } catch (e) {
        sendJsonResponse(res, "Error occur", 404);

    }
});


app.get('/customers/:id', async (req, res) => {
    try {
        const customers = await Customer.findById({_id: req.params.id});
        sendJsonResponse(res, customers, 201);
    } catch (e) {
        sendJsonResponse(res, "Error occur", 404);

    }
});


app.delete('/customers/:id', async (req, res) => {
    axios.get('http://localhost:6666/order/customer/' + mongoose.Types.ObjectId(req.params.id)).then(async (response) => {

        console.log(response.data);
        // integrity
        if (response.data.length !== 0) {
            sendJsonResponse(res, {
                message: "integrity constraint violation this customer used by order service delete order first then delete the customer"
            }, 404);
        } else {
            await deleteCustomer(req.params.id, res);
        }
    })
        .catch(async (err) => {
            //    no order found you can delete it
            await deleteCustomer(req.params.id, res);

        });

});





async function deleteCustomer(id, res) {
    try {
        const customers = await Customer.findOneAndDelete({_id: id});
        sendJsonResponse(res, null, 402);
    } catch (e) {
        sendJsonResponse(res, "Error occur", 404);

    }
}

app.post('/customers', async (req, res) => {

    const customer = new Customer(
        {
            name: req.body.name,
            age: req.body.age,
            address: req.body.address
        }
    );

    try {
        const save_cstomer = await customer.save();
        sendJsonResponse(res, save_cstomer, 201);
    } catch (e) {
        sendJsonResponse(res, "Error occur", 404);
    }

});


function sendJsonResponse(res, data, status) {
    res.status(status);
    res.send(data);
}

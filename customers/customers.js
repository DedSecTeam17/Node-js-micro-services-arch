const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').load();

const  Customer=require('./models/customer');


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({type: 'application/*+json'}));


app.listen(process.env.PORT, () => {
    mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true}).then(()=>{
        console.log("connected to customer db")
    });
    console.log("Test");
});


app.get('/customers', async (req, res) => {
   try {
       const  customers=await  Customer.find({}).limit(10);
       sendJsonResponse(res,customers,201);
   }catch (e) {
       sendJsonResponse(res,"Error occur",404);

   }
});


app.get('/customers/:id', async (req, res) => {
    try {
        const  customers=await  Customer.findById({_id:req.params.id});
        sendJsonResponse(res,customers,201);
    }catch (e) {
        sendJsonResponse(res,"Error occur",404);

    }
});



app.delete('/customers/:id', async (req, res) => {
    try {
        const  customers=await  Customer.findOneAndDelete({_id:req.params.id});
        sendJsonResponse(res,null,402);
    }catch (e) {
        sendJsonResponse(res,"Error occur",404);

    }
});

app.post('/customers',async  (req,res)=>{

    const  customer=new Customer(
        {
            name : req.body.name,
            age: req.body.age,
            address:   req.body.address
        }
    );

    try {
        const  save_cstomer=await  customer.save();
        sendJsonResponse(res,save_cstomer,201);
    }catch (e) {
        sendJsonResponse(res,"Error occur",404);
    }

});





function sendJsonResponse(res, data, status) {
    res.status(status);
    res.send(data);
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').load();

const  Order=require('./models/order');


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({type: 'application/*+json'}));


app.listen(process.env.PORT, () => {
    mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true}).then(()=>{
        console.log("connected to orders db")
    });
});



app.get('/orders' , async  (req,res)=>{

    try {
        const  orders=await  Order.find({}).limit(10);
        sendJsonResponse(res,orders , 200);
    }catch (e) {
        sendJsonResponse(res,e.message , 404);
    }

});

app.get('/order/:id' ,async  (req,res)=>{
    try {
        const  order=await  Order.findById({_id: req.params.id});
        sendJsonResponse(res,order , 200);
    }catch (e) {
        sendJsonResponse(res,e.message , 404);
    }
});



app.post('/order' ,  async  (req,res)=>{

    const newOrder=new Order({
        customer_id : mongoose.Types.ObjectId(req.body.customer_id),
        book_id :   mongoose.Types.ObjectId(req.body.book_id),
        got_date : req.body.got_date,
        delivery_date : req.body.delivery_date,
    });

    try {

        const  savedOrder=await  newOrder.save();
        sendJsonResponse(res,savedOrder , 201);

    }catch (e) {
        sendJsonResponse(res,e.message, 201);
    }

});

app.put('/order/:id' , async  (req,res)=>{


    try {
        const  order=await  Order.findOneAndUpdate({_id:req.params.id},req.body);
        sendJsonResponse(res,"Updated Successfully" , 201);
    }catch (e) {
        sendJsonResponse(res,e.message , 404);
    }

});


app.delete('/order/:id' , async  (req,res)=>{
    try {
        const  order=await  Order.findOneAndRemove({_id:req.params.id});
        sendJsonResponse(res,null , 402);
    }catch (e) {
        sendJsonResponse(res,e.message , 404);
    }
});




function sendJsonResponse(res, data, status) {
    res.status(status);
    res.send(data);
}

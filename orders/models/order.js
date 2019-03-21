
const  mongoose=require('mongoose');


const  orderSchema= new mongoose.Schema({
    customer_id : {
        type :  mongoose.SchemaTypes.ObjectId ,
        required : true
    },
    book_id : {
        type :   mongoose.SchemaTypes.ObjectId ,
        required : true
    },
    got_date: {
        type :  Date ,
        required : true
    },
    delivery_date : {
        type :  Date ,
        required : true
    },
});


const  Order=mongoose.model('Order', orderSchema);



module.exports=Order;
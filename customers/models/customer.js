const  mongoose=require('mongoose');

const customer_schema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    address:{
        type:String,
        required:true
    }
});



const  Customer=mongoose.model("Customer",customer_schema);


module.exports=Customer;

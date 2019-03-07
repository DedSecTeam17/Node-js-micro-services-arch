const  mongoose=require('mongoose');

const book_schema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    numberOfPage:{
        type:String,
        required:false
    },
    publisher:{
        type:String,
        required:false
    }
});



const  Book=mongoose.model("Book",book_schema);


module.exports=Book;

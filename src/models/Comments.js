const mongoose = require('mongoose');

const CommentsSchema = new mongoose.Schema({
    email : {
        type: String,
        required : true,
    },
    comment :{
        type: String,
        required : true
    },
    isRead : {
        type : Boolean,
        default : false
    }
});

const CommentsModel = mongoose.model("comments" , CommentsSchema);
module.exports = CommentsModel;
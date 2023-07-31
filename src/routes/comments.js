const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const CommentsModel  = require('../models/Comments.js');

const router = express.Router();

router.post("/add-comment" , async (req , res) => {
    const { email , comment } = req.body;
    const newComment = new CommentsModel({
        email , comment
    });
    await newComment.save();
    return res.json({ status : true , message : "Comment shared successfully !!.."});
});

router.get("/get-comments" , async(req , res) => {
    const comments = await CommentsModel.find();
    return res.json(comments);
})

router.put("/:commentID" , async(req , res) => {
    try {
        const commentID = req.params.commentID;
        const post = await CommentsModel.findByIdAndUpdate(commentID, { isRead: true }, { new: true });
        res.status(200).json(post);
      } catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
      }
})

router.delete("/:commentID" , async(req , res) => {
    try {
        const commentID = req.params.commentID;
        const post = await CommentsModel.findByIdAndDelete({ _id : commentID});
        res.status(200).json(post);
      } catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
      }
})


router.get("/get-notifications" , async(req , res) => {
    const comments = await CommentsModel.find({isRead : false});
    return res.json(comments);
})


module.exports = router;
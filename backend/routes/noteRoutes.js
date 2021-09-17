const express = require('express');
const checkAuth = require('../middleware/check-auth');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Note = require('../models/noteModel');

const router = express.Router();

router.get('', checkAuth, catchAsync(async(req, res, next) => {
    const notes = await Note.find({ creator: req.userData.userId});

    if(!notes){
        return next(new AppError("Something went wrong"));
    }
    res.status(200).json({
        status: 'success',
        notes
    });
}));

router.get('/:id',checkAuth, catchAsync(async(req, res, next) => {
    const note = await Note.findById(req.params.id);

    if(!note) {
        return next(new AppError("No Note is found"), 404);
    }

    res.status(200).json({
        title: note.title,
        content: note.content,
        _id: note._id,
        date: note.date
    });
}));

router.post('', checkAuth, catchAsync(async(req, res, next) => {
    const createdNote = {
        title: req.body.title,
        content: req.body.content,
        date: Date.now(),
        creator: req.userData.userId
    }
    const note = await Note.create(createdNote);
    if(!note){
        return next(new(AppError("Unable to create this note"), 424));
    }
    
    res.status(201).json({
        status: 'success',
        noteId: note._id
    });
}));

router.put('/:id',checkAuth, catchAsync(async(req, res, next) => {
    const createdNote = {
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        date: Date.now(),
        creator: req.userData.userId
    }
    const note = await Note.updateOne({_id: req.params.id, creator: req.userData.userId }, createdNote , {
        new: true,
        runValidators: true
    });

    if(!note) {
        return next(new AppError("No Note is found", 404));
    }
    if(note.modifiedCount > 0){
        res.status(200).json({
            status: 'success',
            note
        });
    } else {
        return next(new AppError("Please Login to continue", 401));
    }
}));

router.delete('/:id', checkAuth,  catchAsync(async(req, res, next) => {
    
    const note = await Note.deleteOne({ _id: req.params.id, creator: req.userData.userId });
    if(!note) {
        return next(new AppError("No Note is found", 404));
    }
    if(note.deletedCount > 0){
        res.status(200).json({
            status: 'success',
            note: null
        });
    } else {
        return next(new AppError("Please login to continue", 401));
    }        
}));

module.exports = router;
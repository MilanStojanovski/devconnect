const express = require('express');
const router = express.Router();
const passport = require('passport');

// Load Validator
const ValidatePostInput = require('../../validation/post');
// Load models
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

// @route   GET api/posts
// @desc    Tests posts route
// @access  Public
router.get('/test', (req, res) => res.json({msg: "Posts works"}));

// @route   GET api/posts
// @desc    Get posts route
// @access  Public
router.get('/', (req, res) => {
    Post.find()
        .sort({date: -1})
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json(err));
});

// @route   GET api/posts/:id
// @desc    Get posts by ID route
// @access  Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(404).json(err));
});

// @route   POST api/posts
// @desc    Create posts route
// @access  Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const { errors, isValid } = ValidatePostInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });

    newPost.save()
        .then(post => res.json(post));
});

// @route   DELETE api/posts/:id
// @desc    Deletes posts by ID route
// @access  Private
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({user: req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    // Check for post owner
                    if (post.user.toString() !== req.user.id) {
                        return res.status(401).json({message: 'User not authorized'})
                    }

                    // Delete post
                    post.remove()
                        .then(() => res.json({success: true}))
                        .catch(err => res.status(404).json(err));
                })
        })
});

// @route   POST api/posts/like/:id
// @desc    Like posts by ID route
// @access  Private
router.post('/like/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                return res.status(400).json({message: 'User already liked this post'})
            }

            post.likes.unshift({user: req.user.id});

            post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json(err));
});

// @route   POST api/posts/unlike/:id
// @desc    Un-Like posts by ID route
// @access  Private
router.post('/unlike/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                return res.status(400).json({message: 'You have not yet liked this post'})
            }

            // Get remove index
            const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
            // Splice out of array
            post.likes.splice(removeIndex, 1);

            post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json(err));
});

// @route   POST api/posts/comment/:id
// @desc    Comment posts by ID route
// @access  Private
router.post('/comment/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    const { errors, isValid } = ValidatePostInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
        .then(post => {
            const newComment = {
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar,
                user: req.user.id
            };

            post.comments.unshift(newComment);

            post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json(err));
});

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Remove comment posts by ID route
// @access  Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
                return res.status(404).json({message: 'Comment does not exist'});
            }

            // Get remove index
            const removeIndex = post.comments.map(comment => comment._id.toString()).indexOf(req.params.comment_id);

            // Splice out of array
            post.comments.splice(removeIndex, 1);

            post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json(err));
});

module.exports = router;
const express = require('express')
const Blog = require('../schema/blog');
const multer = require('multer');
const router = express.Router();
const path=require('path');
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        console.log("in multer dest");
        let error = new Error("invalid mime type");
        if (isValid) {
            error = null;
        }
        console.log(__dirname);
        cb(error, path.join(__dirname,'../images'));
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        console.log(name);
        console.log("in multer file");
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
})
router.get('/', (req, res, next) => {
    Blog.find().then(documents => {
        res.status(200).json({
            message: "fetched blogs successfully",
            posts: documents
        });
    });

});
router.post('/', multer({
    storage: storage
}).single("image"), (req, res, next) => {
    console.log(req.body.image);
    const blog = new Blog({
        title: req.body.title,
        description: req.body.description
    });
    console.log("in post before saving");
    blog.save().then(createdPost => {
        res.status(201).json({
            message: "blog added successfully",
            postId: createdPost._id
        })
    }).catch(err => {
        res.status(404).json({
            message: err
        });

    });
});

router.route('/:id')
    .get((req, res) => {
        Blog.findById(req.params.id).then(post => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({
                    message: 'Post not found'
                });
            }
        });
    })
    .delete((req, res) => {
        Blog.deleteOne({
            _id: req.params.id
        }).then(result => {
            console.log(result);
            res.status(200).json({
                message: "post deleted"
            })
        })
    })
    .put((req, res) => {
        const blog = new Blog({
            _id: req.body.id,
            title: req.body.title,
            description: req.body.description
        });
        Blog.updateOne({
            _id: req.params.id
        }, blog).then(result => {
            console.log(result);
            res.status(200).json({
                message: "Update successful"
            });
        })
    });

module.exports = router;
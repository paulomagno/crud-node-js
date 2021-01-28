// Load Librares and Models
const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const slug = require('slug');

// Add Screen
exports.add = (req,res) => {
    res.render('postAdd');
};

// Add Post
exports.addAction = async (req,res) => {
    
    // cast string to array
    req.body.tags   = req.body.tags.split(',').map(t=>t.trim());
    req.body.author = req.user._id;
    
    const post = new Post(req.body);
    
    try {
        await post.save();
    } catch (error) {
        req.flash('error', 'Erro:' + error.message);
        res.redirect('/post/add');
        return;
    }

    req.flash('success','Post salvo com sucesso');
    res.redirect('/');
};

// Edit screen
exports.edit = async (req,res) => {
    const post = await Post.findOne({slug:req.params.slug});
    
    if(post) res.render('postEdit',{post});
    else     res.render('404');
};

// Edit Post
exports.editAction = async (req,res) => {
    
    // Add slug request body 
    req.body.slug = slug(req.body.title,{lower:true});

    const slugRegex = new RegExp(`^(${req.body.slug})((-[0-9]{1,}$)?)$`,'i');
    const postsWithSlug = await Post.find({slug:slugRegex});

    if(postsWithSlug.length > 0) {
        req.body.slug = `${req.body.slug}-${postsWithSlug.length + 1}`;
    }


    // cast string to array
    req.body.tags = req.body.tags.split(',').map(t=>t.trim());
    
    try {
        const post = await Post.findOneAndUpdate(
            { slug : req.params.slug},
            req.body,
            {
                new: true , // Return new item updated
                runValidators: true,
            }
        );
    } catch (error) {
        req.flash('error', 'Erro:' + error.message);
        res.redirect(`/post/${req.params.slug}/edit`);
        return;
    }

    req.flash('success','Post atualizado com sucesso');
    res.redirect('/');
    
};

exports.view = async (req,res) => {
    const post = await Post.findOne({slug:req.params.slug});
    
    if(post) res.render('view',{post});
    else     res.render('404');
};
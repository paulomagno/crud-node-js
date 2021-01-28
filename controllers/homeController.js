const mongoose = require('mongoose');
const Post = mongoose.model('Post');

// default screen
exports.index = async (req,res) => {
    
    let data = {
        pageTitle : 'HOME',
        listPosts : [],
        tags:[],
        tag:'',
       
    };
    
    data.tag   = req.query.t;
    const postFilter = (typeof data.tag != 'undefined') ? {tags:data.tag} : {};
    
    const tagsPromise  =  Post.getTagsList();
    //const postsPromise =  Post.find(postFilter);
    const postsPromise =  Post.findAuthorPost(postFilter);
    const [tags,posts] = await Promise.all([tagsPromise,postsPromise]);

    
    for (let i in tags) {
       
        if(tags[i]._id == data.tag) {
           tags[i].class = "selected";
        }
        
    }

    data.tags  = tags;
    data.listPosts = posts;
    
    res.render('home',data);
}




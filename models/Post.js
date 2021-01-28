const mongoose = require('mongoose');
const slug = require('slug');

mongoose.Promise = global.Promise;

const ObjectID = mongoose.Schema.Types.ObjectId;

// Schema - Definition
const postSchema = new mongoose.Schema({
    photo : String,
    title:{
        type: String,
        trim: true,
        required: 'O Post precisa de um titulo'
    },
    slug:String,
    body:{
        type: String,
        trim: true
    },
    tags:[String],
    //author:  ObjectID
    author : {
        type: ObjectID,
        ref: 'User'
    }
});

// Schema - Settings Slug
postSchema.pre('save',async function(next){
    
    // slug is modified, generate a new slug
    if(this.isModified('title')) {
        this.slug = slug(this.title,{lower:true});

        const slugRegex = new RegExp(`^(${this.slug})((-[0-9]{1,}$)?)$`,'i');
        const postsWithSlug = await this.constructor.find({slug:slugRegex});

        if(postsWithSlug.length > 0) {
            this.slug = `${this.slug}-${postsWithSlug.length + 1}`;
        }
    }

    next();
});

postSchema.statics.getTagsList = function(){
    return this.aggregate([
        { $unwind: '$tags' },
        { $group: {_id:'$tags', count:{$sum:1} }},
        { $sort: {count:-1}}
    ]);
};

postSchema.statics.findAuthorPost = function (filters = {}) {
    /*
    return this.aggregate([
          {$match:filters},
          {$lookup: {
              from : 'users',
              let: { 'author' : '$author'},
              pipeline : [
                   {$match : { $expr : {$eq:['$$author','$_id']}}} ,
                   {$limit: 1}
              ] ,
              as : 'author'
          }},
          { $addFields : {
                'author' : {$arrayElemAt:['$author',0]}
          } }      
    ]);

    */

    /*
    return this.aggregate([
        {$match:filters},
        {
            $lookup:
            {
              from: "users",
              localField: "author",
              foreignField: "_id",
              as: "author",
            },
        },
        { $unwind:"$author" }
    ]);
    */

    return this.find(filters).populate('author');
}


module.exports = mongoose.model('Post',postSchema);
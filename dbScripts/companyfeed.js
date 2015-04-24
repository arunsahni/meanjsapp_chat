/**
 * Created by sumasoft on 4/21/15.
 */


var mongoose = require('mongoose'),
    fs = require('fs'),
    Schema = mongoose.Schema,
    async = require("async"),
    exports = module.exports = {};

if (process.env.NODE_ENV == 'production') {
    mongoose.connect('mongodb://suma:sumapass@ds061671.mongolab.com:61671/meanjsapp-dev')
} else {
    mongoose.connect('mongodb://localhost/meanjsapp-dev');
}

var CompanyfeedSchema = new Schema({
        name: {
            type: String,
            default: '',
            required: 'Please fill Companyfeed name',
            trim: true
        },
        created: {
            type: Date,
            default: Date.now
        },
        user: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        likers:[],
        comment:[{
            user_id : {	type: String },
            comment: { type: String },
            user_name:{ type: String },
            commenteduser: {
                type: Schema.ObjectId,
                ref: 'User'
            },
            commentLiker: []
        }]
}),

companyfeed = mongoose.model('companyfeed', CompanyfeedSchema);

var db =mongoose.connection;

db.on('error',console.error.bind(console,'connection error...'));
db.once('open',function callback() {
    companyfeed.find({}, {}).sort('-created').exec(function (err, companyfeeds) {
        if (err) {
            return err;
        } else {
            //for commented Users
            async.each(companyfeeds, function (companyfeedItem, callback) {
                async.each(companyfeedItem.comment, function (comment, callback1) {
                    var commentObj = {
                        commentLiker: comment.commentLiker,
                        comment: comment.comment,
                        commenteduser: comment.user_id
                    };
                    companyfeed.findOneAndUpdate(({_id: companyfeedItem._id}, {'comment._id': comment._id}), {$pull: {'comment': {_id: comment._id}}}).exec(function (err, data) {
                        if (err) console.log("Error in cooment object pop");
                        else {
                            console.log("comment obj pop",data);
                            companyfeed.findOneAndUpdate(({_id:companyfeedItem._id }), {$push: {'comment': commentObj}}).exec(function (err, data) {
                                if (err) console.log("Error in cooment object push");
                                else {
                                    console.log('comment object push');
                                    async.each(commentObj.commentLiker, function (commentLiker) {
                                        console.log("commentObject",commentObj.commentLiker)
                                        companyfeed.update(({_id: mongoose.Types.ObjectId(companyfeedItem._id)}, {'comment.commenteduser': mongoose.Types.ObjectId(commentObj.commenteduser)}), {$pull: {'comment.$.commentLiker': {_id: mongoose.Types.ObjectId(commentLiker._id)}}}).exec(function (err, data) {
                                            if (err) console.log("ERROR in liker pop", err);
                                            else {
                                                console.log("Pop succefull", data);
                                                companyfeed.findOneAndUpdate(({_id: mongoose.Types.ObjectId(companyfeedItem._id)},{'comment.commenteduser': mongoose.Types.ObjectId(commentObj.commenteduser)}), {$push: {'comment.$.commentLiker': mongoose.Types.ObjectId(commentLiker.user_id)}}).exec(function (err, data) {
                                                    if (err) console.log("Error in push",err);
                                                    else {
                                                        console.log("liker push", data);
                                                    }
                                                });
                                            }
                                        });
                                    }, callback1 )
                                };
                                //callback();
                                // };
                            });
                            //callback();
                        }
                     });
                    /*async.each(companyfeedItem.likers,function(liker,callback3) {
                     var likerobj = mongoose.Types.ObjectId(liker.user_id);
                     companyfeed.update({_id: companyfeedItem._id}, {$pull: {likers: {_id: liker._id}}}).exec(function (err, data) {
                     if (err) console.log("ERROR in liker pop");
                     companyfeed.findOneAndUpdate(({_id: companyfeeds[i]._id}), {$push: {'likers': likerobj}}).exec(function (err, data) {
                     if (err) console.log("Error in liker push");
                     else {
                     callback3();
                     }
                     });
                     });
                     });*/

                });
            });
        }
    });
});

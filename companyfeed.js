/**
 * Created by sumasoft on 4/21/15.
 */
 /*var db = db.getSiblingDB('meanjsapp-dev');
 main()


 function main(){
 /!*db.collection.find({your_query: "parameter"}).forEach(function(obj) {
 db.collection.update({ "_id" : obj._id}, {$set:{  title:"Tales",deadline:"XXXXX",description:"XXXXX",price:"XXXXX",creadBy:"XXXXX",creatdUserName:"XXXXX",...});

 });*!/
 /!*  for (var i = 1; i <= 1000; i++) {
 db.projects.insert({
 "title" : "Project"+i ,
 "deadline": ISODate("2015-06-23T18:30:00.000Z"),
 "discription":"Testing"+i,
 "price":"10000",
 "createdBy" : "54fe8efbce11dd62044e6311",
 "createdUserName" : "arun sahni",
 "status" : "Open",
 "created" : ISODate("2015-03-20T07:22:11.931Z"
 )});
 }*!/
 db.companyfeeds.find({},function(err,data){
 if(err) return console.log(err);
 else
 {
 /!*  for(var i = 0,len= data.length();i < len ;i++){

 }*!/
 console.log(data);
 }
 })
 }*/


var mongoose = require('mongoose'),
    fs = require('fs'),
    Schema = mongoose.Schema,
    exports = module.exports = {};

if (process.env.NODE_ENV == 'production') {
    mongoose.connect('mongodb://suma:sumapass@ds061671.mongolab.com:61671/meanjsapp-dev')
} else {
    mongoose.connect('mongodb://localhost/meanjsapp-dev');
}

/*
 var companyfeedOldSchema = new mongoose.Schema({

 }),
 companyfeedOld = mongoose.model('companyfeedOld', companyfeedOldSchema);
 */

var CompanyfeedSchema = new Schema({
   /* name: {
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
    likers:[{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    comment:[{
        commenteduser: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        comment: { type: String },
        commentLiker: [{
            type: Schema.ObjectId,
            ref: 'User'
        }]
    }]*/
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
        likers:[{
            user_id : {	type: String },
            user_name:{ type: String }
        }],
        comment:[{
            user_id : {	type: String },
            comment: { type: String },
            user_name:{ type: String },
            commenteduser: {
                type: Schema.ObjectId,
                ref: 'User'
            },
            commentLiker: [{
                user_id : { type: String },
                user_name: { type: String }
            }]
        }]
}),

companyfeed = mongoose.model('companyfeed', CompanyfeedSchema);

var db =mongoose.connection;

db.on('error',console.error.bind(console,'connection error...'));
/*db.once('open',function callback(){
    companyfeed.find({},{},function(err, data) {
        if (err) {
            return err;
        } else {
            console.log(data);
        }
    });
});*/
db.once('open',function callback(){
    companyfeed.find({},{
    }).sort('-created').exec(function(err, userList) {
        if (err) {
            return err;
        } else {
            //console.log(userList[0].comment[0].user_id);
            for(var i =0,len=userList.length; i < len ; i++){
                for(var j=0,len1 = userList[i].comment.length ; j < len1 ; j++){
                    var commentObj = {
                        commentLiker : userList[i].comment[j].commentLiker,
                        comment : userList[i].comment[j].comment,
                        user_name : userList[i].comment[j].user_name,
                        user_id : userList[i].comment[j].user_id,
                        commenteduser : userList[i].comment[j].user_id
                    };
                    companyfeed.findOneAndUpdate(({_id: userList[i]._id},{'comment._id' : userList[i].comment[j]._id}), {$pop : { 'comment' :commentObj}}).exec(function (err, data) {
                        if(err) console.log("Error");
                        else{
                            console.log(data);
                        }
                    });
                    companyfeed.findOneAndUpdate(({_id: userList[i]._id}), {$push : { 'comment' :commentObj}}).exec(function (err, data) {
                       if(err) console.log("Error");
                        else{
                           console.log(data);
                       }
                    });
                }
            }
        }
    });
});

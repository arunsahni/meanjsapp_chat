/**
 * Created by arunsahni on 4/14/15.
 */
var mongoose = require('mongoose'),
    fs = require('fs'),
    nodemailer = require('nodemailer'),
    exports = module.exports = {};

    exports.getHtml = function(){
        var templatePath = "./app/views/templates/emailTemplate.html";
        var hello = fs.readFileSync(templatePath).toString();
        return hello;
    };

    if(process.env.NODE_ENV == 'production'){
        mongoose.connect('mongodb://suma:sumapass@ds061671.mongolab.com:61671/meanjsapp-dev')
    } else {
        mongoose.connect('mongodb://localhost/meanjsapp-dev');
    }

    var userSchema = new mongoose.Schema({
            firstName: {
                type: String,
                trim: true,
                default: ''
            },
            email: {
                type: String,
                trim: true,
                default: ''
            }
        }),
        User = mongoose.model('User', userSchema);

    var db =mongoose.connection;
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'sumacrm025@gmail.com',
            pass: 'sumasoft123'
        }
    });

    db.on('error',console.error.bind(console,'connection error...'));
    db.once('open',function callback(){
        User.find({},{
            email: 1,
            firstName: 1
        }).sort('-created').exec(function(err, userList) {
            if (err) {
                return err;
            } else {
                for(var i = 0; i< userList.length; i++){
                    var data = exports.getHtml();
                    var mailOptions = {
                        from: 'sumacrm025@gmail.com',
                        to:  userList[i].email,
                        subject: 'Project Deployment Mail',
                        html: data
                    };
                    transporter.sendMail(mailOptions, function(error, info){
                        if(error) {
                            console.log(error);
                        } else {
                            console.log('Message sent' + info.response);
                        }
                   });
                }
            }
        });
    });

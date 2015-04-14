/**
 * Created by arunsahni on 4/14/15.
 */

var mongoose = require('mongoose'),
    nodemailer = require('nodemailer');
    //emailHtml = require('./app/views/templates/emailTemplate.html');
    mongoose.connect('mongodb://localhost/meanjsapp-dev');

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
        console.log("Mongodb is connected");
        User.find({},{
            email: 1,
            firstName: 1
        }).sort('-created').exec(function(err, userList) {
            if (err) {
                return err;
            } else {
                for(var i = 0; i< userList.length; i++){

                    var mailOptions = {
                        from: 'sumacrm025@gmail.com',
                        to:  userList[i].email,
                        subject: 'Project Deployment Mail',
                        html: '<b> Hey</b> &nbsp;&nbsp;' + userList[i].firstName +
                        '<p>This is a Deployment mail.</p>' +
                        '<br>' +
                        '<br>' +
                        '<p>The Suma-crm Support Team</p>' +
                        '<img src="https://s3.amazonaws.com/sumacrm/avatars/55264948b403980b009928a4" height="50" width="50">'
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

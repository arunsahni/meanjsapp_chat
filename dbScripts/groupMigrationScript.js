var mongoose = require('mongoose'),
    db = mongoose.connection;

if(process.env.NODE_ENV === 'production') {
    mongoose.connect('mongodb://suma:sumapass@ds061671.mongolab.com:61671/meanjsapp-dev')
} else {
    mongoose.connect('mongodb://localhost/meanjsapp-dev');
}

db.on('error', console.error.bind(console,'connection error...'));
db.once('open', function callback() {
    var Group = mongoose.model('Group', new mongoose.Schema({
            name: {
                type: String,
                trim: true,
                default: ''
            }
        }));
    Group.findOne({name: 'SumaSoft'}).exec(function (err, group) {
        var updateDocuments = ['User', 'Article', 'Companyfeed'];
        updateDocuments.forEach(function (entity) {
            var entityName = mongoose.model(entity, new mongoose.Schema({
                group: {
                    type: mongoose.Schema.ObjectId,
                    ref: 'Group'
                }
            }));
            entityName.update({}, {$set: {group: mongoose.Types.ObjectId(group._id)}}, {multi : true}, function (err, data) {
                console.log(entity + ' ----> updated');
            });
        });
    });
});

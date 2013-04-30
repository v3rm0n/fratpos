var mongoose = require('mongoose');
Schema = mongoose.Schema;
var async = require('async');
var ProductSchema = require('./products');

var TransactionSchema = new Schema({
    time: Date,
    user: {type: Schema.ObjectId, ref: 'User'},
    type: String,
    products : [ProductSchema],
    invalid: Boolean
},
{
    toJSON: {virtuals: true}
});

TransactionSchema.virtual('formattedTime').get(function(){
    var time = this.time;
    var hours = time.getHours() > 9 ? time.getHours() : '0'+time.getHours();
    var minutes = time.getMinutes() > 9 ? time.getMinutes() : '0'+time.getMinutes();
    var date = time.getDate() > 9 ? time.getDate() : '0'+time.getDate();
    var month = time.getMonth()+1 > 9 ? time.getMonth()+1 : '0'+(time.getMonth()+1);
    return hours+':'+minutes+' '+date+'.'+month+'.'+time.getFullYear();
});

TransactionSchema.virtual('sum').get(function(){
    var sum = 0;
    for(var i = 0;i< this.products.length;i++){
        sum += Number(this.products[i].price) * Number(this.products[i].quantity);
    }
    return sum;
});

TransactionSchema.method('invalidate', function(cb){
    var transaction = this;
    console.log('Marking transaction '+transaction.id+' invalid');
    this.update({invalid: true}, function(err){
        if(err){cb(err);return;}
        async.series([
            async.apply(incrementBalance, transaction),
            async.apply(updateProductQuantities, transaction)
        ], cb);
    });
});

TransactionSchema.static('findAll', function(query, cb){
    if(!cb){
        cb = query;
        query = {};
    }
    this.find(query).populate('user').exec(cb);
});

var incrementBalance = function(transaction, cb) {
    console.log('Updating user balance');
    var Paytype = mongoose.model('Paytype');
    Paytype.findByName(transaction.type, function(err, paytype){
        if(err){cb(err);return;}
        if(paytype.affectsBalance){
            users.incrementBalance(transaction.user._id, transaction.sum, cb);
        }
        else{
            cb();
        }
    });
}

var updateProductQuantities = function(transaction, cb) {
    console.log('Updating product quantities');
    var Product = mongoose.model('Product');
    async.each(transaction.products, Product.incrementQuantity.bind(Product), cb);
}

module.exports = TransactionSchema;

mongoose.model('Transaction', TransactionSchema);
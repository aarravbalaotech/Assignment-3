let mongoose = require('mongoose')

// Expense model following the book template pattern
let expenseModel = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: String,
    amount: Number,
    category: String,
    date: {
        type: Date,
        default: Date.now
    },
    receiptUrl: String,
    created:
    {
        type:Date,
        default:Date.now
    }
},
{
    collection:"expense"
}
);

module.exports = mongoose.model('Expense',expenseModel);

let mongoose = require('mongoose')

// Budget model following the book template pattern
let budgetModel = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: String,
    category: String,
    amount: Number,
    period: {
        type: String,
        enum: ['monthly', 'weekly', 'one-time'],
        default: 'monthly'
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    created:
    {
        type:Date,
        default:Date.now
    }
},
{
    collection:"budget"
}
);

module.exports = mongoose.model('Budget',budgetModel);

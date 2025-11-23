let mongoose = require('mongoose')

// Goal model following the book template pattern
let goalModel = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: String,
    targetAmount: Number,
    currentAmount: {
        type: Number,
        default: 0
    },
    deadline: Date,
    completed: {
        type: Boolean,
        default: false
    },
    created:
    {
        type:Date,
        default:Date.now
    }
},
{
    collection:"goal"
}
);

module.exports = mongoose.model('Goal',goalModel);

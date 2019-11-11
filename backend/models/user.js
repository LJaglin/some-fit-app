const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdMeals: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Meal'
        }
    ]
});

module.exports = mongoose.model('User', userSchema);
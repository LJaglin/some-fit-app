const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mealSchema = new Schema({
    description: {
        type: String,
        require: true
    },
    calorie : {
        type: Number,
        required: true
    },
    protein : {
        type: Number,
        required: true
    },
    fat : {
        type: Number,
        required: true
    },
    carb : {
        type: Number,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Meal', mealSchema);
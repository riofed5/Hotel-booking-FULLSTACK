const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    pets: {
        type: Boolean,
        required: true,
    },
    breakfast: {
        type: Boolean,
        required: true,
    },
    featured: {
        type: Boolean,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    extras: [
        {
            type: String,
            required: true,
        }
    ],
    images: [
        {
            type: Object,
            required: true,
        }
    ],
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    bookedEvents: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Booking'
        }
    ],
});

module.exports = mongoose.model('Event', eventSchema);


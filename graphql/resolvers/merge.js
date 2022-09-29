const DataLoader = require('dataloader');

const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');
const {dateToString} = require('../../helpers/date')

/**
 * Users loader
 */

const userLoader = new DataLoader(userIds => {
    return User.find({_id: {$in: userIds}});
});

const user = async userId => {
    try {
        const userData = await userLoader.load(userId.toString());
        return {
            ...userData._doc,
            _id: userData.id,
            createdEvents: () => eventLoader.loadMany(userData._doc.createdEvents)
        }

    }
    catch (err) {
        throw err;
    }
}

/**
 * Events loader
 */

const eventLoader = new DataLoader(eventIds => {
    return events(eventIds);
});

const events = async eventIDs => {
    try {
        const events = await Event.find({_id: {$in: eventIDs}})
        return events.map(event => {
            return transformEvent(event);
        })
    }
    catch (err) {
        throw err
    }
}

const singleEvent = async (eventId) => {
    try {
        const event = await eventLoader.load(eventId.toString());
        return event;
    } catch (err) {
        throw err;
    }
}


/**
 * Bookings loader
 */
const bookingLoader = new DataLoader(bookingIDs => {
    return bookings(bookingIDs);
});

const bookings = async bookingIDs => {
    try {
        const bookings = await Booking.find({_id: {$in: bookingIDs}})
        return bookings.map(booking => {
            return transformBooking(booking);
        })
    }
    catch (err) {
        throw err
    }
}

/**
 * Utility of tranform datas
 */

const transformEvent = event => {
    return {
        ...event._doc,
        _id: event.id,
        creator: user.bind(this, event.creator),
        bookedEvents: () => bookingLoader.loadMany(event.bookedEvents)
    }
}

const transformBooking = booking => {
    return {
        ...booking._doc,
        _id: booking.id,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        startDay: dateToString(booking._doc.startDay),
        endDay: dateToString(booking._doc.endDay),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    }
}

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
exports.loaders = {
    userLoader,
    eventLoader,
    bookingLoader
}
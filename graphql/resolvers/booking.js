const Booking = require('../../models/booking');
const Event = require('../../models/event');
const User = require('../../models/user');
const {transformBooking, transformEvent, loaders} = require('./merge');

module.exports = {
    bookings: async (req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!')
        }
        try {
            const bookings = await Booking.find({user: req.userId});
            return bookings.map(booking => {
                return transformBooking(booking)
            })
        } catch (err) {
            throw err
        }
    },
    bookEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!')
        }
        try {
            const fetchedEvent = await Event.findOne({_id: args.eventInfo._id})
            
            const booking = new Booking({
                user: req.userId,
                event: fetchedEvent,
                startDay: args.eventInfo.startDay,
                endDay: args.eventInfo.endDay,
            })
            const result = await booking.save();

            // const creator = await User.findById(req.userId);
            const creator = await loaders.userLoader.load(req.userId.toString())

            if (!creator) {
                throw new Error("User not found")
            }
            /**
             * User saves this bookingEvent
             */
            creator.bookingEvents.push(booking);
            await creator.save();

            /**
             * Event saves this bookedEvent
             */

            await fetchedEvent.bookedEvents.push(booking);
            await fetchedEvent.save();

            return transformBooking(result)
        } catch (err) {
            throw err
        }
    },
    cancelBooking: async (args, req) => {
        // if (!req.isAuth) {
        //     throw new Error('Unauthenticated!')
        // }
        try {
            const selectedBooking = await Booking.findById(args.bookingId);
            const selectedEvent = await Event.findOne({_id: selectedBooking.event})

            const event = transformEvent(selectedBooking.event)
            await Booking.deleteOne({_id: args.bookingId})

            const creator = await User.findById("5edf8bd6660ba0b7f065e1e5");
            if (!creator) {
                throw new Error("User not found")
            }

            /**
             * User deletes this bookedEvent
             */

            // 1. find the booking index in User
            const bookingIndex = creator.bookingEvents.findIndex(el => el == args.bookingId);

            // 2. delelte by selected index
            creator.bookingEvents.splice(bookingIndex, 1)
            await creator.save();

            /**
             * Event deletes this bookedEvent
             */

            // 1. find the booking index in Event
            const bookedIndex = selectedEvent.bookedEvents.findIndex(el => el == args.bookingId);

            // // 2. delelte by selected index
            selectedEvent.bookedEvents.splice(bookedIndex, 1);
            await selectedEvent.save();

            return event;

        } catch (err) {
            throw err
        }
    }
}
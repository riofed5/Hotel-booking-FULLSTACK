const Booking = require('../../models/booking');
const Event = require('../../models/event');
const User = require('../../models/user');
const { transformBooking, transformEvent} = require('./merge');

module.exports= {
    bookings: async (req) => {
        if(!req.isAuth){
            throw new Error('Unauthenticated!')
        }
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking)
            })
        } catch (err) {
            throw err
        }
    },
    bookEvent: async (args, req) => {
        if(!req.isAuth){
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
            const creator = await User.findById(req.userId);
            
            if (!creator) {
                throw new Error("User not found")
            }
            /**
             * User save bookingEvent
             */
            creator.bookingEvents.push(booking);
            await creator.save();
            
            // /**
            //  * Event save bookedEvent
            //  */
            fetchedEvent.bookedEvents.push(booking);
            await fetchedEvent.save();

            return transformBooking(result)
        } catch (err) {
            throw err
        }
    },
    cancelBooking: async (args, req) => {
        if(!req.isAuth){
            throw new Error('Unauthenticated!')
        }
        try {
            const selectedBooking = await Booking.findById(args.bookingId).populate('event');
            const event = transformEvent(selectedBooking.event)
            await Booking.deleteOne({_id: args.bookingId})
            return event;

        } catch (err) {
            throw err
        }
    }
}
const Event = require('../../models/event');
const User = require('../../models/user');
const {transformEvent} = require('./merge');

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return transformEvent(event);
            })
        }
        catch (err) {
            console.log("rootvalue events get err: ", err);
            throw err
        }
    },
    createEvent: async (args, req) => {
        // if (!req.isAuth) {
        //     throw new Error('Unauthenticated!')
        // }
        const pendingEvent = new Event({
            name: args.eventInput.name,
            slug: args.eventInput.slug,
            type: args.eventInput.type,
            price: args.eventInput.price,
            size: args.eventInput.size,
            capacity: args.eventInput.capacity,
            pets: args.eventInput.pets,
            breakfast: args.eventInput.breakfast,
            featured: args.eventInput.featured,
            description: args.eventInput.description,
            extras: args.eventInput.extras,
            images: args.eventInput.images,
            creator: "5edf8a5c675f5cb7aee026cd"
        })
        try {
            console.log("pending Event: ", pendingEvent.images[0]);
            let tempResult;
            const result = await pendingEvent.save()
            tempResult = transformEvent(result);
            const creator = await User.findById("5edf8a5c675f5cb7aee026cd")
            if (!creator) {
                throw new Error("User not found")
            }
            creator.createdEvents.push(pendingEvent)
            await creator.save();
            return tempResult;

        }
        catch (err) {
            console.log("rootValue in server.js err: ", err);
            throw err
        };
    },
}
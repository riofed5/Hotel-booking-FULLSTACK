const Event = require("../../models/event");
const User = require("../../models/user");
const { transformEvent } = require("./merge");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return transformEvent(event);
      });
    } catch (err) {
      console.log("rootvalue events get err: ", err);
      throw new Error(err);
    }
  },
  createEvent: async (args, req) => {
    // TODO: Allow only admin user to add new event
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
      creator: "63358dafc4cfae283337bdbb",
    });
    try {
      let tempResult;
      const result = await pendingEvent.save();
      tempResult = transformEvent(result);
      const creator = await User.findById("63358dafc4cfae283337bdbb");
      if (!creator) {
        throw new Error("User not found");
      }
      creator.createdEvents.push(pendingEvent);
      await creator.save();
      return tempResult;
    } catch (err) {
      console.log("rootValue in server.js err: ", err);
      throw new Error(err);
    }
  },
};

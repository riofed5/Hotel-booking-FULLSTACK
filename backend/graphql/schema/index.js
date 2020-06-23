const {buildSchema} = require('graphql')


module.exports = buildSchema(`
    type Booking{
        _id : ID!
        event: Event!
        user: User!
        startDay: String!
        endDay: String!
        createdAt: String!
        updatedAt: String!
    }

    type File{
        url: String!
    }

    type Field{
        file : File!
    }

    type Image{
        fields: Field!
    }

    type Event{
        _id: ID!
        name: String!
        slug: String!
        type: String!
        price: Int!
        size: Int!
        capacity: Int!
        pets: Boolean!
        breakfast: Boolean!
        featured: Boolean!
        description: String!
        extras: [String!]
        images: [Image!]
        creator: User!
        bookedEvents: [Booking!]
    }

    type User{
        _id : ID!
        email: String!
        password: String
        createdEvents: [Event!]
        bookingEvents: [Booking!]
    }

    type AuthData{
        userId: ID!
        token: String!
        tokenExpiration: Int!
    }

    input FileInput{
        url: String!
    }

    input FieldInput{
        file : FileInput!
    }

    input ImageInput{
        fields: FieldInput!
    }
    
    input EventInput{
        name: String!
        slug: String!
        type: String!
        price: Int!
        size: Int!
        capacity: Int!
        pets: Boolean!
        breakfast: Boolean!
        featured: Boolean!
        description: String!
        extras: [String!]
        images: [ImageInput!]
    }

    input UserInput{
        email: String!
        password: String
    }
    
    input BookingInput{
        _id: ID!
        startDay: String!
        endDay: String!
    }

    type RootQuery{
        events: [Event!]!
        bookings: [Booking!]!
        login(email: String!, password: String!): AuthData
    }

    type RootMutation{
        createEvent(eventInput: EventInput ): Event
        createUser(userInput: UserInput ): User
        bookEvent(eventInfo: BookingInput): Booking!
        cancelBooking(bookingId: ID!): Event!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)


import React from 'react'
import Booking from './Booking';

const BookingList = ({bookings, cancelBooking}) => {

    return (
        <section className=" bookingslist">
                <div className="bookingslist-center" >
                    {
                        bookings.length > 1 && bookings.map(booking => {
                            return (
                                <Booking key={booking._id} booking={booking} cancelBooking={cancelBooking} />
                            )
                        })
                    }
                    {
                        bookings.length === 1 &&
                        (
                            <Booking key={bookings[0]._id} booking = {bookings[0]} cancelBooking={cancelBooking} />
                        )
                    }
                </div>
        </section>
    )
}

export default BookingList;
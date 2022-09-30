import React from 'react'

const Booking = ({booking, cancelBooking}) => {
    const {_id, startDay, endDay} = booking;
    const {name, slug} = booking.event;

    const onViewDetail= ()=>{
        window.location.replace(`/rooms/${slug}`)
    }
    return (
        <article className="single-booking">
            <img src={booking.event.images} alt={name} />
            <div key={_id} className="single-booking-details">
                <div className="single-booking-info" >
                    <p>name: {name}</p>
                    <p>from: {startDay}</p>
                    <p>to: {endDay}</p>
                </div>
                <div className="single-booking-control">
                    <button className="btn" onClick={() => cancelBooking(_id)} style={{background:"#f7f7f7"}}>Cancel</button>
                    <button className="btn" onClick={() => onViewDetail() } > view detail</button>
                </div>
            </div>
        </article>
    )
}

export default Booking;

// to={`rooms/${slug}`} 
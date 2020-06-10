import React, {Component} from 'react'
import {RoomContext} from '../context';
import {FaRegObjectUngroup} from 'react-icons/fa';


export default class Bookings extends Component {

    state ={
        bookings: [],
    }
    static contextType = RoomContext;

    getBookings = () => {
        const requestBody = {
            query: `
                query{
                    bookings{
                        _id
                        event{
                            name
                        }
                        startDay
                        endDay
                    }
                }
              `
        };

        fetch('http://localhost:8000/graphql', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + this.context.token
                }
            })
                .then(res => {
                    if (res.status !== 200 && res.status !== 201) {
                        throw new Error('Failed!');
                    }
                    return res.json();
                })
                .then(resData => {
                    const items= resData.data.bookings;
                    this.setState({bookings: items});
                })
                .catch(err => {
                    console.log("error in bookings: ", err)
                });

    }

    componentDidMount(){
        this.getBookings();
    }
    
    cancelBooking = (bookingId)=>{
        const requestBody = {
            query: `
                mutation{
                    cancelBooking(bookingId:"${bookingId}"){
                        name
                    }
                }
            `
        };

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.context.token
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            console.log(resData);
            window.location.reload();
        })
        .catch(err => {
            console.log(err);
        });
    }

    render() {
        const {bookings} = this.state;
        return (
            <section className=" bookingslist">
                <div className=" bookinglist-center" >
                    {
                        bookings.length > 1 && bookings.map(booking => {
                            return (
                                <div key={booking._id} style={{border: "1px black solid"}}>
                                    <div >
                                        <p>name : {booking.event.name}</p>
                                        <p>startDay : {new Date(booking.startDay).toDateString()}</p>
                                        <p>endDay : {new Date(booking.endDay).toDateString()}</p>
                                    </div>
                                    <div>
                                        <button onClick={()=> this.cancelBooking(booking._id)}>Cancel booking</button>
                                    </div>
                                </div>
                            )
                        })
                    }
                    {
                        bookings.length === 1 &&
                        (
                            <div key={bookings[0]._id} style={{border: "1px black solid"}}>
                                <div >
                                    <p>name : {bookings[0].event.name}</p>
                                    <p>startDay : {new Date(bookings[0].startDay).toDateString()}</p>
                                    <p>endDay : {new Date(bookings[0].endDay).toDateString()}</p>
                                </div>
                                <div>
                                    <button onClick={()=> this.cancelBooking(bookings[0]._id)}>Cancel booking</button>
                                </div>
                            </div>

                        )
                    }
                </div>
            </section>
        )
    }
}


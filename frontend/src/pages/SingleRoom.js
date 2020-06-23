import React, {Component} from 'react'
import defaultBcg from '../images/room-1.jpeg';
import Banner from '../components/Banner';
import {Link} from 'react-router-dom';
import {RoomContext} from '../context';
import StyledHero from '../components/StyledHero';
import FormBooking from '../components/FormBooking';
import DaySelection from '../components/DaySelection';

export default class SingleRoom extends Component {
    static contextType = RoomContext;

    constructor(props) {
        super(props);
        this.state = {
            slug: this.props.match.params.slug,
            defaultBcg,
            isModaled: false,
            currentYear: parseInt(new Date().getFullYear()),
            currentMonth: parseInt(new Date().getMonth()),
            startingDate: null,
            endingDate: null,
        }
        this.nameElRef = React.createRef();
        this.phoneElRef = React.createRef();
    }

    modalCancelHandler = () => {
        this.setState({isModaled: false});
    };

    validationFormBooking= (name, phoneNumber) =>{
        if(name !== '' && phoneNumber !== '' && phoneNumber.length > 6){
            return true;
        }
        return false;
    }

    handleDaySelection = (dayStart, dayEnd) => {
        this.setState({startingDate: dayStart, endingDate: dayEnd});
    }

    startCreateEventHandler = () => {
        this.setState({isModaled: true});
    };

    modalConfirmHandler = () => {
        const token = this.context.token;
        const postId = this.context.getRoom(this.state.slug)._id; 

        if (this.state.startingDate
            && this.state.endingDate
            && postId && this.validationFormBooking(this.nameElRef.current.value, this.phoneElRef.current.value)
            && token) {
            const requestBody = {
                query: `
                    mutation{
                        bookEvent(eventInfo: {_id: "${postId}",startDay:"${this.state.startingDate.toISOString()}",endDay:"${this.state.endingDate.toISOString()}"})
                        {
                        _id
                        startDay
                        endDay
                        }
                    }
                  `,
            };

            fetch('http://localhost:8000/graphql', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + 'token'
                }
            })
                .then((res) => {
                    if (res.status === 403){
                        sessionStorage.removeItem('token');
                        alert("Login is expired! Please login again");
                        window.location.replace('/auth')
                    }
                    if (res.status !== 200 && res.status !== 201 && res.status !== 403) {
                        throw new Error('Failed!');
                    }

                    return res.json();
                })
                .then(resData => {
                    alert("Booking successfully!")
                    window.location.reload();
                })
                .catch((err) => {
                    console.log(err);
                    if(err.toString() === 'Error: Failed!'){
                        alert("Booking failed!")
                    }
                });
        } else {
            alert("Unfortunately, form is incorrect!");
        }
    }



    render() {
        const {getRoom, token} = this.context;
        const room = getRoom(this.state.slug);

        if (!room) {
            return (
                <div className=" error" >
                    <h3> no such room is found</h3>
                    <Link to="/rooms" className=" btn-primary"> back to rooms</Link>
                </div>)
        }

        const {name, description, capacity, price, size, extras, breakfast, pets, images, bookedEvents} = room;
        const [mainImg] = images;

        let daysInvalid = [];
        let disabledDays = [...bookedEvents];
        disabledDays = disabledDays.map(booked => {
            const today = new Date();
            if (booked.endDay > today) {
                daysInvalid.push(booked.startDay);
                if(booked.startDay.toDateString() !== booked.endDay.toDateString()){
                    daysInvalid.push(booked.endDay);
                }
                let startDay = new Date(booked.startDay.getTime());
                startDay.setDate(startDay.getDate() - 1);

                let endDay = new Date(booked.endDay.getTime());
                endDay.setDate(endDay.getDate() + 1);
                return {
                    after: startDay,
                    before: endDay,
                }
            }
        })

        return (
            <>
                <StyledHero img={mainImg || this.state.defaultBcg}>
                    <Banner title={`${name} room`}>
                        <Link to="/rooms" className=" btn-primary">
                            back to rooms
                    </Link>
                    </Banner>
                </StyledHero>
                <section className="single-room">
                    <div className=" single-room-images">
                        {images.map((image, index) =>
                            <img key={index} src={image} alt={name} />
                        )}
                    </div>
                    <div className=" single-room-info">
                        <article className=" desc">
                            <h3>details</h3>
                            <p>{description}</p>
                        </article>
                        <article className="info">
                            <h3>info</h3>
                            <h6>price: {price}</h6>
                            <h6>size: {size} SQFT</h6>
                            <h6>max capacity: {
                                capacity > 1 ? `${capacity} people` : `${capacity} person`
                            }</h6>
                            <h6>{pets ? `pets allowed` : `pets NOT allowed`}</h6>
                            <h6>{breakfast && `free breakfast included`}</h6>
                        </article>
                    </div>
                </section>
                <section className="room-extras">
                    <h6>extras</h6>
                    <ul className="extras">
                        {extras.map((extra, index) =>
                            <li key={index}>- {extra}</li>
                        )}
                    </ul>
                </section>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '10px 0'
                }}
                >
                    {token && !this.state.isModaled &&
                        <button
                            onClick={this.startCreateEventHandler}
                            className=" btn-primary">
                            booking
                        </button>
                    }
                    {!token &&
                        <Link to="/auth" className=" btn-primary">
                            log in for booking
                        </Link>
                    }
                </div>
                {this.state.isModaled && (
                    <FormBooking
                        title="Booking Section"
                        canCancel
                        canConfirm
                        onCancel={this.modalCancelHandler}
                        onConfirm={this.modalConfirmHandler}
                        confirmText="Confirm"
                    >
                        <form className="booking-details">
                            <div className="bookingform-control">
                                <label htmlFor="name">Fullname</label>
                                <input type="text" placeholder="Michael Jordan" id="name" ref={this.nameElRef} />
                            </div>
                            <div className="bookingform-control">
                                <label htmlFor="phone">Phone Number</label>
                                <input type="number" placeholder="(+358) 123456789" id="phone" ref={this.phoneElRef} />
                            </div>
                            <div className="bookingform-control">
                                <label htmlFor="date">Date Of Booking</label>
                                <DaySelection handleDaySelection={this.handleDaySelection} disabledDays={disabledDays} daysInvalid={daysInvalid} />
                            </div>
                        </form>
                    </FormBooking>
                )}
            </>
        )
    }
}

import React, {Component} from 'react'
import defaultBcg from '../images/room-1.jpeg';
import Banner from '../components/Banner';
import {Link} from 'react-router-dom';
import {RoomContext} from '../context';
import StyledHero from '../components/StyledHero';
import Modal from '../components/Modal';
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

    handleDaySelection = (dayStart, dayEnd) => {
        this.setState({startingDate: dayStart, endingDate: dayEnd});
    }

    startCreateEventHandler = () => {
        this.setState({isModaled: true});
    };

    modalConfirmHandler = () => {
        console.log("time start", this.state.startingDate);
        console.log("time end", this.state.endingDate);
        const token = this.context.token;
        const postId = this.context.getRoom(this.state.slug)._id;
        console.log(postId,`.....token is :  ${token}`);

        if( this.state.startingDate  && this.state.endingDate && postId){
            const requestBody = {
                query: `
                    mutation{
                        bookEvent(eventInfo: {_id: "${postId}",startDay:"${this.state.startingDate.toISOString()}",endDay:"${this.state.endingDate.toISOString()}"})
                        {
                        _id
                        event{
                            name
                        }
                        user{
                            _id
                            email
                        }
                        startDay
                        endDay
                        createdAt
                        updatedAt
                        }
                    }
                  `,
            };
    
            fetch('http://localhost:8000/graphql', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                }
            })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(async resData => {
                console.log(await resData);
            })
            .catch(err => {
                console.log(err);
            });
        }else{
            console.log("Missing start day or end day or id of post!");
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

        const {_id,name, description, capacity, price, size, extras, breakfast, pets, images} = room;

        const [mainImg, ...defaultImg] = images;

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
                {!this.state.isModaled && (
                    <Modal
                        title="Add Event"
                        canCancel
                        canConfirm
                        onCancel={this.modalCancelHandler}
                        onConfirm={this.modalConfirmHandler}
                        confirmText="Confirm"
                    >
                        <form>
                            <div className="form-control">
                                <label htmlFor="name">Fullname</label>
                                <input type="text" id="name" ref={this.nameElRef} />
                            </div>
                            <div className="form-control">
                                <label htmlFor="phone">Phone Number</label>
                                <input type="number" id="phone" ref={this.phoneElRef} />
                            </div>
                            <div className="form-control">
                                <label htmlFor="date">Date Of Booking</label>
                                <DaySelection handleDaySelection={this.handleDaySelection} />
                            </div>
                        </form>
                    </Modal>
                )}
            </>
        )
    }
}

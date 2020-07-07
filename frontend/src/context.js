import React, {Component} from 'react'

const RoomContext = React.createContext();

class RoomProvider extends Component {
    
    state = {
        rooms: [],
        sortedRooms: [],
        featuredRooms: [],
        loading: true,
        type: "all",
        capacity: 1,
        price: 0,
        minPrice: 0,
        maxPrice: 0,
        minSize: 0,
        maxSize: 0,
        breakfast: false,
        pets: false,
        token: sessionStorage.getItem('token'),
        userId: null,
        bookings: [],
        isNavBarOpen: false,
    }

    handleToggleNavBar = () => {
        this.setState({ isNavBarOpen: !this.state.isNavBarOpen });
      };

    login = (token, userId, tokenExpiration) => {
        sessionStorage.setItem('token', token);
        this.setState({token: token, userId: userId});
    };

    logout = () => {
        sessionStorage.removeItem('token');
        this.setState({token: null, userId: null});
    };

    //get Data
    getData = () => {
        const requestBody = {
            query: `
                query{
                    events{
                        _id
                        name
                        slug
                        type
                        price
                        size
                        capacity
                        pets
                        breakfast
                        featured
                        description
                        extras
                        images{
                            fields{
                                file{
                                    url
                                }
                            }
                        }
                        bookedEvents{
                            _id
                            startDay
                            endDay
                        }
                    }
                }
              `
        };

        fetch('https://reservation-resort.herokuapp.com/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {
                const items = resData.data.events;
                const rooms = this.formatItems(items);
                let featuredRooms = rooms.filter(room => room.featured === true);
                let maxPrice = Math.max(...rooms.map(room => room.price));
                let maxSize = Math.max(...rooms.map(room => room.size));
                this.setState({rooms, featuredRooms, sortedRooms: rooms, loading: false, maxPrice: maxPrice, price: maxPrice, maxSize});
            })
            .catch(err => {
                console.log("error in data: ",err);
            });
    }


    componentDidMount() {
        this.getData();
    }

    
    formatItems(items) {
        let tempItem = items.map(item => {
            let _id = item._id;
            let images = item.images.map(image => image.fields.file.url);
            let bookedEvents = item.bookedEvents.map(booking => {
                const startDay = new Date(booking.startDay);
                const endDay = new Date(booking.endDay);
                return {...booking, startDay, endDay}
            })
            const room = {...item, images, _id, bookedEvents};
            return room;
        });
        return tempItem;
    }

    //get Room by slug

    getRoom = (slug) => {
        const tempRooms = [...this.state.rooms];
        const room = tempRooms.find(room => room.slug === slug);
        return room;
    }

    handleChange = (event) => {
        const target = event.target;

        const value = target.type === 'checkbox' ?
            target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        }, this.filterRooms);

    }
    filterRooms() {
        let {rooms, type, capacity, price, minSize, maxSize, breakfast, pets} = this.state;
        let tempRooms = [...rooms];
        //transform value
        capacity = parseInt(capacity);

        //filter by type
        if (type !== 'all') {
            tempRooms = tempRooms.filter(room => room.type === type);
        }
        //filter by capacity

        if (capacity !== 1) {
            tempRooms = tempRooms.filter(room => room.capacity === capacity);
        }
        //filter by price

        tempRooms = tempRooms.filter(room => room.price <= price)

        //filter by size
        tempRooms = tempRooms.filter(room => (room.size >= minSize && room.size <= maxSize));

        //filter by breakfast
        if (breakfast) {
            tempRooms = tempRooms.filter(room => room.breakfast === true);
        }
        //filter by pets
        if (pets) {
            tempRooms = tempRooms.filter(room => room.pets === true);
        }

        //Change state
        this.setState({
            sortedRooms: tempRooms
        })
    }

    render() {
        return (
            <RoomContext.Provider
                value={{
                    ...this.state,
                    getRoom: this.getRoom,
                    handleToggleNavBar: this.handleToggleNavBar,
                    handleChange: this.handleChange,
                    token: this.state.token,
                    userId: this.state.userId,
                    login: this.login,
                    logout: this.logout,
                    bookings: this.state.bookings
                }}
            >
                {this.props.children}
            </RoomContext.Provider>
        )
    }
}

const RoomConsumer = RoomContext.Consumer;

export const withRoomConsumer = (Component) => {
    const ConsumerWrapper = (props) => {
        return (
            <RoomConsumer>
                {value => <Component {...props} context={value} />}
            </RoomConsumer>
        )
    }
    return ConsumerWrapper;
}

export {RoomConsumer, RoomProvider, RoomContext} 
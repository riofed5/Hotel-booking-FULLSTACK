import React, { Component } from "react";
import { RoomContext } from "../context";
import BookingList from "../components/BookingList";
import Title from "../components/Title";
import { API_URL } from "../helpers/apiLinks";

export default class Bookings extends Component {
  state = {
    bookings: [],
  };
  static contextType = RoomContext;

  formatBookings = (bookings) => {
    let tempBooking = bookings.map((item) => {
      const images = item.event.images[0].fields.file.url;
      const startDay = new Date(item.startDay).toDateString();
      const endDay = new Date(item.endDay).toDateString();
      const booking = {
        ...item,
        event: { ...item.event, images },
        startDay,
        endDay,
      };
      return booking;
    });

    return tempBooking.reverse();
  };

  getBookings = () => {
    const requestBody = {
      query: `
                query{
                    bookings{
                        _id
                        event{
                            name
                            slug
                            images{
                                fields{
                                    file{
                                        url 
                                    }
                                }
                            }
                        }
                        startDay
                        endDay
                    }
                }
              `,
    };

    fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.context.token,
      },
    })
      .then((res) => {
        if (res.status === 403) {
          sessionStorage.removeItem("token");
          alert("Login is expired! Please login again");
          window.location.replace("/auth");
        }
        if (res.status !== 200 && res.status !== 201 && res.status !== 403) {
          throw new Error("Failed!");
        }
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        const itemsBooking = resData.data.bookings;
        const bookings = this.formatBookings(itemsBooking);
        this.setState({ bookings });
      })
      .catch((err) => {
        console.log("error in bookings: ", err);
      });
  };

  componentDidMount() {
    this.getBookings();
  }

  cancelBooking = (bookingId) => {
    const requestBody = {
      query: `
                mutation{
                    cancelBooking(bookingId:"${bookingId}"){
                        name
                    }
                }
            `,
    };

    fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.context.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    if (this.state.bookings.length === 0) {
      return (
        <div className=" empty-search">
          <h3>unfortunately no room booked</h3>
        </div>
      );
    }

    return (
      <section className=" bookingslist">
        <Title title="list of booking" />
        <div className=" bookinglist-center">
          <BookingList
            bookings={this.state.bookings}
            cancelBooking={this.cancelBooking}
          />
        </div>
      </section>
    );
  }
}

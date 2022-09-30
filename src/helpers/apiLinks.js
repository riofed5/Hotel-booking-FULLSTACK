export const API_URL =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "http://localhost:8000/graphql"
    : "https://resort-booking-v1.herokuapp.com/graphql";
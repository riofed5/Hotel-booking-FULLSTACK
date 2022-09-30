import React from "react";
import RoomsFilter from "./RoomsFilter";
import RoomsList from "./RoomsList";
import { withRoomConsumer } from "../context";
import Loading from "../components/Loading";

const RoomsContainer = ({ context }) => {
  const { sortedRooms, loading, rooms } = context;
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <RoomsFilter rooms={rooms} context={context} />
      <RoomsList rooms={sortedRooms} />
    </>
  );
};

export default withRoomConsumer(RoomsContainer);

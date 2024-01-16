import React from "react";
import { useLocation } from "react-router-dom";

function ReservationSeating() {
    const location = useLocation();
    const {reservation, tables} = location.state
    return (
        reservation.reservation_id
    )
}






export default ReservationSeating;
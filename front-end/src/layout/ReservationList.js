import React from "react";
import { Link } from "react-router-dom";
import { formatAsTime } from "../utils/date-time";

const ReservationList = ({reservation}) => {

    return (
        <>
        {reservation.status !== "finished" &&
            <div className="flex row mt-5">
              <p className="mr-3">{formatAsTime(reservation.reservation_time)} | {reservation.last_name} - party of {reservation.people}</p>
              <Link to={`/reservations/${reservation.reservation_id}/seat`}>
            <button>Seat</button>
          </Link>
            </div>
            }
            </>
    )

}

export default ReservationList
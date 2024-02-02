import React from "react";
import { Link } from "react-router-dom";
import { formatAsTime } from "../utils/date-time";

const ReservationList = ({reservation}) => {

    return (
        <div data-reservation-id-status={reservation.reservation_id} className="flex row mt-5 ml-3">
        {reservation.status !== "finished" &&
            <div>
              <p>
                {formatAsTime(reservation.reservation_time)} | {reservation.last_name} - party of {reservation.people} |  Status: {reservation.status}
                </p>
            </div>
            }
        {reservation.status === "seated" ? "" : 
        <div className= "flex ml-2">
        <Link to={`/reservations/${reservation.reservation_id}/seat`}>
        <button>Seat</button>
      </Link>
      </div>
        }
      </div>
    )

}

export default ReservationList
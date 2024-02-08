import React from "react";
import { formatAsTime } from "../utils/date-time";

const ReservationList = ({reservation}) => {

    return (
        <div data-reservation-id-status={reservation.reservation_id} className="flex row mt-5 ml-3">
              <p>
                {formatAsTime(reservation.reservation_time)} | {reservation.first_name} {reservation.last_name} - party of {reservation.people} |  Status: {reservation.status}
                </p>
      </div>
    )

}

export default ReservationList
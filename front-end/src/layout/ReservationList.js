import React from "react";
import { useHistory, Link } from "react-router-dom";
import { formatAsTime } from "../utils/date-time";
import { cancelStatus } from "../utils/api";

const ReservationList = ({reservation}) => {
  const history = useHistory();

  async function cancelHandler(reservation) {
    const abortController = new AbortController();
    const result = window.confirm("Do you want to cancel this reservation? This cannot be undone.");
    if (result) {
      try {
        await cancelStatus(reservation, abortController.signal);
        history.go(0);
      } catch (error) {
        console.log(error)
      }
    }
    return () => abortController.abort();
  }

    return (
        <div data-reservation-id-status={reservation.reservation_id} className="flex row mt-5 ml-3">
              <p>
                {formatAsTime(reservation.reservation_time)} | {reservation.first_name} {reservation.last_name} - party of {reservation.people} |  Status: {reservation.status}
                </p>
                <Link to={`/reservations/${reservation.reservation_id}/edit`}>
                  <button>Edit</button>
                </Link>
                <button data-reservation-id-cancel={reservation.reservation_id}
                  onClick={() => cancelHandler(reservation)}>Cancel</button>
      </div>
    )

}

export default ReservationList
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date: initialDate }) {
  const [date, setDate] = useState(initialDate);
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const history = useHistory();

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  const handleButtonClick = (action) => {
    let newDate;

    switch (action) {
      case "previous":
        newDate = new Date(date);
        newDate.setDate(newDate.getDate() - 1);
        break;
      case "today":
        newDate = new Date();
        break;
      case "next":
        newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 1);
        break;
      default:
        break;
    }

    setDate(newDate);
    history.push(`/dashboard?date=${newDate.toISOString().split('T')[0]}`);
  };


  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <div>
        <button onClick={() => handleButtonClick("previous")}>Previous</button>
        <button onClick={() => handleButtonClick("today")}>Today</button>
        <button onClick={() => handleButtonClick("next")}>Next</button>
      </div>
      <ErrorAlert error={reservationsError} />
      {reservations.map((reservation) => (
        <div>
          <p>{reservation.time}{reservation.last_name}</p>
        </div>
      ))}
    </main>
  );
}

export default Dashboard;

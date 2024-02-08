import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { listReservations } from "../utils/api";
import { listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today, next, previous } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import { finishTable } from "../utils/api";
import ReservationList from "../layout/ReservationList";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const query = useQuery();
  const [date, setDate] = useState(query.get("date") || today());
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);
  const history = useHistory();
  

  useEffect(loadDashboard, [date]);
  useEffect(loadTables, []);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  //Loading the list of tables
  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal)
    .then(setTables)
    .catch(setTablesError)
    return () => abortController.abort();
  }

  //Click Handler to navigate between dates
  const handleButtonClick = (action) => {

    switch (action) {
      case "previous":
        setDate(previous(date))
        history.push(`dashboard?date=${previous(date)}`)
        break;
      case "today":
        setDate(today())
        history.push(`dashboard?date=${today()}`)
        break;
      case "next":
        setDate(next(date))
        history.push(`dashboard?date=${next(date)}`)
        break;
      default:
        break;
    }
  };

  async function handleDelete(table_id) {
    const abortController = new AbortController();
    const result = window.confirm("Is this table ready to seat new guests?");
    if (result) {
      try {
        await finishTable(table_id, abortController.signal);
        loadDashboard();
        loadTables();
      } catch (error) {
        console.log(error)
      }
    }
    return () => abortController.abort();
  }

// Component for ReservationList
  const reservationList = reservations.map((reservation) => (
    <>
    {reservation.status !== "finished" &&
      <ReservationList reservation = {reservation} />
  }
    {reservation.status === "seated" ? "" : 
    <div className= "flex ml-2">
    <Link to={`/reservations/${reservation.reservation_id}/seat`}>
    <button>Seat</button>
  </Link>
  </div>
}
</>
  ))

  
  return (
    <main>
      <h1 className="mb-3">Dashboard</h1>
      <div className="container">
        <div className="row">
        <div className="col-md-6"> 
          <div className="d-md-flex mb-1">
            <h4 className="mb-0">Reservations for date</h4>
          </div>
          {/* Date navigation buttons */}
          <div>
            <button onClick={() => handleButtonClick("previous")}>Previous</button>
            <button onClick={() => handleButtonClick("today")}>Today</button>
            <button onClick={() => handleButtonClick("next")}>Next</button>
          </div>
          <ErrorAlert error={reservationsError} />
          {/* List of Reservations */}
          {reservationList}
        </div>
        {/* List of Tables */}
        <div className="col-md-6">
        <div className="d-md-flex mb-3">
            <h4 className="mb-0">Tables</h4>
          </div>
          {tables.map((table) => (
             <div data-table-id-status={`${table.table_id}`}>
              <div>
              {table.table_name}
              {table.reservation_id === null ? "  -   Free" : "   -   Occupied"}
              </div>
              <div>
                {table.reservation_id !== null &&
                <button data-table-id-finish={`${table.table_id}`}
                  onClick={() => handleDelete(table.table_id)}>Finish</button>
                 }
              </div>
          </div>
          ))} 
          </div>
      </div>
      </div>
    </main>
  );
}

export default Dashboard;

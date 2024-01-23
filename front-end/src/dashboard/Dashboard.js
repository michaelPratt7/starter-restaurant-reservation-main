import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { listReservations } from "../utils/api";
import { listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today, next, previous, formatAsTime } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import TableList from "../layout/TableList";

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

  //Loading the list of tables
  useEffect(() => {
    const abortController = new AbortController();
    async function getTables() {
      const newTables = await listTables(abortController.signal);
      setTables(newTables);
    }
    getTables();
    return () => abortController.abort();
  }, []);

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

// Component for TableList
  const tableList = tables.map((table) => <TableList table = {table} />)

  
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
          {reservations.map((reservation) => {
            {reservation.status !== "finished" &&
            <div className="flex row mt-5">
              <p className="mr-3">{formatAsTime(reservation.reservation_time)} | {reservation.last_name} - party of {reservation.people}</p>
              <Link to={`/reservations/${reservation.reservation_id}/seat`}>
            <button>Seat</button>
          </Link>
            </div>
            }
          })}
        </div>
        {/* List of Tables */}
        <div class="col-md-6">
        <div className="d-md-flex mb-3">
            <h4 className="mb-0">Tables</h4>
          </div>
          {tableList} 
          </div>
      </div>
      </div>
    </main>
  );
}

export default Dashboard;

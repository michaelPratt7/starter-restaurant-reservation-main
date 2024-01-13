import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations } from "../utils/api";
import { listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today, next, previous, formatAsTime } from "../utils/date-time";
import useQuery from "../utils/useQuery";

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

  useEffect(() => {
    const abortController = new AbortController();
    async function getTables() {
      const newTables = await listTables(abortController.signal);
      setTables(newTables);
    }
    getTables();
    return () => abortController.abort();
  }, []);


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


  return (
    <main>
      <h1 className="text-center">Dashboard</h1>
      <div className="container">
        <div className="row">
        <div className="col-md-6"> 
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
              <p>{formatAsTime(reservation.reservation_time)} | {reservation.last_name}</p>
            </div>
          ))}
        </div>
        <div class="col-md-6">
          {tables.map((table) => (
            <div>
            <p>{table.table_name}</p>
            </div>
          ))}
        </div>
      </div>
      </div>
    </main>
  );
}

export default Dashboard;

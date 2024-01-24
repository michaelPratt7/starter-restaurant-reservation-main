import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations } from "../utils/api";
import { listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today, next, previous } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import { finishTable } from "../utils/api";
import TableList from "../layout/TableList";
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

  async function handleDelete(table_id) {
    const result = window.confirm("Is this table ready to seat new guests?");
    if (result && table_id) {
      await finishTable(table_id);
      
    }
    history.go(0);
  }

// Components for TableList and ReservationList
  const tableList = tables.map((table) => <TableList table = {table} />)
  const reservationList = reservations.map((reservation) => <ReservationList reservation = {reservation} />)

  
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
            <div id={`data-table-id-status=${table.table_id}`}>
            <p>
              {table.table_name}
              {table.reservation_id === null ? "  -   Free" : "   -   Occupied"} 
              {table.reservation_id !== null && 
                <button id={`data-table-id-finish=${table.table_id}`} 
                  onClick={() => handleDelete(table.table_id)}>Finish</button>
                 }
            </p>
          </div>
          ))} 
          </div>
      </div>
      </div>
    </main>
  );
}

export default Dashboard;

import React, {useState} from "react";
import { useLocation, useHistory } from "react-router-dom";
import { updateTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function ReservationSeating() {
    const history = useHistory();
    const location = useLocation();
    const {reservation, tables} = location.state
    const [tableError, setTableError] = useState(null);

    const submitHandler = async (event) => {
        event.preventDefault();
        setTableError(null);
        const selectedTableId = event.target.elements.table_id.value;
        const selectedTable = tables.find((table) => table.table_id === selectedTableId);
        const abortController = new AbortController();
      
        try {
          await updateTable(selectedTable, abortController.signal);
          
          history.push(`/dashboard`);
        } catch (error) {
          if (error.name !== "AbortError") {
            setTableError(error);
          }
        }
        return () => abortController.abort();
      };

    return (
        <main>
            <form onSubmit={submitHandler}>
                <div>
                <label>
                    Pick a table:
                    <select name="table_id">
                    {tables.map((table) => (
                        <option key={table.table_id} value={table.table_id}>
                        {table.table_name} - {table.capacity}
                        </option>
                    ))}
                    </select>
                </label>
                </div>
                <ErrorAlert error={tableError} />
                <div>
                    <button type="button" onClick={() => history.goBack()}>Cancel</button>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </main>
      );
}






export default ReservationSeating;
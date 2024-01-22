import React, {useState} from "react";
import { useLocation, useHistory, useParams } from "react-router-dom";
import { updateTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function ReservationSeating() {
    const history = useHistory();
    const location = useLocation();
    const {reservation_id} = useParams();
    const {tables} = location.state
    const [tableError, setTableError] = useState(null);
    const [value, setValue] = useState("");

    const changeHandler = (event) => {
      const selectedValue = event.target.value
      setValue(selectedValue);
    };

    const submitHandler = async (event) => {
      event.preventDefault();
      setTableError(null);
      const abortController = new AbortController();
    
      try {
        await updateTable(reservation_id, value, abortController.signal);
        history.push(`/dashboard`);
      } catch (error) {
        setTableError(error);
      }
    };

    return (
        <main>
            <form onSubmit={submitHandler}>
                <div>
                <label>
                    Pick a table:
                    <select 
                      name="table_id"
                      onChange= {changeHandler}
                    >
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
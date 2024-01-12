import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

function NewTable() {
    const history = useHistory();

    const initialFormState = {
        table_name: "",
        capacity: 0,
    }

    const [table, setTable] = useState({...initialFormState});
    const [tableError, setTableError] = useState(null);

    function changeHandler(event) {
        setTable({
            ...table,
            [event.target.name]: event.target.value
        })
       }
    
       function numberChangeHandler(event) {
        setTable({
            ...table,
            [event.target.name]: Number(event.target.value)
        })
       }

       async function submitHandler(event) {
        event.preventDefault();
        setTableError(null);
        history.push(`/dashboard`)
       }

    return (
        <main>
            <form onSubmit={submitHandler}>
                <table>
                    <td htmlFor="table_name">
                        Table Name
                        <input
                        id="table_name"
                        name="table_name"
                        type="text"
                        onChange={changeHandler}
                        value={table.table_name}
                        />
                    </td>
                    <td htmlFor="capacity">
                        Capacity
                        <input
                        id="capacity"
                        name="capacity"
                        type="integer"
                        style={{width: 30}}
                        onChange={changeHandler}
                        value={table.capacity}
                        />
                    </td>
                </table>
                <div className="flex pt-2">
                    <ErrorAlert error={tableError} />
                    <button type="button" onClick={() => history.goBack()}>Cancel</button>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </main>
    )
}

export default NewTable;
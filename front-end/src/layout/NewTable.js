import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {createTable} from "../utils/api"
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
        const abortController = new AbortController();

        try {
            await createTable(table, abortController.signal).then(() => 
            history.push(`/dashboard`))
        }
        catch(error) {
            if (error.name !== "AbortError") {
                setTableError(error)
            }
        }
        return () => abortController.abort();
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
                        onChange={numberChangeHandler}
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
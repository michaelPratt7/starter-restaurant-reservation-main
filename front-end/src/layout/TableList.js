import React from "react";
import { useHistory } from "react-router-dom";
import { finishTable } from "../utils/api";

const TableList = ({table}) => {
    
    const history = useHistory();

    

    async function handleDelete(table_id) {
      const result = window.confirm("Is this table ready to seat new guests?");
      if (result && table_id) {
        await finishTable(table_id);
        history.go(0);
      }
    }

    return ( 
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
    )
}

export default TableList
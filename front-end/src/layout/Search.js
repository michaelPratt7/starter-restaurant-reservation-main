import React, {useState} from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationList from "../layout/ReservationList";

function Search() {
    const [mobileNumber, setMobileNumber] = useState("")
    const [reservations, setReservations] = useState([]);
    const [reservationsError, setReservationsError] = useState(null);

    
    function changeHandler(event) {
        setMobileNumber(event.target.value)
       }

    async function submitHandler(event) {
        event.preventDefault();
        setReservationsError(null);
        const abortController = new AbortController();
        listReservations({ mobile_number: mobileNumber }, abortController.signal)
        .then(setReservations)
        .catch(setReservationsError);
        return () => abortController.abort();
    }

    const reservationList = reservations.length > 0 ? (
         reservations.map((reservation) => (
        <div>
        {reservation && (
        <ReservationList reservation = {reservation} />
        )}
        </div>
        ))
    ) : (
        <div>No reservations found</div>
    )

    
    return (
        <main>
        <form className= "mt-3" onSubmit={submitHandler}>
            <input
                id="mobile_number"
                name="mobile_number"
                type="text"
                placeholder="Enter a customer's phone number"
                style={{ width: "30%" }}
                value={mobileNumber}
                onChange={changeHandler}
                />
            <button type="submit">Find</button>
        </form>
        <ErrorAlert error={reservationsError} />
        {/* List of Reservations */}
        {reservationList}
        </main>
    )
}

export default Search;
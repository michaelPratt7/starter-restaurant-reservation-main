import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import { createReservation } from "../utils/api";
import {formatAsDate} from "../utils/date-time";
import ReservationForm from "./ReservationForm";


function NewReservation() {
   const history = useHistory();

   const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
   }
   
   const [reservation, setReservation] = useState({...initialFormState});
   const [reservationError, setReservationError] = useState(null);


   async function submitHandler(event) {
    event.preventDefault();
    setReservationError(null);
    const abortController = new AbortController();
    
    try {
        const response = await createReservation(reservation, abortController.signal);
        history.push(`/dashboard?date=${formatAsDate(response.reservation_date)}`)
    }
    catch(error) {
        if (error.name !== "AbortError") {
            setReservationError(error)
        }
    }
    return () => abortController.abort();
   }


   return (
        <main>
            <ReservationForm reservation={reservation}
                            setReservation={setReservation}
                            reservationError={reservationError}
                            submitHandler={submitHandler} />
        </main>
    );
}

export default NewReservation;
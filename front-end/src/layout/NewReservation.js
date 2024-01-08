import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";


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
   
   const [reservation, setReservation] = useState(initialFormState);
   const [reservationError, setReservationError] = useState([]);

   function changeHandler(event) {
    setReservation({
        ...reservation,
        [event.target.name]: event.target.value
    })
   }

   function numberChangeHandler(event) {
    setReservation({
        ...reservation,
        [event.target.name]: Number(event.target.value)
    })
   }

   function submitHandler(event) {
    event.preventDefault();
    const selectedDate = reservation.reservation_date;
    const currentDate = new Date();
    const newErrors = [];
        if (selectedDate.getDay() === 2) {
        newErrors.push("Reservations cannot be made on Tuesdays."); 
    }
    
       if (selectedDate < currentDate) {
        newErrors.push("Reservations cannot be made for past dates."); 
    }
    setReservationError(newErrors)
    if (newErrors.length > 0) return;
    createReservation(reservation).then(() =>
    history.push(`/dashboard?date=${reservation.reservation_date}`))
    setReservation({initialFormState})
   }


   return (
    <main>
        <form onSubmit={submitHandler}>
            <table>
                <td htmlFor="first_name">
                    First Name
                    <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    onChange={changeHandler}
                    value={reservation.first_name}
                    />
                </td>
                <td htmlFor="last_name">
                    Last Name
                    <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    onChange={changeHandler}
                    value={reservation.last_name}
                    />
                </td>
                <td htmlFor="mobile_number">
                    Mobile Number
                    <input
                    id="mobile_number"
                    name="mobile_number"
                    type="text"
                    onChange={changeHandler}
                    value={reservation.mobile_number}
                    />
                </td>
                <td htmlFor="reservation_date">
                    Reservation Date
                    <input
                    id="reservation_date"
                    name="reservation_date"
                    type="date"
                    onChange={changeHandler}
                    value={reservation.reservation_date}
                    />
                </td>
                <td htmlFor="reservation_time">
                    Reservation Time
                    <input
                    id="reservation_time"
                    name="reservation_time"
                    type="time"
                    onChange={changeHandler}
                    value={reservation.reservation_time}
                    />
                </td>
                <td htmlFor="people">
                    People
                    <input
                    id="people"
                    name="people"
                    type="text"
                    style={{width: 30}}
                    onChange={numberChangeHandler}
                    value={reservation.people}
                    />
                </td>
            </table>
            <div className="flex pt-2">
            <ErrorAlert error={reservationError} />
        <button type="button" onClick={() => history.goBack()}>Cancel</button>
        <button type="submit">Submit</button>
    </div>
</form>
</main>
);
}

export default NewReservation;
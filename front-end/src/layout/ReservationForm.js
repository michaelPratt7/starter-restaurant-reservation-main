import React from "react";
import {useHistory} from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

function ReservationForm({
    reservation,
    setReservation,
    reservationError,
    submitHandler,
}) {

    const history = useHistory();

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

    return (
            <form onSubmit={submitHandler}>
                    <label htmlFor="first_name">
                        First Name
                        <input
                        id="first_name"
                        name="first_name"
                        type="text"
                        onChange={changeHandler}
                        value={reservation.first_name}
                        />
                    </label>
                    <label htmlFor="last_name">
                        Last Name
                        <input
                        id="last_name"
                        name="last_name"
                        type="text"
                        onChange={changeHandler}
                        value={reservation.last_name}
                        />
                    </label>
                    <label htmlFor="mobile_number">
                        Mobile Number
                        <input
                        id="mobile_number"
                        name="mobile_number"
                        type="text"
                        onChange={changeHandler}
                        value={reservation.mobile_number}
                        />
                    </label>
                    <label htmlFor="reservation_date">
                        Reservation Date
                        <input
                        id="reservation_date"
                        name="reservation_date"
                        type="date"
                        onChange={changeHandler}
                        value={reservation.reservation_date}
                        />
                    </label>
                    <label htmlFor="reservation_time">
                        Reservation Time
                        <input
                        id="reservation_time"
                        name="reservation_time"
                        type="time"
                        onChange={changeHandler}
                        value={reservation.reservation_time}
                        />
                    </label>
                    <label htmlFor="people">
                        People
                        <input
                        id="people"
                        name="people"
                        type="text"
                        style={{width: 30}}
                        onChange={numberChangeHandler}
                        value={reservation.people}
                        />
                    </label>
                <div className="flex pt-2">
                <ErrorAlert error={reservationError} />
            <button type="button" onClick={() => history.goBack()}>Cancel</button>
            <button type="submit">Submit</button>
        </div>
    </form>
    );
}

export default ReservationForm
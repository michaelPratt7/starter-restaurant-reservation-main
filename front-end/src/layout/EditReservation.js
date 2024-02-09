import React, {useEffect, useState} from "react";
import {useParams, useHistory} from "react-router-dom";
import { getRes, updateRes } from "../utils/api";
import ReservationForm from "./ReservationForm";

function EditReservation () {
    const history = useHistory();
    const {reservation_id} = useParams();
    const [reservation, setReservation] = useState({});
    const [reservationError, setReservationError] = useState(null);


    useEffect(() => {
        const abortController = new AbortController();
        try {
        async function getReservation(){
            const res = await getRes(reservation_id, abortController.signal)
            setReservation(res)
        }
        getReservation();
    } catch(error) {
        if (error.name !== "AbortError") {
            setReservationError(error)
        }
    }
        return () => abortController.abort
    }, [reservation_id]);


    async function submitHandler(event) {
        event.preventDefault();
        await updateRes(reservation);
        history.goBack();
      };

      return (
        <main>
            <ReservationForm reservation={reservation}
                            setReservation={setReservation}
                            reservationError={reservationError}
                            submitHandler={submitHandler} />
        </main>
    );
};

export default EditReservation;
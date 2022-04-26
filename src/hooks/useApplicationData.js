import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
  });

  const setDay = (day) => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8001/api/days"),
      axios.get("http://localhost:8001/api/appointments"),
      axios.get("http://localhost:8001/api/interviewers"),
    ])
      .then((all) => {
        // set your states here with the correct values...
        setState((prev) => ({
          ...prev,
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data,
        }));
      })
      .catch((err) => console.error(err));
  }, []);

  function bookInterview(id, interview) {
    console.log(id, interview); // show booking update
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    // Find the index of the day
    const dayIndex = state.days.findIndex((day) =>
      day.appointments.includes(id)
    );

    // Check if it's editing interview
    const editInterview = state.appointments[id].interview;

    // Update spots based on criterias
    function updateSpots() {
      let spots = state.days[dayIndex].spots;

      // Create new interview removes 1 spot, otherwise stay the same
      if (!editInterview) {
        return spots - 1;
      } else {
        return spots;
      }
    }

    let day = {
      ...state.days.find((d) => d.name === state.day),
      spots: updateSpots(),
    };

    const days = state.days;
    days[dayIndex] = day;

    return axios
      .put(`http://localhost:8001/api/appointments/${id}`, { interview })
      .then(() => setState((prev) => ({ ...prev, appointments, days })));
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    // Find the index of the day
    const dayIndex = state.days.findIndex((day) =>
      day.appointments.includes(id)
    );

    // Update to add 1 spot after cancelling interview
    const day = {
      ...state.days.find((d) => d.name === state.day),
      spots: state.days[dayIndex].spots + 1,
    };

    const days = state.days;
    days[dayIndex] = day;

    return axios
      .delete(`http://localhost:8001/api/appointments/${id}`)
      .then(() => setState((prev) => ({ ...prev, appointments, days })));
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  };
}

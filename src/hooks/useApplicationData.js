import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ])
    .then(all => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}));
    })
    .catch(e => console.log(e));
  }, []);

  const getDayIndexForAppointment = function(days, id) {
    for (const day of days) {
      if (day.appointments.indexOf(id) !== -1) {
        return day.id - 1;
      }
    }
  };

  const bookInterview = function(id, interview) {
    const dayId = getDayIndexForAppointment(state.days, id);
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.put(`/api/appointments/${id}`, appointment)
    .then(() => {
      setState(prev => {
        prev.days[dayId].spots -= 1;
        return { ...prev, appointments };
      });
    });
  };

  const cancelInterview = function(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.delete(`/api/appointments/${id}`)
    .then(() => setState({ ...state, appointments }));
  };

  return { state, setDay, bookInterview, cancelInterview };
};
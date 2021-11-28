import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  // This is the default empty state, before values are fetched from the API.
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  // setDay is called whenever a day is clicked in the day list, so the information switches
  // to that particular day.
  const setDay = day => setState({ ...state, day });

  /*
  All the initial axios requests are wrapped in a useEffect function with an empty dependency array,
  so that everything won't continuously re-render.
  */
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

  // This is a helper function for the other two functions below; it only serves to find the proper
  // day in which a particular appointment slot is located.
  const getDayIndexForAppointment = function(days, id) {
    for (const day of days) {
      if (day.appointments.indexOf(id) !== -1) {
        return day.id - 1;
      }
    }
  };

  /*
  This function is called whenever a new interview is booked or modified. It works on three levels:
  1. the individual appointment object is made, with the new student and interviewer info,
  2. a new object of total appointments is created, essentially cloning the old appointments object plus the new appointment info, and
  3. the state is set in an axios put request with the new data.
  The number of spots remaining in each day is also updated here, so that the number will be reflected
  without the user having to refresh the page.
  */
  const bookInterview = function(id, interview, edit = false) {
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

  /*
  This function is called whenever an appointment is flat-out cancelled. Since the only thing that
  has to happen on the back end is that the "interview" property of the respective appointment slot be set to null,
  it is virtually indentical to the bookInterview function, except the number of spots is
  increased by 1 instead of decreased and the interview is set to null.
  */
  const cancelInterview = function(id) {
    const dayId = getDayIndexForAppointment(state.days, id);
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.delete(`/api/appointments/${id}`)
    .then(() => {
      setState(prev => {
        prev.days[dayId].spots += 1;
        return { ...prev, appointments };
      });
    });
  };

  return { state, setDay, bookInterview, cancelInterview };
};
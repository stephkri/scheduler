import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  // This is the default empty state, before values are fetched from the API.
  const [prev, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  // setDay is called whenever a day is clicked in the day list, so the information switches
  // to that particular day.
  const setDay = day => setState({ ...prev, day });

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

  /*
  This function is called whenever a new interview is booked or modified. It works on three levels:
  1. the individual appointment object is made, with the new student and interviewer info,
  2. a new object of total appointments is created, essentially cloning the old appointments object plus the new appointment info, and
  3. the state is set in an axios put request with the new data.
  
  The number of spots remaining in each day is also updated here, so that the number will be reflected
  without the user having to refresh the page.

  This spot reducer is wrapped in a conditional that depends on the value of the parameter "edit".
  This way, the number of spots in a day will only be decreased if a new appointment is made, and
  not when it is simply an edit.
  */
  const bookInterview = function(id, interview, edit = false) {
    return axios.put(`/api/appointments/${id}`, {interview})
    .then(() => {
      setState(prev => {
        const appointments = {
          ...prev.appointments,
          [id]: {
            ...prev.appointments[id],
            interview
          }
        };
        const newDays = prev.days.map(day => {
          if (day.name === prev.day && !edit) {
            return { ...day, spots: day.spots - 1 };
          } else {
            return day;
          }
        })
        return { ...prev, appointments, days: newDays };
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
    return axios.delete(`/api/appointments/${id}`)
    .then(() => {
      setState(prev => {
        const appointments = {
          ...prev.appointments,
          [id]: {
            ...prev.appointments[id],
            interview: null
          }
        };
        const newDays = prev.days.map(day => {
          if (day.name === prev.day) {
            return { ...day, spots: day.spots + 1 };
          } else {
            return day;
          }
        })
        return { ...prev, days: newDays, appointments };
      });
    });
  };

  return { state: prev, setDay, bookInterview, cancelInterview };
};
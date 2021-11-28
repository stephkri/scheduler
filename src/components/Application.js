/*
This is the main application page for the scheduler.
There have been Jest and Storybook tests made for this. Instructions for Storybook are laid out in
stories/index.js. Any file that ends in .test.js is done for Jest testing, which you can
observe by running "npm test" in your terminal.
*/

import React from "react";
// CSS for the scheduler
import "components/Application.scss";

// Information about each of these functions can be found in their files.
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";
import useApplicationData from "hooks/useApplicationData";

// Import the two top-level components; all others are children of these
import DayList from "./DayList";
import Appointment from "./Appointment";

export default function Application() {

  /*
  useApplicationData can be found in the src/hooks folder. Without needing any parameters, it
  makes requests to the API server using axios and fetches all necessary data, as well as
  a few functions which use or rely on said data. More information can be found in the file itself.
  */
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();

  // These functions are used to narrow down the list of appointments and available interviewers
  // to whichever day is selected in the app.
  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const dailyInterviewers = getInterviewersForDay(state, state.day);

  return (
    <main className="layout">
      <section className="sidebar">
      <img
        className="sidebar--centered"
        src="images/logo.png"
        alt="Interview Scheduler"
      />
      <hr className="sidebar__separator sidebar--centered" />
      <nav className="sidebar__menu">
      <DayList
        days={state.days}
        value={state.day}
        onChange={setDay}
      />
      </nav>
      <img
        className="sidebar__lhl sidebar--centered"
        src="images/lhl.png"
        alt="Lighthouse Labs"
      />
      </section>
      <section className="schedule">
        {dailyAppointments.map(app => {
          const interview = getInterview(state, app.interview);
          return(<Appointment
            key={app.id}
            id={app.id}
            time={app.time}
            interview={interview}
            interviewers={dailyInterviewers}
            bookInterview={bookInterview}
            cancelInterview={cancelInterview}
            />);
        })}
        <Appointment key="last" time="5pm" />
        {/* this appointment is just a placeholder so the schedule will have a fixed end time */}
      </section>
    </main>
  );
}

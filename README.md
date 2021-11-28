# Interview Scheduler

## Description

This is a React-based web app designed for saving, editing and cancelling interviews at a particular date and time. In this app, users can:

- View a list of current scheduled appointments over a period of five business days
- Book a new interview with any student name, and an interviewer of their choice
- Edit the same time slot to put in a different name and interviewer
- Cancel an appointment entirely

## Setup

Clone both this repo and my `scheduler-api` repo into your machine, but in separate areas (one should not be inside the other).

Install dependencies in both with `npm install`.

In one terminal, go into the `scheduler-api` repository and run `npm start` to boot up the API server. It provides the necessary starting data, without which this scheduler cannot function.

In another terminal, go into this repository and run `npm start`. The application should start up by itself.

## Dependencies

- Axios 0.24.x or higher
- Classnames 2.2.6 or higher
- Normalize.css 8.0.1 or higher
- React 16.9.x or higher
- react-dom 16.9.x or higher
- react-scripts 3.0

## Screenshots

!["Initial appearance of the app"](https://github.com/stephkri/scheduler/blob/master/screenshots/01init.png)
!["What the user sees when the edit button is clicked"](https://github.com/stephkri/scheduler/blob/master/screenshots/02editinit.png)
!["New values entered into edit form"](https://github.com/stephkri/scheduler/blob/master/screenshots/03editnew.png)
!["Successfully edited the appointment"](https://github.com/stephkri/scheduler/blob/master/screenshots/04shownew.png)
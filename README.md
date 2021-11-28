# Interview Scheduler

## Description

This is a react-based web app designed for saving, editing and cancelling interviews at a particular date and time. In this app, users can:

- View a list of current scheduled appointments over a period of five business days
- Book a new interview with any student name, and an interviewer of their choice
- Edit the same time slot to put in a different name and interviewer
- Cancel an appointment entirely

## Setup

Clone both this repo and my `scheduler-api` repo into your machine, but in separate areas (one should not be inside the other).

Install dependencies in both with `npm install`.

In one terminal, go into the `scheduler-api` repository and run `npm start` to boot up the API server. It provides the necessary starting data, without which this scheduler cannot function.

In another terminal, go into this repository and run `npm start`. The application should start up by itself.

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```

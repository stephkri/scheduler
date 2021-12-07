import React from "react";

import {
  render,
  cleanup,
  waitForElement,
  waitForElementToBeRemoved,
  fireEvent,
  prettyDOM,
  getByText,
  getByTestId,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  queryByText } from "@testing-library/react";

import Application from "components/Application";

import axios from "axios";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
    await waitForElement(() => getByText("Monday"));
    fireEvent.click(getByText("Tuesday"));
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });
  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Saving...")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    const liArray = getAllByTestId(container, "day");
    expect(liArray.find(day => queryByText(day, "Monday"))).toBeTruthy();
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(queryByText(day, "no spots remaining")).toBeTruthy();
  });
});
describe("Cancel test", () => {
  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const cohenAppt = appointments.find(appt => queryByText(appt, "Archie Cohen"));
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    fireEvent.click(getByAltText(cohenAppt, "Delete"));
    expect(getByText(cohenAppt, "Are you sure you want to cancel this appointment?")).toBeInTheDocument();
    fireEvent.click(getByText(cohenAppt, "Confirm"));
    expect(getByText(cohenAppt, "Deleting...")).toBeInTheDocument();
    await waitForElement(() => getByAltText(cohenAppt, "Add"));
    expect(queryByText(container, "Archie Cohen")).not.toBeTruthy();
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });
  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const editAppt = appointments.find(appt => queryByText(appt, "Archie Cohen"));
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    fireEvent.click(getByAltText(editAppt, "Edit"));
    await waitForElement(() => getByTestId(editAppt, "form"));
    fireEvent.change(getByPlaceholderText(editAppt, /enter student name/i), {
      target: { value: "Squidney Brickelfritz" }
    });
    fireEvent.click(getByAltText(editAppt, "Sylvia Palmer"));
    fireEvent.click(getByText(editAppt, "Save"));
    expect(getByText(editAppt, "Saving...")).toBeInTheDocument();
    await waitForElement(() => getByText(editAppt, "Squidney Brickelfritz"));
    expect(queryByText(day, "1 spot remaining")).toBeTruthy();
  });
  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    await waitForElement(() => getByTestId(appointment, "error"));
    expect(queryByText(appointment, "Could not save the appointment.")).toBeTruthy();
  });
  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const cohenAppt = appointments.find(appt => queryByText(appt, "Archie Cohen"));
    fireEvent.click(getByAltText(cohenAppt, "Delete"));
    expect(getByText(cohenAppt, "Are you sure you want to cancel this appointment?")).toBeInTheDocument();
    fireEvent.click(getByText(cohenAppt, "Confirm"));
    expect(getByText(cohenAppt, "Deleting...")).toBeInTheDocument();
    await waitForElement(() => getByTestId(cohenAppt, "error"));
    expect(queryByText(appointment, "Could not cancel the appointment.")).toBeTruthy();
  })
});

import React, { useState } from "react";
import InterviewerList from "components/InterviewerList";
import Button from "components/Button";

export default function Form(props) {
  const [student, setStudent] = useState(props.student || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState("");

  const reset = function() {
    setStudent("");
    setInterviewer(null);
  };

  const cancel = function() {
    reset();
    props.onCancel();
  };

  const validate = function() {
    if (studentName === "") {
      setError("Student name cannot be blank");
      return;
    }
  
    props.onSave(studentName, interviewer, edit);
  };

  return (<main className="appointment__card appointment__card--create">
    <section className="appointment__card-left">
      <form autoComplete="off" onSubmit={event => event.preventDefault()}>
        <input
          className="appointment__create-input text--semi-bold"
          name="name"
          type="text"
          placeholder="Enter Student Name"
          value={student}
          onChange={(event) => setStudent(event.target.value)}
          data-testid="student-name-input"
        />
      </form>
      <InterviewerList
        interviewers={props.interviewers}
        interviewer={interviewer}
        onChange={setInterviewer}
      />
    </section>
    <section className="appointment__card-right">
      <section className="appointment__actions">
        <Button danger onClick={cancel}>Cancel</Button>
        {/* props.onSave calls the bookInterview function from useApplicationData */}
        <Button confirm onClick={() => props.onSave(student, interviewer, props.edit)}>Save</Button>
      </section>
    </section>
  </main>);
};
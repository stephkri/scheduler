import React from "react";
import "./styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import useVisualMode from "hooks/useVisualMode";

export default function Appointment(props) {
  /*
  These strings are used to indicate the current mode (state) of the component, as well as
  populate the history array (explained in useVisualMode).
  */
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode(
    // This argument is the initial visual mode of the component, and it depends on whether
    // an interview is defined in the appointment slot.
    props.interview ? SHOW : EMPTY
  );

  /*
  These two functions call the axios request functions (defined in useApplicationData) and
  coordinate their implication with the visual modes in the component. "save" is for booking
  or modifying an interview, and "destroy" is for cancelling one.
  */
  const save = function(name, interviewer, edit = false) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING, true);
    props.bookInterview(props.id, interview, edit)
    .then(transition(SHOW, true))
    .catch(e => {
      console.log(e);
      transition(ERROR_SAVE, true);
    })
  };
  const destroy = function() {
    transition(DELETING, true);
    props.cancelInterview(props.id)
    .then(transition(EMPTY, true))
    .catch(e => {
      console.log(e);
      transition(ERROR_DELETE, true);
    });
  };

  /*
  In this component, the child component displayed depends on the visual mode that is currently
  in state. The conditional statements are all made with the && operator, such that (for example)
  a Confirm component will render only when the visual mode is set to CONFIRM.
  */
  return (<article className="appointment">
    <Header time={props.time} />
    {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
    {mode === SHOW && props.interview && (
      <Show
        student={props.interview.student}
        interviewer={props.interview.interviewer}
        onDelete={() => transition(CONFIRM)}
        onEdit={() => transition(EDIT)}
      />
    )}
    {mode === CREATE && <Form interviewers={props.interviewers} edit={false} onCancel={back} onSave={save} />}
    {mode === SAVING && <Status message="Saving..." />}
    {mode === DELETING && <Status message="Deleting..." />}
    {mode === CONFIRM && <Confirm message="Are you sure you want to cancel this appointment?" onCancel={back} onConfirm={destroy} />}
    {mode === EDIT && <Form interviewers={props.interviewers} edit={true} student={props.interview.student} onCancel={back} onSave={save} />}
    {mode === ERROR_SAVE && <Error message="Could not save the appointment." onClose={back} />}
    {mode === ERROR_DELETE && <Error message="Could not cancel the appointment." onClose={back} />}
  </article>);
};
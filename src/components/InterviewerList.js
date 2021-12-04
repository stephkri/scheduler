import React from "react";
import InterviewerListItem from "./InterviewerListItem";
import "./InterviewerList.scss";
import PropTypes from 'prop-types';

export default function InterviewerList(props) {
  return (<section className="interviewers">
    <h4 className="interviewers__header text--light">Interviewer</h4>
    <ul className="interviewers__list">
      {props.interviewers.map(int => {
        return (<InterviewerListItem
          key={int.id}
          name={int.name}
          avatar={int.avatar}
          selected={int.id === props.interviewer}
          setInterviewer={() => props.onChange(int.id)} />);
      })}
    </ul>
  </section>);
};

InterviewerList.PropTypes = {
  interviewers: PropTypes.array.isRequired
};
import React from "react";
import "./styles.scss";
import Header from "./Header";
import Show from "./Show";
import Error from "./Error";
import Empty from "./Empty";
import Confirm from "./Confirm";
import Form from "./Form";
import useVisualMode from "../../hooks/useVisualMode";
import Status from "./Status";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const CONFIRM = "CONFIRM";
const DELETING = "DELETING";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };
    transition(SAVING);
    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch((error) => transition(ERROR_SAVE, true));
  }

  const remove = (event) => {
    transition(DELETING, true);
    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch((error) => transition(ERROR_DELETE, false));
  };

  console.log("this is props.id", props.id);
  return (
    <article className="appointment">
      <Header time={props.time} />

      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={save}
        />
      )}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(CREATE)}
        />
      )}

      {mode === CONFIRM && (
        <Confirm
          onCancel={() => {
            transition(SHOW);
          }}
          onConfirm={remove}
        />
      )}
      {mode === SAVING && <Status message={"saving"} />}
      {mode === DELETING && <Status message={"deleting"} />}
      {mode === EDIT && <Show onEdit={() => transition(CREATE)} />}
      {mode === ERROR_DELETE && (
        <Error message={"Error on delete"} onClose={back} />
      )}
      {mode === ERROR_SAVE && (
        <Error message={"Error on save"} onClose={back} />
      )}
    </article>
  );
}

export function getAppointmentsForDay(state, day) {
  let apppointmentIdArray = [];
  for (const currentDay of state.days) {
    if (currentDay.name === day) {
      apppointmentIdArray = currentDay.appointments;
    }
  }
  const result = apppointmentIdArray.map((appointmentId) => {
    return state.appointments[appointmentId];
  });
  return result;
}

export function getInterviewersForDay(state, day) {
  let interviewersIdArray = [];
  for (const currentDay of state.days) {
    if (currentDay.name === day) {
      interviewersIdArray = currentDay.interviewers;
    }
  }
  const result = interviewersIdArray.map((interviewersId) => {
    return state.interviewers[interviewersId];
  });
  return result;
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }
  const interviewInfo = state.interviewers[interview.interviewer];
  return {
    student: interview.student,
    interviewer: interviewInfo,
  };
}

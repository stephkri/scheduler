export function getAppointmentsForDay(state, day) {
  const arr = [];
  let correctDay = false;
  for (const oneDay of state.days) {
    if (oneDay.name === day) {
      correctDay = oneDay;
    }
  }
  if (correctDay) {
    for (const appointment of correctDay.appointments) {
      arr.push(state.appointments[appointment]);
    }
  }
  return arr;
};
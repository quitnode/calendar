export default function generateEvents({
  date = new Date(),
  count = 10,
  startHour = 9,
  endHour = 21,
  shortestEventMinutes = 15,
  granularityMinutes = 1,
  eventNames = standardEventNames
} = {}) {
  const startMoment = new Date(date.getFullYear(), date.getMonth(), date.getDate(), startHour, 0).getTime();
  const endMoment = new Date(date.getFullYear(), date.getMonth(), date.getDate(), endHour + 1, 0).getTime();
  const maxEventDuration = (endMoment - startMoment) / 4;
  const minEventDuration = shortestEventMinutes * 60 * 1000;
  const granularityDuration = granularityMinutes * 60 * 1000;

  const existingNames = {};

  const events = [...Array(count)].map(() => {
    const eventDurationPrecise = Math.random() * (maxEventDuration - minEventDuration) + minEventDuration;
    const eventDurationRounded = Math.floor(eventDurationPrecise / granularityDuration) * granularityDuration;
    const eventStartPrecise = startMoment + Math.random() * (endMoment - startMoment - eventDurationRounded);
    const eventStartRounded = Math.floor(eventStartPrecise / granularityDuration) * granularityDuration;
    let eventName = standardEventNames[Math.floor(Math.random() * eventNames.length)];
    if (existingNames[eventName]) {
      let index = 2;
      while (true) {
        const tryName = `${eventName} ${index}`;
        if (!existingNames[tryName]) {
          eventName = tryName;
          break;
        }
        else {
          index++; 
        }
      }
    }

    existingNames[eventName] = true;

    return {
      eventName,
      start: new Date(eventStartRounded),
      end: new Date(eventStartRounded + eventDurationRounded)
    };
  });

  return events;
}

export const standardEventNames = [
  'Software Daily Standup',
  'Emma, Steven, Peter Meeting Board Room',
  'Paul NRF project planning Finance Room',
  'Tobias Manufacturing Backlog Grooming Development Room',
  'Integration Testing',
  'Performance Discussion',
  'Sprint Planning',
  'Business Demo',
  'Release Cut'
];

function offsetDate(dt, hours) {

}
// @ts-check
import * as React from 'react';

import eventLayout, {eventsOverlap} from './eventLayout';
import './calendar.css';

/**
 * 
 * @param {{
 *  events?: ReturnType<typeof import('./generateEvents').default>
 *  className?: string
 *  onEventClick?: (ev: import('./eventLayout').ArrayElement<ReturnType<typeof import('./generateEvents').default>>) => void
 * }} params 
 * @returns 
 */
export default function Calendar({ events, className, onEventClick } = {}) {

  const columns = eventLayout(events);

  // any Date within current date
  const todayAnchor = events[0].start;
  const todayStart = new Date(todayAnchor.getFullYear(), todayAnchor.getMonth(), todayAnchor.getDate()).getTime();

  // any Date within the next day
  // (incrementing this way is safe in daylight savings switch, leap year/leap second and all other calendar quirks)
  const tomorrowAnchor = new Date(todayStart + (24 + 6) * 60 * 60 * 1000);
  const todayEnd = new Date(tomorrowAnchor.getFullYear(), tomorrowAnchor.getMonth(), tomorrowAnchor.getDate()).getTime();

  const labelHours = listDayHours(todayAnchor);

  return (
    <div className={'calendar' + (className && ' ' + className || '')}>
      <div className='hourBands' style={{
        gridColumnStart: 1,
        gridColumnEnd: columns.length + 2,
        gridRow: 1
      }}>
        {
          labelHours.map((hr, hrIndex) => {
            const hourDuration = (hrIndex + 1 < labelHours.length ? labelHours[hrIndex + 1].getTime() : todayEnd) - hr.getTime();
            const hourHeightPc = hourDuration * 100 / (todayEnd - todayStart);
            return (
              <div className={hrIndex % 2 ? 'hourBand hourOdd' : 'hourBand hourEven'}
                key={hr.getTime()}
                style={{
                  height: `${hourHeightPc}%`
                }}>
              </div>
            );
          })
        }
      </div>

      <div className='hourBar'>
        {
          labelHours.map((hr, hrIndex) => {
            const hourDuration = (hrIndex + 1 < labelHours.length ? labelHours[hrIndex + 1].getTime() : todayEnd) - hr.getTime();
            const hourHeightPc = hourDuration * 100 / (todayEnd - todayStart);
            return (
              <div className={hrIndex % 2 ? 'hour hourOdd' : 'hour hourEven'}
                key={hr.getTime()}
                style={{
                  height: `${hourHeightPc}%`
                }}>
                {hr.getHours()}:00
              </div>
            );
          })
        }
      </div>

      {
        columns.map((col, colIndex) => {
          return (
            <React.Fragment key={`column-${colIndex}`}>
              {
                col.map((ev, evIndex) => (
                  <EventTile
                    {...{
                      evIndex, colIndex,
                      ev,
                      todayStart, todayEnd,
                      columns,
                      onEventClick
                    }}/>
                ))
              }
            </React.Fragment>
          );
        })
      }
    </div>
  );
}

/**
 * @param {{
 *    evIndex: number
 *    colIndex: number
 *    ev: import('./eventLayout').ArrayElement<ReturnType<typeof import('./generateEvents').default>>
 *    todayStart: number
 *    todayEnd: number
 *    columns: ReturnType<typeof import('./generateEvents').default>[]
 *    onEventClick?: (ev: import('./eventLayout').ArrayElement<ReturnType<typeof import('./generateEvents').default>>) => void
 * }} params
 */
function EventTile({ evIndex, colIndex, ev, todayStart, todayEnd, columns, onEventClick }) {
  
  const totalHeightPc = (ev.end.getTime() - todayStart) * 100 / (todayEnd - todayStart);
  const paddingHeightPc = (ev.start.getTime() - todayStart) * 100 / (ev.end.getTime() - todayStart);
  const eventHeightPc = (ev.end.getTime() - ev.start.getTime()) * 100 / (ev.end.getTime() - todayStart)

  let durationMinutes = (ev.end.getTime() - ev.start.getTime()) / 1000 / 60;
  let durationHours = Math.floor(durationMinutes / 60);
  durationMinutes = durationMinutes - durationHours * 60;

  let spanColumns = 1;
  let overlapsAnyOtherEvents = null;
  for (let iExtraColumn = colIndex + 1; iExtraColumn < columns.length; iExtraColumn++) {
    const extraCol = columns[iExtraColumn];
    for (const otherEv of extraCol) {
      if (eventsOverlap(otherEv, ev)) {
        overlapsAnyOtherEvents = otherEv;
        break;
      }
    }
    if (overlapsAnyOtherEvents) break;
    else spanColumns++;
  }

  return (
    <div key={`event-${evIndex}`} className='eventContainer'
      style={{
        gridRow: 1,
        gridColumnStart: colIndex + 2,
        gridColumnEnd: colIndex + 2 + spanColumns,
        height: `${totalHeightPc}%`
      }}
      onClick={onEventClick && (() => onEventClick(ev))}>
      <div className='filler' style={{
        width: 0,
        height: `${paddingHeightPc}%`
      }}>
      </div>
      <div className='event'
        style={{
          height: `${eventHeightPc}%`,
          minHeight: `${eventHeightPc}%`
        }}>
        <div className='time'>{formatTime(ev.start)}</div>
        <div className='title'>{ev.eventName}</div>
        <div className='duration'>{durationHours ? <><span>{durationHours}</span>:</> : null}{(100 + durationMinutes).toString().slice(1)}{durationHours ? '' : 'min'}</div>
      </div>
    </div>
  );
}

/**
 * @param {Date} dateAnchor 
 * @returns {Date[]} 
 */
export function listDayHours(dateAnchor) {
  let moment = new Date(dateAnchor.getFullYear(), dateAnchor.getMonth(), dateAnchor.getDate());
  /** @type {Date[]} */
  const result = [];
  while (true) {
    if (moment.getFullYear() !== dateAnchor.getFullYear() || moment.getMonth() !== dateAnchor.getMonth() || moment.getDate() !== dateAnchor.getDate())
      break;

    result.push(moment);

    // step 1 hour ahead, but!!
    // some hours may have unusual duration, due to leap seconds
    // so we overstep into the next hour a little, then round back to whole hours
    moment = new Date(moment.getTime() + (60 + 10) * 60 * 1000);
    const excess = moment.getMilliseconds() + moment.getSeconds() * 1000 + moment.getMinutes() * 1000 * 60;
    moment = new Date(moment.getTime() - excess);
  }
  return result;
}

/** @param {Date} dt  */
export function formatTime(dt) {
  return dt.getHours() + ':' + (100 + dt.getMinutes()).toString().slice(1);
}

/** @param {Date} dt  */
export function monthStr(dt) {
  return monthNames[dt.getMonth()];
}

/** @param {Date} dt  */
export function weekdayStr(dt) {
  return weekdayNames[dt.getDay()];
}

const monthNames = 'January,February,March,April,May,June,July,August,September,October,November,December'.split(',');

const weekdayNames = 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday'.split(',');
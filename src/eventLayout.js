// @ts-check

/**
 * @param {ReturnType<typeof import('./generateEvents').default>} events
 * @returns {ReturnType<typeof import('./generateEvents').default>[]}
 */
export default function eventLayout(events) {
  const orderedEvents = events.sort((ev1, ev2) => ev1.start.getTime() - ev2.start.getTime() || ev1.end.getTime() - ev2.end.getTime());

  /** @type {typeof events[]} */
  const columns = [];
  for (const ev of orderedEvents) {
    let addedToColumn = false;
    for (const col of columns) {
      const lastEvent = col[col.length - 1];
      if (ev.start >= lastEvent.end) {
        col.push(ev);
        addedToColumn = true;
        break;
      }
    }

    if (!addedToColumn) {
      columns.push([ev]);
    }
  }

  return columns;
}

/**
 * @template ArrayType 
 * @typedef {ArrayType extends readonly (infer ElementType)[] ? ElementType : never} ArrayElement<ArrayType extends readonly unknown[]>
 * */

/**
 * 
 * @param {ArrayElement<ReturnType<typeof import('./generateEvents').default>>} ev1
 * @param {ArrayElement<ReturnType<typeof import('./generateEvents').default>>} ev2
 */
export function eventsOverlap(ev1, ev2) {
  return ev1.start <= ev2.end && ev1.end >= ev2.start;
}
// @ts-check
import * as React from 'react';
import Calendar, { formatTime, monthStr } from './calendar';
import generateEvents from './generateEvents';
import './app.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    let date = new Date();
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const events = generateEvents({date});
    this.state = {
      date,
      generated: { [date.toString()]: events },
      events
    }
  }

  setDate = (date) => {
    let generated = this.state.generated;
    let events = generated[date.toString()];
    if (!events) {
      events = generateEvents({ date });
      generated[date.toString()] = events;
    }

    this.setState({
      date,
      events,
      generated
    });
  };

  handleClickLeft = () => {
    let { date } = this.state;
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    date = new Date(date.getTime() - 6 * 60 * 60 * 1000);
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    this.setDate(date);
  };

  handleClickRight = () => {
    let { date } = this.state;
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    date = new Date(date.getTime() + (24 + 6) * 60 * 60 * 1000);
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    this.setDate(date);
  };

  handleDateChange = e => {
    const date = new Date(e.target.value);
    if (date.getFullYear()) this.setDate(date);
  };

  handleEventClick = ev => {
    alert(
`${formatTime(ev.start)} - ${formatTime(ev.end)}
${ev.eventName}`
    );
  };

  render() {
    const dateAnchor = this.state.date;
    return (
      <>
        <h2 className='title'>
          <button className='dateFlip dateFlipLeft' onClick={this.handleClickLeft}>&lt;</button>
          <span className='dateSelectorContainer'>
            {dateAnchor.getDate()} {monthStr(dateAnchor)} <span className='year'>{dateAnchor.getFullYear()}</span>
            <span className='hiddenSelectorContainer'>
              <input className='hiddenSelector'
                type='date'
                value={this.state.date.toISOString().split('T')[0]}
                onChange={this.handleDateChange}></input>
            </span>
          </span>
          <button className='dateFlip dateFlipLeft' onClick={this.handleClickRight}>&gt;</button>
        </h2>
        <Calendar className='calendar700px' events={this.state.events} onEventClick={this.handleEventClick} />
      </>
    );
  }
}
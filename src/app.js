// @ts-check
import * as React from 'react';
import Calendar from './calendar';
import generateEvents from './generateEvents';

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

  clickLeft = () => {
    let { date } = this.state;
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    date = new Date(date.getTime() - 6 * 60 * 60 * 1000);
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    this.setDate(date);
  };

  clickRight = () => {
    let { date } = this.state;
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    date = new Date(date.getTime() + (24 + 6) * 60 * 60 * 1000);
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    this.setDate(date);
  };

  onDateChange = (e) => {
    const date = new Date(e.target.value);
    if (date.getFullYear()) this.setDate(date);
  };

  render() {
    const dateAnchor = this.state.date;
    return (
      <>
        <h2>
          Calendar for {' '}
          <button onClick={this.clickLeft}>&lt;</button>
          <input type='date' value={this.state.date.toISOString().split('T')[0]} onChange={this.onDateChange}></input>
          <button onClick={this.clickRight}>&gt;</button>
        </h2>
        <Calendar events={this.state.events} />
      </>
    );
  }
}
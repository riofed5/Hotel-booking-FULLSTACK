import React from 'react';
import {Helmet} from 'react-helmet';
import DayPicker, {DateUtils} from 'react-day-picker';
import 'react-day-picker/lib/style.css';

export default class DaySelection extends React.Component {
    constructor(props) {
        super(props);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.handleResetClick = this.handleResetClick.bind(this);
        this.state = this.getInitialState();
        this.disabledDays = [
            new Date(2020, 5, 5),
            new Date(2020, 5, 12),
        ];
    }

    getInitialState() {
        return {
            from: undefined,
            to: undefined,
        };
    }

    checkDayValid = (listDays, start, end) => {

        const dayAvaiable = listDays.find(day => DateUtils.isDayBetween(day, start, end));
        return dayAvaiable;
    }

    handleDayClick(day, modifiers = {}) {
        if (modifiers.disabled) {
            return;
        }
        const range = DateUtils.addDayToRange(day, this.state);
        
        let validDay;
        if (range.to && range.from) {
            validDay = this.checkDayValid(this.disabledDays, range.from, range.to);
            if (validDay) {
                const result = new Date(validDay.getTime());
                result.setDate(result.getDate() - 1);
                range.to = result;
            }
        }
        this.setState(range);
        this.props.handleDaySelection(range.from, range.to);

    }

    handleResetClick() {
        this.setState(this.getInitialState());
    }

    render() {

        const {from, to} = this.state;
        const modifiers = {start: from, end: to};
        return (
            <div className="RangeExample">
                <p>
                    {!from && !to && 'Please select the first day.'}
                    {from && !to && 'Please select the last day.'}
                    {from &&
                        to &&
                        `Selected from ${from.toLocaleDateString()} to
                ${to.toLocaleDateString()}`}{' '}
                    {from && to && (
                        <button className="link" onClick={this.handleResetClick}>
                            Reset
            </button>
                    )}
                </p>
                <DayPicker
                    className="Selectable"
                    numberOfMonths={2}
                    selectedDays={[from, {from, to}]}
                    modifiers={modifiers}
                    onDayClick={this.handleDayClick}
                    disabledDays={this.disabledDays}
                />
                <Helmet>
                    <style>{`
  .Selectable .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
    background-color: #f0f8ff !important;
    color: #4a90e2;
  }
  .Selectable .DayPicker-Day {
    border-radius: 0 !important;
  }
  .Selectable .DayPicker-Day--start {
    border-top-left-radius: 50% !important;
    border-bottom-left-radius: 50% !important;
  }
  .Selectable .DayPicker-Day--end {
    border-top-right-radius: 50% !important;
    border-bottom-right-radius: 50% !important;
  }
`}</style>
                </Helmet>
            </div>
        );
    }
}

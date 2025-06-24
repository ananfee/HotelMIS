import React, { useState } from 'react';
import { DateRange } from 'react-date-range';
import { addDays } from 'date-fns';
import ru from 'date-fns/locale/ru';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './DateRangePicker.css';

function DateRangePicker({ onChange }) {
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: 'selection',
    },
  ]);

  const handleSelect = (ranges) => {
    setDateRange([ranges.selection]);
    if (onChange) {
      onChange(ranges.selection);
    }
  };

  const customTheme = {
    borderRadius: '20px',
    selectionColor: '#230608',
    selectionBgColor: '#230608',
    selectionTextColor: '#fff',
    daySelectedBgColor: '#230608',
    daySelectedBorderRadius: '20px',
    dayHoverBgColor: '#f0e6e6',
  };

  return (
    <div className="calendar-wrapper">
      <DateRange
        editableDateInputs={true}
        onChange={handleSelect}
        moveRangeOnFirstSelection={false}
        ranges={dateRange}
        months={2}
        direction="horizontal"
        locale={ru}
        rangeColors={['#230608']}
        theme={customTheme}
      />
    </div>
  );
}

export default DateRangePicker;




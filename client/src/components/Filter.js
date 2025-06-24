import React, { useState, useRef, useEffect } from 'react';
import './Filter.css';
import { DateRange } from 'react-date-range';
import { ReactComponent as SearchIcon } from '../icons/search.svg';
import { ReactComponent as TrashIcon } from '../icons/trash.svg';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { ru } from 'date-fns/locale';

const Filter = ({ onFilter = () => {} }) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: undefined,
      endDate: undefined,
      key: 'selection',
    },
  ]);
  const [guests, setGuests] = useState(null);
  const [filterApplied, setFilterApplied] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setCalendarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString('ru-RU') : 'Выберите дату';
  };

  const formatGuests = () => {
    if (guests === null) return 'Количество гостей';
    return `${guests} гост${guests === 1 ? 'ь' : guests < 5 ? 'я' : 'ей'}`;
  };

  const handleReset = () => {
    setDateRange([
      {
        startDate: undefined,
        endDate: undefined,
        key: 'selection',
      },
    ]);
    setGuests(null);
    setFilterApplied(false);
    onFilter({ checkIn: null, checkOut: null, guests: null });
  };

  const handleSearch = () => {
    const { startDate, endDate } = dateRange[0];
    if (startDate && endDate && guests !== null) {
      onFilter({
        checkIn: startDate,
        checkOut: endDate,
        guests,
      });
      setFilterApplied(true);
      setCalendarOpen(false);
    }
  };

  return (
    <div className="filter-wrapper" ref={wrapperRef}>
      <div className="filter-row">
        <div className="filter-center">
          <div className="filter-container">
            <div className="filter-field">
              <label>Заезд</label>
              <button
                className="plain-button"
                onClick={() => setCalendarOpen(!calendarOpen)}
              >
                {formatDate(dateRange[0].startDate)}
              </button>
            </div>

            <div className="divider" />

            <div className="filter-field">
              <label>Выезд</label>
              <button
                className="plain-button"
                onClick={() => setCalendarOpen(!calendarOpen)}
              >
                {formatDate(dateRange[0].endDate)}
              </button>
            </div>

            <div className="divider" />

            <div className="filter-field">
              <label>Гости</label>
              <button
                className="plain-button"
                onClick={() =>
                  setGuests((prev) => {
                  if (prev === null || prev >= 4) return 1;
                  return prev + 1;
                })
                }
              >
                {formatGuests()}
              </button>
            </div>

            <button className="btn-search" onClick={handleSearch} title="Поиск">
              <SearchIcon />
            </button>
          </div>

          {calendarOpen && (
            <div className="calendar-wrapper">
              <DateRange
                ranges={[
                  {
                    startDate: dateRange[0].startDate || new Date(),
                    endDate: dateRange[0].endDate || new Date(),
                    key: 'selection',
                  },
                ]}
                onChange={(item) => setDateRange([item.selection])}
                moveRangeOnFirstSelection={false}
                editableDateInputs={true}
                rangeColors={['#3d91ff']}
                locale={ru}
                months={2}
                direction="horizontal"
                minDate={new Date()}
              />
            </div>
          )}
        </div>

        <div className="filter-reset">
          <button
            className="btn-reset"
            onClick={handleReset}
            title="Сбросить фильтр"
            style={{ visibility: filterApplied ? 'visible' : 'hidden' }}
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filter;

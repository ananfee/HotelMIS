import React from "react";
import "./CheckInCard.css";

const CheckInCard = ({ room, dates, totalPrice, actualDates, guestsCount, residents }) => {
  const residentsCount = residents.length;

  return (
    <div className="checkin-card">
      <div className="checkin-header">
        <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Заселение</span>
        <span className="room-number">{room}</span>
      </div>
      <div className="checkin-dates">Плановые даты: {dates}</div>
      <div className="checkin-dates">Фактические даты: {actualDates}</div>
      <div className="checkin-subtitle">Проживающие ({residentsCount} {residentsCount === 1 ? "человек" : "человека"})</div>
      <div className="checkin-divider"></div>
      <div className="checkin-guests">
        {residents.map((resident, index) => (
          <div key={index}>{resident}</div>
        ))}
      </div>
      <div className="checkin-buttons">
        <div className="amount-price">Итого: {totalPrice} ₽</div>
        <button className="btn btn-primary">Выселить</button>
      </div>
    </div>
  );
};

export default CheckInCard;

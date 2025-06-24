import React, { useEffect, useState } from "react";
import CheckInCard from "../components/CheckInCard";
import Search from "../components/Search";

const GuestsPage = () => {
  const [checkInData, setCheckInData] = useState([]);

  useEffect(() => {
    const loadCheckIns = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/checkIns");
        const data = await res.json();
        const checkIns = data._embedded.checkIns;

        const enrichedCheckIns = await Promise.all(
          checkIns.map(async (checkIn) => {
            // Грузим гостей
            const guestsRes = await fetch(checkIn._links.guests.href);
            const guestsData = await guestsRes.json();
            const guests = guestsData._embedded?.guests || [];

            // Грузим комнату
            const roomRes = await fetch(checkIn._links.room.href);
            const roomData = await roomRes.json();

            // Составляем итоговые данные
            return {
              room: roomData.roomNumber || "N/A",  // проверка, чтобы не упасть если нет number
              dates: `${checkIn.plannedCheckInDate} - ${checkIn.plannedCheckOutDate}`,
              actualDates: `${checkIn.actualCheckInDate} - ${checkIn.actualCheckOutDate || "—"}`,
              residents: guests.map(g => `${g.lastName} ${g.firstName} ${g.middleName}`),
              totalPrice: checkIn.totalAmount
            };
          })
        );

        setCheckInData(enrichedCheckIns);
      } catch (err) {
        console.error("Ошибка при загрузке данных:", err);
      }
    };

    loadCheckIns();
  }, []);

  return (
    <div style={{ padding: '20px 20px 0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Search />
      </div>

      <div className="rooms-list">
        {checkInData.map((item, index) => (
          <CheckInCard
            key={index}
            room={item.room}
            dates={item.dates}
            actualDates={item.actualDates}
            residents={item.residents}
            totalPrice={item.totalPrice}
          />
        ))}
      </div>
    </div>
  );
};

export default GuestsPage;

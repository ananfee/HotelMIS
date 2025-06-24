import React, { useState, useRef, useEffect } from 'react';
import './CheckInModal.css';
import { ReactComponent as CloseIcon } from '../icons/close-circle.svg';
import guestIcon from '../icons/guests.svg';
import './EmptyCheckInModal.css';

function EmptyCheckInModal({ isOpen, onClose, booking }) {
  const [guests, setGuests] = useState([]);
  const [hasBabyBed, setHasBabyBed] = useState(false);
  const [documentTypes, setDocumentTypes] = useState([]);
  const scrollRef = useRef(null);

  const room = booking?.room;
  const plannedCheckInDate = booking?.plannedCheckInDate;
  const plannedCheckOutDate = booking?.plannedCheckOutDate;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const pricePerNight = room?.pricePerNight || 7500;

  const parseDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return isNaN(d.getTime()) ? null : d;
  };

  const startDate = parseDate(plannedCheckInDate) || new Date();
  const endDate =
    parseDate(plannedCheckOutDate) ||
    (() => {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      return d;
    })();

  const calcTotalPrice = (start, end, basePrice) => {
    let total = 0;
    let nightsCount = 0;
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      let dayPrice = basePrice;
      const dayOfWeek = d.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        dayPrice *= 1.1;
      }
      total += dayPrice;
      nightsCount++;
    }
    if (nightsCount > 10) total *= 0.95;
    return { total: Math.round(total), nights: nightsCount };
  };

  const { total: totalPrice, nights } = calcTotalPrice(startDate, endDate, pricePerNight);

  const emptyGuest = () => ({
    surname: '',
    name: '',
    patronymic: '',
    phone: '',
    documentType: '',
    documentNumber: '',
  });

  useEffect(() => {
    if (!isOpen) {
      setGuests([]);
      setHasBabyBed(false);
      setDocumentTypes([]);
      return;
    }

    console.log('Открытие модального окна');
    console.log('booking:', booking);

    const guestLink = booking?.fullBooking?._links?.guest?.href;

    fetch('http://localhost:8080/api/documentTypes')
      .then((res) => res.json())
      .then((data) => {
        const types = data._embedded ? data._embedded.documentTypes : data;
        console.log('Загруженные типы документов:', types);
        setDocumentTypes(types);

        if (guestLink) {
          return fetch(guestLink)
            .then((res) => {
              if (!res.ok) throw new Error('Ошибка при получении гостя по ссылке.');
              return res.json();
            })
            .then((guest) => {
              console.log('Гость из бронирования загружен:', guest);

              const docTypeHref =
                guest.documentType?._links?.self?.href || (types.length > 0 ? types[0]._links.self.href : '');

              setGuests([
                {
                  surname: guest.lastName || '',
                  name: guest.firstName || '',
                  patronymic: guest.middleName || '',
                  phone: guest.phoneNumber || '',
                  documentNumber: guest.documentNumber || '',
                  documentType: docTypeHref,
                  id: guest.id,
                },
              ]);
            });
        } else {
          setGuests([emptyGuest()]);
        }
      })
      .catch((err) => {
        console.error('Ошибка при загрузке:', err);
        alert(`Ошибка: ${err.message}`);
        setGuests([emptyGuest()]);
      });

    setHasBabyBed(booking?.childBed || false);
  }, [isOpen, booking]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [guests]);

  const addGuestForm = () => setGuests((prev) => [...prev, emptyGuest()]);

  const removeGuestForm = (indexToRemove) =>
    setGuests((prev) => prev.filter((_, index) => index !== indexToRemove));

  const handleInputChange = (index, field, value) => {
    setGuests((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const normalizePhone = (phone) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('8')) {
    return '+7' + digits.slice(1); // 8903 → +7903
  }
  if (digits.length === 11 && digits.startsWith('7')) {
    return '+7' + digits.slice(1); // 7903 → +7903
  }
  if (digits.length === 10) {
    return '+7' + digits; // 9039843164 → +79039843164
  }
  return '+' + digits; // fallback
};

  const findGuestByPhoneNumber = async (phoneNumber) => {
    if (!phoneNumber) return null;
    const normalizedPhone = normalizePhone(phoneNumber);
    console.log('Ищем гостя по телефону:', normalizedPhone);
    const url = `http://localhost:8080/api/guests/search/findByPhoneNumber?phoneNumber=${encodeURIComponent(
      normalizedPhone
    )}`;
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const data = await resp.json();
    if (data._embedded && data._embedded.guests && data._embedded.guests.length > 0) {
      console.log('Гость найден по телефону:', data._embedded.guests[0]);
      return data._embedded.guests[0];
    }
    return null;
  };

  const handleSubmit = async () => {
    try {
      for (let i = 0; i < guests.length; i++) {
        const g = guests[i];
        if (
          !g.surname.trim() ||
          !g.name.trim() ||
          !g.phone.trim() ||
          !g.documentType ||
          !g.documentNumber.trim()
        ) {
          alert(`Пожалуйста, заполните все обязательные поля для гостя №${i + 1}.`);
          return;
        }
      }

      const guestLinks = [];

      for (const guest of guests) {
        const phone = guest.phone.trim();

        // Поиск гостя по телефону
        const foundGuest = await findGuestByPhoneNumber(phone);

        if (foundGuest) {
          guestLinks.push(foundGuest._links.self.href);
        } else {
          // Создаем нового гостя, если не найден
          const guestData = {
            lastName: guest.surname.trim(),
            firstName: guest.name.trim(),
            middleName: guest.patronymic.trim(),
            phoneNumber: phone,
            documentNumber: guest.documentNumber.trim(),
            documentType: guest.documentType,
          };

          const guestResp = await fetch('http://localhost:8080/api/guests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(guestData),
          });

          if (!guestResp.ok) {
            const errorText = await guestResp.text();
            throw new Error(`Ошибка создания гостя: ${errorText}`);
          }

          const createdGuest = await guestResp.json();
          guestLinks.push(createdGuest._links.self.href);
        }
      }

      // Получаем ссылку на комнату
      const roomLink = room?._links?.self?.href || `http://localhost:8080/api/rooms/${room?.id}`;

      const formatDateString = (date) => {
        const d = new Date(date);
        return d.toISOString().split('T')[0];
      };

      const actualCheckInDate = new Date().toISOString();

      const plannedCheckInDateFormatted = booking?.plannedCheckInDate
        ? formatDateString(booking.plannedCheckInDate)
        : formatDateString(new Date());
      const plannedCheckOutDateFormatted = booking?.plannedCheckOutDate
        ? formatDateString(booking.plannedCheckOutDate)
        : formatDateString(new Date(Date.now() + 24 * 60 * 60 * 1000));

      const checkInData = {
        room: roomLink,
        plannedCheckInDate: plannedCheckInDateFormatted,
        plannedCheckOutDate: plannedCheckOutDateFormatted,
        actualCheckInDate: actualCheckInDate,
        childBed: hasBabyBed,
        totalAmount: totalPrice,
        guests: guestLinks,
        employee: 'http://localhost:8080/api/employees/1', // обнови ID сотрудника по необходимости
        booking: `http://localhost:8080/api/bookings/${booking.id}`,
      };

      const checkInResp = await fetch('http://localhost:8080/api/checkIns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkInData),
      });

      if (!checkInResp.ok) {
        const errorText = await checkInResp.text();
        throw new Error(`Ошибка создания заселения: ${errorText}`);
      }

      // ** Здесь добавляем обновление статуса брони **
      const statusUrl = `http://localhost:8080/api/bookings/${booking.id}/bookingStatus`;
      const statusBody = 'http://localhost:8080/api/bookingStatuses/2';

      const statusResp = await fetch(statusUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'text/uri-list',
        },
        body: statusBody,
      });

      if (!statusResp.ok) {
        const errorText = await statusResp.text();
        throw new Error(`Ошибка обновления статуса брони: ${errorText}`);
      }
      // ** Конец обновления статуса **

      alert('Заселение успешно выполнено!');
      onClose();
    } catch (err) {
      alert(`Ошибка: ${err.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Введите данные для заселения</h2>
          <button className="close-button" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <span>
              Номер {room?.roomNumber || 'не указан'} | {formatDate(plannedCheckInDate)} – {formatDate(plannedCheckOutDate)}
            </span>
            <div className="amenity amenity-guests" style={{ display: 'flex', alignItems: 'center' }}>
              <img src={guestIcon} alt="Гости" style={{ marginRight: '4px' }} />
              <span>{room.capacity}</span>
            </div>
          </div>

    

          <div className="scrollable-area" ref={scrollRef}>
            {guests.map((guest, index) => (
              <div key={index} className={`guest-block ${index === 0 ? 'first' : ''}`}>
                <div className="guest-header">
                  <p>Гость №{index + 1}</p>
                  {index !== 0 && (
                    <button
                      className="remove-guest-button"
                      onClick={() => removeGuestForm(index)}
                      title="Удалить гостя"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Фамилия *</label>
                    <input
                      type="text"
                      value={guest.surname}
                      onChange={(e) => handleInputChange(index, 'surname', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Имя *</label>
                    <input
                      type="text"
                      value={guest.name}
                      onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Отчество</label>
                    <input
                      type="text"
                      value={guest.patronymic}
                      onChange={(e) => handleInputChange(index, 'patronymic', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Телефон *</label>
                    <input
                      type="tel"
                      value={guest.phone}
                      onChange={(e) => handleInputChange(index, 'phone', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Тип документа *</label>
                    <select
                      value={guest.documentType}
                      onChange={(e) => handleInputChange(index, 'documentType', e.target.value)}
                    >
                      <option value="">Выберите тип документа</option>
                      {documentTypes.map((type) => (
                        <option key={type.id} value={type._links.self.href}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Номер документа *</label>
                    <input
                      type="text"
                      value={guest.documentNumber}
                      onChange={(e) => handleInputChange(index, 'documentNumber', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <label className="checkbox-label">
            <input type="checkbox" checked={hasBabyBed} onChange={(e) => setHasBabyBed(e.target.checked)} />
            Детская кровать
          </label>

          <div style={{ marginTop: '10px' }}>
            <button className="add-guest-button" onClick={addGuestForm}>
              Добавить гостя
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <p>
            <strong>
              Итого за {nights} ноч
              {nights === 1 ? 'ь' : nights < 5 ? 'и' : 'ей'}: {totalPrice} ₽
            </strong>
          </p>
          <button className="checkin-button" onClick={handleSubmit}>
            Заселить
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmptyCheckInModal;

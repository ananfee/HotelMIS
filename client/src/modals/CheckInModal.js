import React, { useState, useRef, useEffect } from 'react';
import './CheckInModal.css';
import { ReactComponent as CloseIcon } from '../icons/close-circle.svg';
import guestIcon from '../icons/guests.svg';

function CheckInModal({ isOpen, onClose, room, checkIn, checkOut, guests: guestsCount }) {
  const [guests, setGuests] = useState([]);
  const [hasBabyBed, setHasBabyBed] = useState(false);
  const [documentTypes, setDocumentTypes] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (guests.length === 0) {
        setGuests([emptyGuest()]);
      }

      fetch('http://localhost:8080/api/documentTypes')
        .then(res => res.json())
        .then(data => {
          const types = data._embedded ? data._embedded.documentTypes : data;
          setDocumentTypes(types);
        })
        .catch(err => {
          console.error(err);
          alert(`Ошибка загрузки типов документов: ${err.message}`);
        });
    } else {
      setGuests([]);
      setHasBabyBed(false);
      setDocumentTypes([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [guests]);

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollBarWidth}px`;
      document.body.dataset.scrollY = scrollY;
    } else {
      const scrollY = document.body.dataset.scrollY;
      document.body.style = '';
      window.scrollTo(0, parseInt(scrollY || '0', 10));
    }

    return () => {
      document.body.style = '';
    };
  }, [isOpen]);

  const emptyGuest = () => ({
    surname: '',
    name: '',
    patronymic: '',
    phone: '',
    documentType: '',
    documentNumber: '',
  });

  const addGuestForm = () => {
  setGuests(prev => {
    if (prev.length >= 4) {
      alert('Максимум 4 гостя можно добавить.');
      return prev;
    }
    return [...prev, emptyGuest()];
  });
};


  const removeGuestForm = indexToRemove => {
    setGuests(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleInputChange = (index, field, value) => {
    setGuests(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const parseDate = date => {
    if (!date) return null;
    const d = new Date(date);
    return isNaN(d.getTime()) ? null : d;
  };

  const formatDateString = dateStr => {
    const d = parseDate(dateStr);
    if (!d) return '';
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const startDate = parseDate(checkIn) || new Date();
  const endDate = parseDate(checkOut) || (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  })();

  const formatDate = date => (date ? new Intl.DateTimeFormat('ru-RU').format(date) : '...');

  const calcTotalPrice = (start, end, basePrice) => {
    let total = 0;
    let nightsCount = 0;
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      let dayPrice = basePrice;
      const dayOfWeek = d.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        dayPrice *= 1.10;
      }
      total += dayPrice;
      nightsCount++;
    }
    if (nightsCount > 10) total *= 0.95;
    return { total: Math.round(total), nights: nightsCount };
  };

  const pricePerNight = room?.pricePerNight || 7500;
  const { total: totalPrice, nights } = calcTotalPrice(startDate, endDate, pricePerNight);

  const handleSubmit = async () => {
    try {
      for (let i = 0; i < guests.length; i++) {
        const g = guests[i];
        if (!g.surname.trim() || !g.name.trim() || !g.phone.trim() || !g.documentType || !g.documentNumber.trim()) {
          alert(`Пожалуйста, заполните все обязательные поля для гостя №${i + 1}.`);
          return;
        }
      }

      const guestLinks = [];
      for (const guest of guests) {
        const guestData = {
          lastName: guest.surname.trim(),
          firstName: guest.name.trim(),
          middleName: guest.patronymic.trim(),
          phoneNumber: guest.phone.trim(),
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

      const roomLink = room?._links?.self?.href || `http://localhost:8080/api/rooms/${room.id}`;
      const actualCheckInDate = formatDateString(new Date());

      const checkInData = {
        room: roomLink,
        plannedCheckInDate: formatDateString(checkIn),
        plannedCheckOutDate: formatDateString(checkOut),
        actualCheckInDate: actualCheckInDate,
        childBed: hasBabyBed,
        totalAmount: totalPrice,
        guests: guestLinks,
        employee: "http://localhost:8080/api/employees/1"
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
          <button className="close-button" onClick={onClose}><CloseIcon /></button>
        </div>

        <div className="modal-body">
          <div style={{ marginTop: '10px',display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <span>
          Номер {room?.roomNumber} | {formatDate(startDate)} - {formatDate(endDate)}
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
                    <button className="remove-guest-button" onClick={() => removeGuestForm(index)}>✕</button>
                  )}
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Фамилия *</label>
                    <input type="text" value={guest.surname} onChange={e => handleInputChange(index, 'surname', e.target.value)} style={{ paddingLeft: '15px' }} />
                  </div>
                  <div className="form-group">
                    <label>Имя *</label>
                    <input type="text" value={guest.name} onChange={e => handleInputChange(index, 'name', e.target.value)} style={{ paddingLeft: '15px' }} />
                  </div>
                  <div className="form-group">
                    <label>Отчество</label>
                    <input type="text" value={guest.patronymic} onChange={e => handleInputChange(index, 'patronymic', e.target.value)} style={{ paddingLeft: '15px' }} />
                  </div>
                  <div className="form-group">
                    <label>Номер телефона *</label>
                    <input type="tel" value={guest.phone} onChange={e => handleInputChange(index, 'phone', e.target.value)} style={{ paddingLeft: '15px' }} />
                  </div>
                  <div className="form-group">
                    <label>Тип документа *</label>
                    <div className="custom-select-container">
                        <select
                        value={guest.documentType}
                        onChange={e => handleInputChange(index, 'documentType', e.target.value)}
                        >
                        <option value="">Выберите тип</option>
                        {documentTypes.map(type => (
                            <option key={type._links.self.href} value={type._links.self.href}>
                            {type.name}
                            </option>
                        ))}
                        </select>
                        <span className="custom-arrow" style={{ marginRight: '6px' }}>▼</span>
                    </div>
                    </div>
                  <div className="form-group">
                    <label>Номер документа *</label>
                    <input type="text" value={guest.documentNumber} onChange={e => handleInputChange(index, 'documentNumber', e.target.value)} style={{ paddingLeft: '15px' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <label className="checkbox-label">
            <input type="checkbox" checked={hasBabyBed} onChange={e => setHasBabyBed(e.target.checked)} />
            Детская кровать
          </label>

          <div style={{ marginTop: '10px' }}>
            <button className="add-guest-button" onClick={addGuestForm}>Добавить гостя</button>
          </div>
        </div>

        <div className="modal-footer">
          <p><strong>Итого за {nights} ноч{nights === 1 ? 'ь' : nights < 5 ? 'и' : 'ей'}: {totalPrice} ₽</strong></p>
          <button className="checkin-button" onClick={handleSubmit}>Заселить</button>
        </div>
      </div>
    </div>
  );
}

export default CheckInModal;




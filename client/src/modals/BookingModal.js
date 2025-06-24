import React, { useEffect, useState } from 'react';
import './BookingModal.css';
import { ReactComponent as CloseIcon } from '../icons/close-circle.svg';

function BookingModal({ isOpen, onClose, room, checkIn, checkOut }) {
  const [form, setForm] = useState({
    surname: '',
    name: '',
    patronymic: '',
    phone: '',
    documentType: '',
    documentNumber: '',
    babyBed: false,
  });

  const [documentTypes, setDocumentTypes] = useState([]);

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
      const scrollY = document.body.dataset.scrollY;
      document.body.style = '';
      window.scrollTo(0, parseInt(scrollY || '0'));
      resetForm();
    }

    return () => {
      document.body.style = '';
    };
  }, [isOpen]);

  const resetForm = () => {
    setForm({
      surname: '',
      name: '',
      patronymic: '',
      phone: '',
      documentType: '',
      documentNumber: '',
      babyBed: false,
    });
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async () => {
    if (
      !form.surname.trim() ||
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.documentType ||
      !form.documentNumber.trim()
    ) {
      alert('Пожалуйста, заполните все обязательные поля.');
      return;
    }

    const guestData = {
      lastName: form.surname.trim(),
      firstName: form.name.trim(),
      middleName: form.patronymic.trim(),
      phoneNumber: form.phone.trim(),
      documentNumber: form.documentNumber.trim(),
      documentType: form.documentType,
      babyBed: form.babyBed
    };

    try {
      const guestResponse = await fetch('http://localhost:8080/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guestData),
      });

      if (!guestResponse.ok) {
        const errorText = await guestResponse.text();
        throw new Error(`Ошибка создания гостя: ${errorText}`);
      }

      const guestJson = await guestResponse.json();
      const guestUrl = guestJson._links?.self?.href;

      if (!guestUrl) {
        throw new Error('Не удалось получить ссылку на нового гостя');
      }

      const today = formatDate(new Date());
      const bookingData = {
        guest: guestUrl,
        room: room._links?.self.href || `http://localhost:8080/api/rooms/${room.id}`,
        bookingDate: today,
        plannedCheckInDate: formatDate(checkIn),
        plannedCheckOutDate: formatDate(checkOut),
        bookingStatus: 'http://localhost:8080/api/bookingStatuses/1',
        childBed: form.babyBed,
        employee: 'http://localhost:8080/api/employees/1'
      };

      const bookingResponse = await fetch('http://localhost:8080/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      if (!bookingResponse.ok) {
        const errorText = await bookingResponse.text();
        throw new Error(`Ошибка создания бронирования: ${errorText}`);
      }

      alert('Бронирование успешно создано!');
      resetForm();
      onClose();

    } catch (err) {
      alert(`Ошибка: ${err.message}`);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Введите данные для бронирования</h2>
          <button className="close-button" onClick={handleClose}>
            <CloseIcon />
          </button>
        </div>
        <div className="modal-body">
          <p>
            Номер {room.roomNumber} &nbsp;|&nbsp;
            {checkIn ? checkIn.toLocaleDateString() : '...'} - {checkOut ? checkOut.toLocaleDateString() : '...'}
          </p>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="surname">Фамилия *</label>
              <input type="text" id="surname" value={form.surname} onChange={handleChange} style={{ paddingLeft: '15px' }} />
            </div>
            <div className="form-group">
              <label htmlFor="name">Имя *</label>
              <input type="text" id="name" value={form.name} onChange={handleChange} style={{ paddingLeft: '15px' }}  />
            </div>
            <div className="form-group">
              <label htmlFor="patronymic">Отчество</label>
              <input type="text" id="patronymic" value={form.patronymic} onChange={handleChange} style={{ paddingLeft: '15px' }}  />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Номер телефона *</label>
              <input type="tel" id="phone" value={form.phone} onChange={handleChange} style={{ paddingLeft: '15px' }} />
            </div>
            <div className="form-group">
              <label htmlFor="documentType">Тип документа *</label>
              <select id="documentType" value={form.documentType} onChange={handleChange}>
                <option value="">Выберите тип документа</option>
                {documentTypes.map(type => (
                  <option key={type._links.self.href} value={type._links.self.href}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="documentNumber">Номер документа *</label>
              <input type="text" id="documentNumber" value={form.documentNumber} onChange={handleChange} style={{ paddingLeft: '15px' }} />
            </div>
          </div>

          <label className="checkbox-label">
            <input type="checkbox" id="babyBed" checked={form.babyBed} onChange={handleChange} />
            Детская кровать
          </label>
        </div>
        <div className="modal-f">
          <button className="checkin-butt" onClick={handleSubmit}>
            Забронировать
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingModal;



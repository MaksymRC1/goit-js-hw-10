import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const datetimePicker = document.getElementById('datetime-picker');
const startButton = document.querySelector('[data-start]');
const daysSpan = document.querySelector('[data-days]');
const hoursSpan = document.querySelector('[data-hours]');
const minutesSpan = document.querySelector('[data-minutes]');
const secondsSpan = document.querySelector('[data-seconds]');

let timerInterval = null;
let selectedDate = null;

startButton.disabled = true;

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function updateTimerUI({ days, hours, minutes, seconds }) {
  daysSpan.textContent = addLeadingZero(days);
  hoursSpan.textContent = addLeadingZero(hours);
  minutesSpan.textContent = addLeadingZero(minutes);
  secondsSpan.textContent = addLeadingZero(seconds);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  // Кнопка старту залишається вимкненою
  startButton.disabled = true;
  // Тільки датапікер стає активним
  datetimePicker.disabled = false;
}

function startTimer() {
  if (!selectedDate) return;

  startButton.disabled = true;
  datetimePicker.disabled = true;

  timerInterval = setInterval(() => {
    const remainingTime = selectedDate - Date.now();

    if (remainingTime <= 0) {
      stopTimer();
      updateTimerUI({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const timeComponents = convertMs(remainingTime);
    updateTimerUI(timeComponents);
  }, 1000);
}

flatpickr(datetimePicker, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] && selectedDates[0].getTime() > Date.now()) {
      selectedDate = selectedDates[0].getTime();
      startButton.disabled = false;
    } else if (selectedDates[0] && selectedDates[0].getTime() <= Date.now()) {
      // Використовуємо iziToast замість alert
      iziToast.error({
        title: '❌ Помилка',
        message: 'Будь ласка, виберіть дату в майбутньому',
        position: 'topRight',
        timeout: 3000,
      });
      startButton.disabled = true;
      selectedDate = null;
    } else {
      startButton.disabled = true;
      selectedDate = null;
    }
  },
});

startButton.addEventListener('click', startTimer);

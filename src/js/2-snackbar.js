import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const createPromise = (delay, state) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      state === 'fulfilled' ? resolve(delay) : reject(delay);
    }, delay);
  });
};

const form = document.querySelector('.form');

form.addEventListener('submit', event => {
  event.preventDefault();

  const { delay, state } = form.elements;

  createPromise(Number(delay.value), state.value)
    .then(delay => {
      console.log(`✅ Fulfilled promise in ${delay}ms`);
      iziToast.success({
        title: 'Success',
        message: `✅ Fulfilled promise in ${delay}ms`,
        position: 'topRight',
      });
    })
    .catch(delay => {
      console.log(`❌ Rejected promise in ${delay}ms`);
      iziToast.error({
        title: 'Error',
        message: `❌ Rejected promise in ${delay}ms`,
        position: 'topRight',
      });
    });
});

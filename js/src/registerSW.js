if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
  .then(registration => console.log('Service Worker is installed: ', registration.scope) )
  .catch(err => console.log('Failed to register Service Worker: ', err) );
}

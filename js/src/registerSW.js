this.registerServiceWorker();

function registerServiceWorker() {
  // return early if SW is not supported
  if (!navigator.serviceWorker) return;
  // if SW is supported register SW at root
  navigator.serviceWorker.register('/sw.js')
  .then(registration => {
    // registration success message
    console.log('Service Worker is installed');
  }).catch(err => {
    // custom error message
    console.log('Failed to register Service Worker: ', err);
  });
}

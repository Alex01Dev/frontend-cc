// creado para activar el service worker en CRA
export function register(config) {
  if ('serviceWorker' in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      navigator.serviceWorker
        .register(swUrl)
        .then(registration => {
          console.log("Service Worker registrado:", registration);
        })
        .catch(error => {
          console.error("Error al registrar el Service Worker:", error);
        });
    });
  }
}

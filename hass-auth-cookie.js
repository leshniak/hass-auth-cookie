import jsCookie from 'https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/+esm';

const cookieName = 'hass_access_token';
let timeoutId = null;

async function handleConnection() {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  jsCookie.remove(cookieName);

  const { auth } = await window.hassConnection;
  const token = auth.accessToken;
  const expires = auth.data.expires;
  let timeoutMs = 0;

  if (token && expires) {
    timeoutMs = Math.max(0, expires - Date.now());
    jsCookie.set(cookieName, token, {
      expires: new Date(expires),
      secure: true,
      sameSite: 'strict',
    });
  }

  timeoutId = setTimeout(handleConnection, timeoutMs);
}

window.hassConnection
  .then(({ conn }) => conn.addEventListener('ready', handleConnection));

handleConnection();

console.info(
  '%c AUTH-COOKIE %c 1.0.0 ',
  'color: white; background: blue; font-weight: 700;',
  'color: blue; background: white; font-weight: 700;'
);

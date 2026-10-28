import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import PasswordGate from './PasswordGate.jsx';
import QRPage from './QRPage.jsx';
import './styles.css';
const path = window.location.pathname.replace(/\/+$/, '') || '/';
createRoot(document.getElementById('root')).render(
  <PasswordGate>
    {path === '/qr/1' || path === '/qr/2' ? <QRPage path={path} /> : <App />}
  </PasswordGate>,
);

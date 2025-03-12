import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import es_ES from 'antd/locale/es_ES'; // Importa el idioma español
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <ConfigProvider locale={es_ES} theme={{token: {colorPrimary:'#812323'}}}>
    <App />
    </ConfigProvider>
  </StrictMode>,
)

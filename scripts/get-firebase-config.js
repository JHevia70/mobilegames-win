// Este script muestra la configuración correcta del proyecto Firebase
// Para obtener la configuración web completa:
// 1. Ve a: https://console.firebase.google.com/project/mobilegames-win/settings/general
// 2. Baja hasta "Tus aplicaciones"
// 3. Si no hay una app web, crea una haciendo clic en el icono </> (Web)
// 4. Copia el objeto firebaseConfig que aparece

console.log(`
=================================================================
CONFIGURACIÓN DE FIREBASE NECESARIA
=================================================================

Para obtener la configuración correcta:

1. Abre: https://console.firebase.google.com/project/mobilegames-win/settings/general
2. En "Tus aplicaciones", busca la sección "SDK setup and configuration"
3. Selecciona "Config"
4. Copia los valores de firebaseConfig

Actualiza .env.local con los valores correctos:
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
- NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID

Valores actuales conocidos:
- projectId: mobilegames-win
- authDomain: mobilegames-win.firebaseapp.com
- storageBucket: mobilegames-win.appspot.com

FALTANTES (obtener de la consola):
- appId: 1:XXXXX:web:XXXXX
- measurementId: G-XXXXX

=================================================================
`);

// Try to read current config
const fs = require('fs');
const envPath = '.env.local';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  console.log('\nContenido actual de .env.local:\n');
  console.log(envContent);
} else {
  console.log('\n⚠️ No se encontró .env.local');
}
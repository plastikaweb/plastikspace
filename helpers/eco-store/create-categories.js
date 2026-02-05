// Carga el archivo JSON con las categorías
const dataToImport = require('./categories.json');

const POCKETBASE_URL = 'http://127.0.0.1:8090';
const COLLECTION_NAME = 'product_categories';
// PEGA AQUÍ EL TOKEN DE AUTORIZACIÓN O DÉJALO VACÍO SI LA COLECCIÓN ES PÚBLICA
const AUTH_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc2MzU0NzIxMywiaWQiOiJxNzc2ZmhnbDR0eWM5NGoiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.SoGD_0JcZiojhjh1V4gFzNi1l7Mw9vq97dojl717JOU';

async function importRecords() {
  console.log(`Iniciando la creación de ${dataToImport.length} registros en PocketBase...`);

  for (const recordData of dataToImport) {
    try {
      const response = await fetch(`${POCKETBASE_URL}/api/collections/${COLLECTION_NAME}/records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Incluye el encabezado de autorización si usas un token
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify(recordData),
      });

      const result = await response.json();
      const categoryName = recordData.name?.ca ?? recordData.normalizedName;

      if (response.ok) {
        console.log(`✅ Creado: ${result.name?.ca ?? result.normalizedName}`);
      } else {
        // Muestra errores de validación de PocketBase (ej. campo faltante)
        console.error(`❌ Error al crear ${categoryName}:`, result);
      }
    } catch (error) {
      console.error(
        `🚨 Error de red al procesar ${recordData.name?.ca ?? recordData.normalizedName}:`,
        error.message
      );
    }
  }
  console.log('--- Proceso finalizado ---');
}

// Necesitas instalar node-fetch si tu versión de Node.js no lo incluye globalmente:
// npm install node-fetch

importRecords();

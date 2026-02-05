#!/usr/bin/env node

// Script per crear productes amb traduccions en PocketBase
const pocketbaseUrl = process.env.POCKETBASE_URL ?? 'http://127.0.0.1:8090';
const AUTH_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc2MzU0NzIxMywiaWQiOiJxNzc2ZmhnbDR0eWM5NGoiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.SoGD_0JcZiojhjh1V4gFzNi1l7Mw9vq97dojl717JOU';

const products = require('./products.json');

const productsCollection = 'products';

async function createRecord(collection, data) {
  const response = await fetch(`${pocketbaseUrl}/api/collections/${collection}/records`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(JSON.stringify(error));
  }

  return response.json();
}

async function importProducts() {
  console.log(`Iniciant creació de ${products.length} productes...`);

  for (const product of products) {
    try {
      const createdProduct = await createRecord(productsCollection, product);
      const productName = createdProduct.name?.ca ?? createdProduct.normalizedName;

      console.log(`✅ Producte creat: ${productName} (client ${product.client})`);
    } catch (error) {
      const fallbackName = product.name?.ca ?? product.normalizedName;
      console.error(`❌ Error creant producte ${fallbackName}:`, error.message);
    }
  }

  console.log('--- Procés finalitzat ---');
}

importProducts();

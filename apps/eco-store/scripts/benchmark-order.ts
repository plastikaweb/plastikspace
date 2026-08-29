/* eslint-disable no-console */
import PocketBase from 'pocketbase';
import { loadDotEnv } from './load-environment.js';

loadDotEnv();

const PB_URL = process.env.POCKETBASE_LOCAL_URL || 'http://127.0.0.1:8090';
const PB_ADMIN_EMAIL = process.env.POCKETBASE_DEV_ADMIN_EMAIL || 'admin@example.com';
const PB_ADMIN_PASSWORD = process.env.POCKETBASE_DEV_ADMIN_PASSWORD || 'password123';

const pb = new PocketBase(PB_URL);

/**
 * @description Benchmark function to measure the performance of creating an order.
 * @returns {Promise<void>}
 */
async function benchmark() {
  try {
    await pb.collection('_superusers').authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD);

    const users = await pb.collection('users').getFullList({ limit: 1 });

    if (users.length === 0) throw new Error('No users found');
    const user = users[0];
    const tenantId = user.tenant;

    const products = await pb.collection('products').getFullList({
      filter: `tenant = "${tenantId}"`,
      limit: 20,
    });

    if (products.length < 20) {
      console.warn(`Only found ${products.length} products, using them all.`);
    }

    const items = products.map(product => ({
      productId: product.id,
      requestedQuantity: 1,
    }));

    const orderData = {
      orderNumber: 'BENCH-' + Math.random().toString(36).substring(7).toUpperCase(),
      tenant: tenantId,
      user: user.id,
      items: JSON.stringify(items),
      deliveryMethod: 'pickup',
      status: 'PENDING',
      address: JSON.stringify({
        name: user.name || user.email,
        address: 'Benchmark St',
        city: 'Benchmark City',
        zip: '12345',
        country: 'Benchmark Country',
      }),
      paymentStatus: 'UNPAID',
    };

    console.log(`🚀 Starting benchmark: Creating order with ${items.length} items...`);
    const start = performance.now();

    await pb.collection('orders').create(orderData);
    const end = performance.now();

    console.log(`✅ Order created in ${(end - start).toFixed(2)}ms`);
  } catch (err) {
    console.error('💥 Benchmark failed:', (err as Error).message);
  }
}

benchmark();

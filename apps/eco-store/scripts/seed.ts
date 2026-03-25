#!/usr/bin/env node
/* eslint-disable no-console */

import PocketBase from 'pocketbase';
import {
  addDays,
  subWeeks,
  startOfWeek,
  setHours,
  setMinutes,
  format,
  isBefore,
  isAfter,
} from 'date-fns';
import { loadDotEnv } from './load-environment.js';

// Load environment variables
loadDotEnv();

const PB_URL = process.env.POCKETBASE_LOCAL_URL || 'http://127.0.0.1:8090';
const PB_ADMIN_EMAIL = process.env.POCKETBASE_DEV_ADMIN_EMAIL || 'admin@example.com';
const PB_ADMIN_PASSWORD = process.env.POCKETBASE_DEV_ADMIN_PASSWORD || 'password123';

const pb = new PocketBase(PB_URL);
pb.autoCancellation(false);

interface SeedUser {
  id: string;
  email: string;
  name?: string;
  tenant: string;
}

interface SeedProduct {
  id: string;
  name: string;
  tenant: string;
  price?: number;
}

interface SeedOrderCycle {
  id: string;
  status: string;
}

/**
 * @description Main seeding function.
 * @returns {Promise<void>}
 */
async function seed() {
  console.log('🚀 Iniciant el procés de seeding...');

  try {
    // 1. Autenticació com a Admin
    console.log(`🔐 Connectant a ${PB_URL}...`);
    await pb.collection('_superusers').authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD);
    console.log('✅ Autenticat com a Superusuari.');

    // 2. Recuperació de dades inicials
    const tenants = await pb.collection('tenants').getFullList();
    const users = await pb.collection('users').getFullList();
    const allProducts = await pb.collection('products').getFullList();

    console.log(
      `📊 S'han trobat ${tenants.length} tenants, ${users.length} usuaris i ${allProducts.length} productes.`
    );

    const elLlevatTenant = tenants.find(
      t => t.name.toLowerCase().includes('llevat') || t.id === 'el-llevat'
    );

    if (!elLlevatTenant) {
      console.warn(
        '⚠️ No s\'ha trobat el tenant "el-llevat". El seeding pot fallar per a aquest tenant.'
      );
    } else {
      console.log(`🏢 Tenant identificat: ${elLlevatTenant.name} (${elLlevatTenant.id})`);
    }

    // 3. Generació de Cicles de Comanda (order_cycles) per "el-llevat"
    const orderCyclesCreated = [];
    if (elLlevatTenant) {
      console.log('\n📅 Generant cicles de comanda per a "el-llevat" (20 setmanes)...');

      const now = new Date();
      // Anem 20 setmanes enrere
      for (let i = 20; i >= 0; i--) {
        const deliveryWeek = subWeeks(now, i);
        // Inici de setmana (Dilluns)
        const mondayOfDelivery = startOfWeek(deliveryWeek, { weekStartsOn: 1 });

        // approxDelivery: Dimecres o Divendres d'aquella setmana
        const deliveryDate = addDays(mondayOfDelivery, i % 2 === 0 ? 2 : 4); // Alternem Dimecres/Divendres

        // startsAt: Dijous a les 12:00h de la setmana ANTERIOR a la de lliurament
        let startsAt = addDays(mondayOfDelivery, -4); // Dijous anterior
        startsAt = setHours(setMinutes(startsAt, 0), 12);

        // endsAt: Dilluns a les 12:00h de la setmana de lliurament
        const endsAt = setHours(setMinutes(mondayOfDelivery, 0), 12);

        const year = format(deliveryDate, 'yyyy');
        const weekNum = format(deliveryDate, 'w');
        const name = `Cicle ${weekNum} - ${year}`;
        const code = `LLEVAT-${year}-${weekNum.padStart(2, '0')}`;

        // Determinar status
        let status = 'COMPLETED';
        if (isBefore(now, startsAt)) {
          status = 'DRAFT';
        } else if (isAfter(now, startsAt) && isBefore(now, endsAt)) {
          status = 'OPEN';
        } else if (isAfter(now, endsAt) && isBefore(now, deliveryDate)) {
          status = 'PROCESSING';
        } else if (isAfter(now, deliveryDate) && i < 2) {
          status = 'CLOSED';
        }

        try {
          // Check if exists
          let existingCycle;
          try {
            existingCycle = await pb
              .collection('order_cycles')
              .getFirstListItem(`code="${code}" && tenant="${elLlevatTenant.id}"`);
          } catch {
            // Ignored
          }

          const data = {
            tenant: elLlevatTenant.id,
            name,
            code,
            startsAt: startsAt.toISOString(),
            endsAt: endsAt.toISOString(),
            approxDelivery: deliveryDate.toISOString(),
            status,
          };

          let cycle;
          if (existingCycle) {
            cycle = await pb.collection('order_cycles').update(existingCycle.id, data);
          } else {
            cycle = await pb.collection('order_cycles').create(data);
          }
          orderCyclesCreated.push(cycle);
        } catch (err) {
          console.error(`❌ Error creant cicle ${code}:`, (err as Error).message);
        }
      }
      console.log(`✅ S'han creat/actualitzat ${orderCyclesCreated.length} cicles.`);
    }

    // 4. Generació de Comandes (orders)
    console.log('\n🛒 Generant comandes per als usuaris...');
    let totalOrders = 0;

    for (const user of users) {
      const tenantId = user.tenant;
      const userProducts = allProducts.filter(p => p.tenant === tenantId);

      if (userProducts.length === 0) {
        console.warn(
          `⚠️ L'usuari ${user.email} no té productes al seu tenant (${tenantId}). Saltant...`
        );
        continue;
      }

      const isElLlevat = elLlevatTenant && tenantId === elLlevatTenant.id;

      if (isElLlevat) {
        // Lògica per El Llevat: per cada cicle, probabilitat de compra
        for (const cycle of orderCyclesCreated) {
          // Probabilitat 40-60%
          if (Math.random() > 0.5) {
            await createRandomOrder(user, tenantId, userProducts, cycle);
            totalOrders++;
          }
        }
      } else {
        // Altres tenants: 3-8 comandes aleatòries
        const numOrders = Math.floor(Math.random() * 6) + 3;
        for (let j = 0; j < numOrders; j++) {
          await createRandomOrder(user, tenantId, userProducts);
          totalOrders++;
        }
      }
    }

    console.log(`✅ S'han generat ${totalOrders} comandes en total.`);
    console.log('\n✨ Seeding completat amb èxit! ✨');
  } catch (err) {
    console.error('\n💥 Error crític durant el seeding:', (err as Error).message);
    const pbErr = err as { response?: { data: Record<string, unknown> } };
    if (pbErr.response?.data) {
      console.error('Detalls:', JSON.stringify(pbErr.response.data, null, 2));
    }
  }
}

/**
 * @description Crea una comanda aleatòria per a un usuari.
 * @param {SeedUser} user The user.
 * @param {string} tenantId The tenant ID.
 * @param {SeedProduct[]} availableProducts List of available products.
 * @param {SeedOrderCycle} cycle The order cycle.
 */
async function createRandomOrder(
  user: SeedUser,
  tenantId: string,
  availableProducts: SeedProduct[],
  cycle: SeedOrderCycle | null = null
) {
  const numItems = Math.floor(Math.random() * 5) + 2; // 2 a 6 productes
  const selectedProducts = [];

  // Seleccionar productes únics
  const tempProducts = [...availableProducts];
  for (let i = 0; i < Math.min(numItems, tempProducts.length); i++) {
    const idx = Math.floor(Math.random() * tempProducts.length);
    selectedProducts.push(tempProducts.splice(idx, 1)[0]);
  }

  const items = selectedProducts.map(p => {
    const qty = Math.floor(Math.random() * 3) + 1;
    const price = p.price || Math.random() * 10 + 2;
    return {
      productId: p.id,
      productName: p.name,
      requestedQuantity: qty, // Hook espera requestedQuantity
      price: price,
      subtotal: qty * price,
    };
  });

  const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0);

  const deliveryMethod = Math.random() > 0.5 ? 'delivery' : 'pickup';
  let shipping = 0;
  let deliverySlot = '';

  if (deliveryMethod === 'delivery') {
    // Càlcul de shipping segons subtotal
    if (subtotal >= 100) shipping = 0;
    else if (subtotal >= 50) shipping = 3;
    else if (subtotal >= 20) shipping = 5;
    else shipping = 10;

    const slots = ['Dimecres 15:00 - 21:00', 'Divendres 10:00 - 13:00', 'Divendres 15:00 - 21:00'];
    deliverySlot = slots[Math.floor(Math.random() * slots.length)];
  }

  const total = subtotal + shipping;
  const randId = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  const tenantCode = tenantId.substring(0, 3).toUpperCase();
  const orderNumber = `ORD-${tenantCode}-${randId}`;

  // Status basat en el cicle o aleatori
  let status = 'DELIVERED'; // 'COMPLETED' no és vàlid a l'esquema
  if (cycle) {
    if (cycle.status === 'OPEN') status = 'PENDING';
    else if (cycle.status === 'PROCESSING') status = 'PREPARING';
    else if (cycle.status === 'DRAFT') status = 'PENDING';
    else if (cycle.status === 'CLOSED' || cycle.status === 'COMPLETED')
      status = Math.random() > 0.1 ? 'DELIVERED' : 'CANCELLED';
  } else {
    const statuses = ['PENDING', 'PREPARING', 'DELIVERED', 'CANCELLED'];
    status = statuses[Math.floor(Math.random() * statuses.length)];
  }

  const data = {
    orderNumber,
    tenant: tenantId,
    user: user.id,
    orderCycle: cycle ? cycle.id : null,
    items: items,
    subtotal,
    shipping,
    total,
    deliveryMethod,
    deliverySlot,
    status,
    address: {
      name: user.name || user.email,
      address: 'Carrer de Prova, 123',
      city: 'Barcelona',
      zip: '08001',
      country: 'Espanya',
    },
    paymentStatus: status === 'CANCELLED' ? 'REFUNDED' : status === 'PENDING' ? 'UNPAID' : 'PAID',
    notes: Math.random() > 0.8 ? 'Nota de prova per a la comanda' : '',
  };

  try {
    // Afegim el bypass per seguretat encara que hem arreglat els camps
    await pb.collection('orders').create(data, {
      headers: { 'x-bypass-hooks': 'true' },
    });
  } catch (err) {
    const pbErr = err as { message: string; response?: { data: Record<string, unknown> } };
    // Si falla per orderNumber duplicat, ignorem silenciosament o provem un altre
    if (pbErr.message.includes('unique')) {
      data.orderNumber += 'B';
      await pb
        .collection('orders')
        .create(data)
        .catch(() => {
          /* Ignored duplicate */
        });
    } else {
      console.error(`❌ Error creant comanda ${orderNumber}:`, pbErr.message);
      if (pbErr.response?.data) {
        console.error('      Detalls:', JSON.stringify(pbErr.response.data, null, 2));
      }
    }
  }
}

seed();

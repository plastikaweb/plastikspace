// The records the PocketBase fixture serves: one tenant open every day, one category, two
// products, a member and an administrator. Field names follow the eco PocketBase schema; a field
// the screens do not read is left out.

type PocketBaseRecord = Record<string, unknown> & { id: string };

const STAMP = '2026-11-01 10:00:00.000Z';

const base = (collectionName: string, id: string): PocketBaseRecord => ({
  id,
  collectionId: `pbc_${collectionName}`,
  collectionName,
  created: STAMP,
  updated: STAMP,
});

const localized = (ca: string, es: string, en: string) => ({ ca, es, en });

const everyDay = (range: string) => ({
  monday: [range],
  tuesday: [range],
  wednesday: [range],
  thursday: [range],
  friday: [range],
  saturday: [range],
  sunday: [range],
});

/** The tenant: El Llevat, open all week, with pickup and delivery, no order window. */
export const TENANT: PocketBaseRecord = {
  ...base('tenants', 'tenantllevat001'),
  name: 'El Llevat',
  shortName: 'El Llevat',
  email: 'hola@example.test',
  phone: '600000000',
  address: 'Carrer Major 1',
  city: 'Barcelona',
  zip: '08001',
  province: 'Barcelona',
  normalizedName: 'el-llevat',
  languages: ['ca', 'es', 'en'],
  logo: '',
  active: true,
  closed: false,
  closedReason: null,
  slogan: 'Consum de proximitat',
  description: localized(
    'Cooperativa de consum.',
    'Cooperativa de consumo.',
    'Consumer cooperative.'
  ),
  timezone: 'Europe/Madrid',
  fiscalDataEnabled: false,
  logisticsConfig: {
    orderWindow: { enabled: false },
    options: [
      { type: 'pickup', enabled: true, cost: 0, slots: everyDay('10:00-20:00') },
      { type: 'delivery', enabled: true, cost: 3, slots: everyDay('17:00-20:00') },
    ],
  },
};

/** The one category, «Fruita i verdura». */
export const CATEGORY: PocketBaseRecord = {
  ...base('product_categories', 'catfruita00001'),
  normalizedName: 'fruita-i-verdura',
  name: localized('Fruita i verdura', 'Fruta y verdura', 'Fruit and vegetables'),
  description: localized(
    'Fruita i verdura de temporada.',
    'Fruta y verdura de temporada.',
    'Seasonal fruit and vegetables.'
  ),
  color: '#4caf50',
  icon: 'nutrition',
  tenant: TENANT.id,
  group: 'groupfresc0001',
};

const CATEGORY_STATS: PocketBaseRecord = {
  ...base('product_categories_stats', CATEGORY.id),
  category: CATEGORY.id,
  name: CATEGORY['name'],
  normalizedName: CATEGORY['normalizedName'],
  color: CATEGORY['color'],
  groupName: localized('Fresc', 'Fresco', 'Fresh'),
  icon: CATEGORY['icon'],
  tenant: TENANT.id,
  totalProducts: 2,
};

const product = (
  id: string,
  normalizedName: string,
  name: ReturnType<typeof localized>,
  price: number
): PocketBaseRecord => ({
  ...base('products', id),
  name,
  normalizedName,
  inStock: true,
  stock: 50,
  origin: 'Lleida',
  provider: 'Hort de la Plana',
  price,
  iva: 4,
  priceWithIva: Math.round(price * 1.04 * 100) / 100,
  images: ['photo.png'],
  unitType: 'weight',
  unitBase: 1,
  category: CATEGORY.id,
  rating: 0,
  reviewsCount: 0,
  tenant: TENANT.id,
  minQuantity: 0.5,
  maxQuantity: 10,
  features: [],
  tags: [],
  description: localized('Pera dolça i sucosa.', 'Pera dulce y jugosa.', 'Sweet, juicy pear.'),
  expand: { category: CATEGORY },
});

/** The two products; the first one is the product page the suite opens. */
export const PRODUCTS: PocketBaseRecord[] = [
  product(
    'prodperes00001',
    'peres-conferencia',
    localized('Peres conferència', 'Peras conferencia', 'Conference pears'),
    2.5
  ),
  product(
    'prodpomes00001',
    'pomes-golden',
    localized('Pomes golden', 'Manzanas golden', 'Golden apples'),
    2.1
  ),
];

const user = (id: string, fields: Record<string, unknown>): PocketBaseRecord => ({
  ...base('users', id),
  collectionId: '_pb_users_auth_',
  emailVisibility: false,
  verified: true,
  avatar: '',
  tenant: TENANT.id,
  language: 'ca',
  membershipStatus: 'ACTIVE',
  ...fields,
});

/** A member of El Llevat with one saved address. */
export const MEMBER = user('usermember0001', {
  email: 'soci@example.test',
  name: 'Marta Soler',
  normalizedName: 'marta-soler',
  role: 'PARTNER',
  phone: '600000002',
});

/** An administrator of El Llevat, the role eco-admin lets in. */
export const ADMIN = user('useradmin00001', {
  email: 'admin@example.test',
  name: 'Admin Llevat',
  normalizedName: 'admin-llevat',
  role: 'TENANT_ADMIN',
  phone: '600000001',
});

/** The member's saved address, which the shipping step offers instead of asking again. */
export const MEMBER_ADDRESS: PocketBaseRecord = {
  ...base('user_addresses', 'addrmember0001'),
  user: MEMBER.id,
  name: 'Casa',
  address: 'Carrer de la Pau 12',
  city: 'Barcelona',
  zip: '08002',
  phone: '600000002',
  default: true,
  active: true,
};

/** Where members pick their orders up. */
const PICKUP_POINT: PocketBaseRecord = {
  ...base('tenant_addresses', 'addrtenant0001'),
  tenant: TENANT.id,
  name: 'El Llevat',
  address: 'Carrer Major 1',
  city: 'Barcelona',
  zip: '08001',
  province: 'Barcelona',
  phone: '600000000',
  default: true,
  active: true,
  slots: everyDay('10:00-20:00'),
  instructions: localized('Entrada pel pati.', 'Entrada por el patio.', 'Enter through the yard.'),
};

/** Collection name → the records a list call can return. */
export const RECORDS: Record<string, PocketBaseRecord[]> = {
  tenants: [TENANT],
  tenant_addresses: [PICKUP_POINT],
  product_categories: [CATEGORY],
  product_categories_stats: [CATEGORY_STATS],
  products: PRODUCTS,
  users: [MEMBER, ADMIN],
  user_addresses: [MEMBER_ADDRESS],
};

export type { PocketBaseRecord };

import { signalStore } from '@ngrx/signals';
import { Product } from '@plastik/eco-store/entities';
import { withPocketBaseGet } from '@plastik/signal-state/pocketbase';
import { EcoStoreProductsApiService } from './eco-store-products-api.service';

export const ecoStoreProductsStore = signalStore(
  { providedIn: 'root' },
  withPocketBaseGet<Product, EcoStoreProductsApiService>({
    featureName: 'products',
    dataServiceType: EcoStoreProductsApiService,
  })
);

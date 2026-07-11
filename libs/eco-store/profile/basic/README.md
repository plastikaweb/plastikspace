# eco-store-profile-basic-feature

- [eco-store-profile-basic-feature](#eco-store-profile-basic-feature)
  - [Features](#features)
  - [Usage](#usage)

This library provides the profile basic information management feature for the Eco Store application.
It allows users to view and edit their basic profile information, such as name, email, and phone number.

## Features

- View user's basic profile information
- Edit user's basic profile information
- Save changes to the backend
- Cancel changes

## Usage

```typescript
import { EcoStoreProfileBasicFeatureComponent } from '@plastik/eco-store/profile/basic';

@Component({
  selector: 'app-root',
  imports: [EcoStoreProfileBasicFeatureComponent],
  template: '<eco-eco-store-profile-basic-feature></eco-eco-store-profile-basic-feature>',
})
export class AppComponent {}
```

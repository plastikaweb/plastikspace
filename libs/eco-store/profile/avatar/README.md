# eco-store-profile-avatar-feature

This library provides the profile avatar management feature for the Eco Store application.
It allows users to upload, crop, and delete their profile avatar using the Shared Image Cropper component.

## Features

- View current avatar.
- Upload a new avatar with cropping functionality.
- Delete the current avatar with a confirmation dialog.
- Responsive design.

## Usage

Import the `EcoStoreProfileAvatarFeatureComponent` and use it in your routes:

```typescript
export const ECO_STORE_PROFILE_AVATAR_FEATURE_ROUTES: Route[] = [
  {
    path: '',
    component: EcoStoreProfileAvatarFeatureComponent,
  },
];
```

## Running unit tests

Run `nx test eco-store-profile-avatar-feature` to execute the unit tests.

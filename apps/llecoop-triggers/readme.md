# Llecoop Triggers

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-a08021?style=for-the-badge&logo=firebase&logoColor=ffcd34)

- [Description](#description)
- [Features](#features)
- [Setup & Deployment](#setup--deployment)
- [Generated Files](#generated-files)

## Description

**Llecoop Triggers** contains the Firebase Cloud Functions responsible for automation and server-side logic in the Llecoop ecosystem. It handles events from Firestore, Auth, and scheduled tasks.

## Features

### 📂 Category

- **`onDeleteCategoryUpdateProductCategory`**: Updates related products when a category is deleted.
- **`onUpdateCategoryUpdateProductCategory`**: Updates related products when a category is updated.

### 📦 Product

- **`onCreateProductCategoryUpdateCategoryProductCount`**: Increments category product count on product creation.
- **`onDeleteProductUpdateCategoryProductCount`**: Decrements category product count on product deletion.
- **`onUpdateProductCategoryUpdateCategoryProductCount`**: Updates counts when a product's category changes.

### 👥 User

- **`onRequestRegisterUserBlockIfUserIsNotWhiteListed`**: Security check for user registration.
- **`onLoginUserUpdateVerifiedEmailProperty`**: Syncs email verification status on login.
- **`setUserAdminClaim`**: Manages admin privileges.
- **`onCreateWhiteListedUserCheckIfUserAlreadyExists`**: Prevents duplicate user creation.
- **`onDeleteUserDeleteUserFromAuth`**: Syncs Firestore user deletion with Auth.
- **`onUpdateUserUpdateAuth`**: Syncs user profile changes (name, photo, phone, email) to Auth.

### 🛒 Order List

- **`onOrderListTimeFinishUpdateOrderListState`**: Auto-closes order lists based on time.
- **`onUserOrderCreatedUpdateOrderListUserOrdersCount`**: Updates total order count.
- **`onUserOrderDeletedUpdateOrderListUserOrdersCount`**: Updates total order count.
- **`onUserOrderStatusUpdateUpdateOrderListUserOrdersStatus`**: Aggregates user order statuses.

### 🛍️ User Order

- **`onCreateUserOrderCheckIfAnUserOrderExists`**: Prevents duplicate orders for the same list.
- **`onChangeUserOrderUpdateOrderListTotal`**: Recalculates order list totals.
- **`onCancelOrderListCancelRelatedUserOrdersStatus`**: Cascades cancellation to user orders.
- **`onDeleteOrderListDeleteRelatedUserOrders`**: Cascades deletion to user orders.

## Setup & Deployment

### Setup

1. Install CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Add Target: `firebase use --add`

### Deployment

- **Build**: `yarn llecoop:firebase:functions:build`
- **Deploy (Staging)**: `yarn llecoop:firebase:functions:deploy:staging`
- **Deploy (Prod)**: `yarn llecoop:firebase:functions:deploy:production`
- **Deploy All**: `yarn llecoop:deploy:functions`

## Generated Files

- `src/main.ts`: Entry point.
- `firebase.json`: Configuration.
- `.firebaserc`: Deployment targets.

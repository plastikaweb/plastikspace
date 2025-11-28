# Llecoop Triggers

## Firebase Cloud Functions for Llecoop automation

---

- [Llecoop Triggers](#llecoop-triggers)
  - [Firebase Cloud Functions for Llecoop automation](#firebase-cloud-functions-for-llecoop-automation)
  - [🚀 Deployment](#-deployment)
  - [⚡ Available Triggers](#-available-triggers)
    - [📂 Category](#-category)
    - [📦 Product](#-product)
    - [👥 User](#-user)
    - [🛒 Order List](#-order-list)
    - [🛍️ User Order](#️-user-order)
  - [📂 Generated Files](#-generated-files)
  - [🛠️ Setup](#️-setup)

---

## 🚀 Deployment

- **Build**: `yarn llecoop:firebase:functions:build`
- **Deploy (Staging)**: `yarn llecoop:firebase:functions:deploy:staging`
- **Deploy (Prod)**: `yarn llecoop:firebase:functions:deploy:production`
- **Deploy All**: `yarn llecoop:deploy:functions`

## ⚡ Available Triggers

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

## 📂 Generated Files

- `src/main.ts`: Entry point.
- `firebase.json`: Configuration.
- `.firebaserc`: Deployment targets.

## 🛠️ Setup

1. Install CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Add Target: `firebase use --add`

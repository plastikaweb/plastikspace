# llecoop-triggers

- [llecoop-triggers](#llecoop-triggers)
  - [Deploy Llecoop Functions to Firebase Cloud Functions](#deploy-llecoop-functions-to-firebase-cloud-functions)
  - [Generated Application Files](#generated-application-files)
  - [Generated Workspace Root Files](#generated-workspace-root-files)
  - [Generated modules](#generated-modules)
  - [Next Steps](#next-steps)
  - [Available triggers](#available-triggers)
    - [Category](#category)
    - [Product](#product)
    - [User](#user)
    - [Order List](#order-list)
    - [User Order](#user-order)

## Deploy Llecoop Functions to Firebase Cloud Functions

- `yarn llecoop:firebase:functions:build` - Build Firebase Functions for deployment.
- `yarn llecoop:firebase:functions:deploy:staging` - Deploy Firebase Functions to staging.
- `yarn llecoop:firebase:functions:deploy:production` - Deploy Firebase Functions to production.
- `yarn llecoop:deploy:functions` - Build and Deploy Firebase Functions to staging and production.

## Generated Application Files

- `src/main.ts` - Default Firebase Functions entry point.

## Generated Workspace Root Files

- `firebase.json` - Firebase CLI Configuration for this project.
- `.firebaserc` - Default Firebase CLI Deployment Targets Configuration.
- `firebase.json` - Intentionally Empty Firebase CLI Configuration (only needed to allow Firebase CLI to run in your workspace).

## Generated modules

Nx-Firebase will add `firebase-admin` and `firebase-functions` to your workspace `package.json` at the `'latest'` version. You may wish to set these to a specific version.

## Next Steps

- `npm install -g firebase-tools` - Install the [Firebase CLI](https://firebase.google.com/docs/cli).
- `firebase login` - Authenticate the Firebase CLI.
- `firebase use --add` - Add your Firebase Project as a target to `.firebaserc`.
- You do not need to `npm install` in the app project directory, but can still add and run custom npm scripts to the app `package.json` if you wish.

See the plugin [README](https://github.com/simondotm/nx-firebase/blob/main/README.md) for more information.

## Available triggers

### Category

- `onDeleteCategoryUpdateProductCategory`: When a category is deleted, it updates the related products category to null.
- `onUpdateCategoryUpdateProductCategory`: When a category is updated, it updates the related products.

### Product

- `onCreateProductCategoryUpdateCategoryProductCount`: Updates category product count when a new product is created.
- `onDeleteProductUpdateCategoryProductCount`: Updates category product count when a product is deleted.
- `onUpdateProductCategoryUpdateCategoryProductCount`: Updates category product count when product category changes.

### User

- `onRequestRegisterUserBlockIfUserIsNotWhiteListed`: Blocks registration if user email is not whitelisted.
- `onLoginUserUpdateVerifiedEmailProperty`: Updates email verification status on user login.
- `setUserAdminClaim`: Sets admin claim for a user and updates Firestore document.
- `onCreateWhiteListedUserCheckIfUserAlreadyExists`: Validates new user creation against existing Auth users.
- `onDeleteUserDeleteUserFromAuth`: Removes user from Firebase Auth when Firestore document is deleted.
- `onUpdateUserUpdateAuth`: Updates Firebase Auth user data when Firestore document changes.
  - Updates basic info (name, photo, phone).
  - Handles email changes with verification.
  - Formats phone numbers to E.164 standard.

### Order List

- `onOrderListTimeFinishUpdateOrderListState`: Updates order list state based on finish time.
- `onUserOrderCreatedUpdateOrderListUserOrdersCount`: Updates order list user orders count when a new order is created.
- `onUserOrderDeletedUpdateOrderListUserOrdersCount`: Updates order list user orders count when an order is deleted.
- `onUserOrderStatusUpdateUpdateOrderListUserOrdersStatus`: Updates order list user orders status when an order status changes.

### User Order

- `onCreateUserOrderCheckIfAnUserOrderExists`: Validates if a user order already exists before creation.
- `onChangeUserOrderUpdateOrderListTotal`: Updates order list totals when an order changes.
- `onCancelOrderListCancelRelatedUserOrdersStatus`: When an order list is canceled, it updates the related user orders status.
- `onDeleteOrderListDeleteRelatedUserOrders`: When an order list is deleted, it deletes all related user orders.

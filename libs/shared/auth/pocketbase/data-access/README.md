# @plastik/auth/pocketbase/data-access

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![PocketBase](https://img.shields.io/badge/PocketBase-%23b8dbe4.svg?style=for-the-badge&logo=PocketBase&logoColor=black)

- [@plastik/auth/pocketbase/data-access](#plastikauthpocketbasedata-access)
  - [Services](#services)
  - [Store](#store)
    - [**`pocketBaseUserProfileStore`**](#pocketbaseuserprofilestore)
      - [State Signals](#state-signals)
      - [Methods](#methods)
  - [Guards](#guards)
  - [Running unit tests](#running-unit-tests)

This library provides the **PocketBase implementation** of the authentication logic. It implements the `AuthFacade` contract defined in [`@plastik/shared/auth/feature`](../../feature/README.md).

**Key Features:**

- **Automatic Session Restoration**: Persists authentication across page reloads using PocketBase's built-in localStorage.
- **Type-Safe**: Full TypeScript support with `PocketBaseUser` entity.
- **DevTools Integration**: State changes tracked in Redux DevTools.

## Services

- **`PocketBaseAuthService`**: Implements `AuthFacade`. Lightweight wrapper around the PocketBase JS SDK for authentication operations.
  - `login`: Authenticates a user with email and password.
  - `logout`: Clears the authentication state.
  - `register`: Registers a new user.
  - `requestPassword`: Sends a password reset email.
  - `authModel`: (getter) Gets the currently authenticated user.

## Store

### **`pocketBaseUserProfileStore`**

An NgRx Signal Store for reactive authentication state management.

#### State Signals

- `user()` - `Signal<PocketBaseUser | null>`: Currently authenticated user.
- `isAuthenticated()` - `Signal<boolean>`: Authentication status.
- `userInitials()` - `Signal<string | undefined>`: Initials of the authenticated user (max 2 characters).
- `userFirstName()` - `Signal<string>`: First name of the authenticated user.
- `isLoading()` - `Signal<boolean>`: Loading state during operations.

#### Methods

- `login(credentials)`: Authenticate with email/password.
- `logout()`: Clear authentication and reset state.
- `checkAuth()`: Check and restore session from localStorage (auto-called on init).
- `getUserAddresses()`: Fetch all addresses for the current user.
- `createAddress(data)`: Create a new address with optimistic update.
- `updateAddress(id, data)`: Update an existing address with optimistic update.
- `deleteAddress(id)`: Delete an address by ID.
- `setDefaultAddress(id)`: Set an address as the default.
- `updateProfile(data)`: Update the user's name and phone.
- `updateAvatar(file)`: Upload a new profile avatar.
- `deleteAvatar()`: Remove the profile avatar.
- `requestPassword(data)`: Send a password reset email.
- `resetPassword(data)`: Confirm a password reset with token.

## Guards

- **`pocketBaseIsLoggedGuard`**: Route guard that allows access only to authenticated users. Redirects to login if unauthorized.
- **`pocketBaseIsNotLoggedGuard`**: Route guard that allows access only to **unauthenticated** users (guests). Redirects to home if already logged in.

## Running unit tests

Run `nx test auth-pocketbase-data-access` to execute the unit tests.

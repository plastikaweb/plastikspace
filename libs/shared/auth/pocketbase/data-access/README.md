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
  - [Running unit tests](#running-unit-tests)

This library provides the **PocketBase implementation** of the authentication logic. It implements the `AuthFacade` contract defined in [`@plastik/auth/util`](../../util/README.md).

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
- `isLoading()` - `Signal<boolean>`: Loading state during operations.
- `error()` - `Signal<string | null>`: Last error message.

#### Methods

- `login(credentials)`: Authenticate with email/password.
- `logout()`: Clear authentication and reset state.
- `checkAuth()`: Check and restore session from localStorage (auto-called on init).

## Running unit tests

Run `nx test auth-pocketbase-data-access` to execute the unit tests.

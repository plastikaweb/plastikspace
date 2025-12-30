# @plastik/auth/pocketbase/data-access

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![PocketBase](https://img.shields.io/badge/PocketBase-%23b8dbe4.svg?style=for-the-badge&logo=PocketBase&logoColor=black)

- [@plastik/auth/pocketbase/data-access](#plastikauthpocketbasedata-access)
  - [Description](#description)
  - [Services](#services)
  - [Store](#store)
  - [Running unit tests](#running-unit-tests)

## Description

Shared authentication library for PocketBase-based applications. It provides a lightweight service wrapper and an NgRx Signal Store for managing user authentication state.

It follows the same architectural patterns as the existing Firebase auth (`@plastik/shared/auth/firebase/data-access`).

**Key Features:**

- **Automatic Session Restoration**: Persists authentication across page reloads using PocketBase's built-in localStorage.
- **Type-Safe**: Full TypeScript support with `PocketBaseUser` entity.
- **DevTools Integration**: State changes tracked in Redux DevTools.

## Services

- **`PocketBaseAuthService`**: Lightweight wrapper around the PocketBase JS SDK for authentication operations.
  - `login`: Authenticates a user with email and password.
  - `logout`: Clears the authentication state.
  - `isValid`: (getter) Checks if the current token is valid.
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

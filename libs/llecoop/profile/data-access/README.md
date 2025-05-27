# llecoop-profile-data-access

- [llecoop-profile-data-access](#llecoop-profile-data-access)
  - [Description](#description)
  - [Services](#services)
    - [`LlecoopProfileFireService`](#llecoopprofilefireservice)
    - [`llecoopProfileStore`](#llecoopprofilestore)
  - [Usage](#usage)
  - [Running unit tests](#running-unit-tests)

## Description

This library manages user profile data for the Llecoop application, including fetching, updating, and state management. It interacts with Firebase for data persistence and authentication.

## Services

### `LlecoopProfileFireService`

This service is responsible for direct interactions with the Firestore database to manage user profile data.

**Path:** `libs/llecoop/profile/data-access/src/profile-fire.service.ts`

**Key Responsibilities:**

- **Fetching User Data:**
  - `getItem(id: EntityId): Observable<LlecoopUser | null>`: Retrieves a specific user profile by their ID.
  - `getLoggedUser(): Observable<LlecoopUser>`: Fetches the profile data for the currently authenticated user. It relies on `FirebaseAuthService` to get the current user's UID.
- **Updating User Data:**
  - `update(item: Partial<LlecoopUser>): Observable<void>`: Updates parts of a user's profile in Firestore. It automatically handles `updatedAt` timestamps and normalizes the user's name.
- **Data Handling:**
  - Uses a `firebaseAssignTypes` converter to ensure data consistency when writing to Firestore (e.g., setting `createdAt`, `updatedAt`, `normalizedName`).
- **Connection Management:**
  - `setActiveConnection(active: boolean)`: Manages the active connection to Firestore, allowing the service to be enabled or disabled. When disabled, Firestore listeners are cleaned up.
- **Error Handling:**
  - Includes `handlePermissionError` to gracefully manage Firestore permission issues, returning a default value instead of throwing an error for permission denials.

**Dependencies:**

- `Firestore`: For database interactions.
- `FirebaseAuthService`: To get the current authenticated user's ID.

### `llecoopProfileStore`

This is a signal-based NgRx store that manages the state of the user's profile within the application.

**Path:** `libs/llecoop/profile/data-access/src/profile.store.ts`

**Key Features:**

- **State Management:**
  - `user: LlecoopUser | null`: Holds the current user's profile data.
  - `_activeConnection: boolean`: Tracks if the store should be actively fetching/listening for profile data.
- **Computed Properties:**
  - `getUserName: computed(() => string)`: Provides a display name for the user, falling back to email or a generic "user" if the name is not set.
- **Methods:**
  - `getItem(): void`: An `rxMethod` that triggers fetching the logged-in user's profile data via `LlecoopProfileFireService`. It only runs if `_activeConnection` is true and manages activity indicators and notifications.
  - `update(user: Partial<LlecoopUser>): void`: An `rxMethod` that triggers updating the user's profile via `LlecoopProfileFireService`. Manages activity indicators and success/error notifications.
  - `setActive(): void`: Sets the `_activeConnection` to true and enables profile data fetching.
  - `destroy(): void`: Resets the store to its initial state and deactivates the connection in `LlecoopProfileFireService`.
- **Hooks (`onInit`):**
  - **Automatic Data Fetching:** Watches the store's state. If `_activeConnection` is true and `user` is null, it calls `getItem()` to load the profile.
  - **Authentication Synchronization:**
    - If the user logs out (checked via `FirebaseAuthService.currentUser()`), the store calls `destroy()` to clear profile data.
    - If the user is logged in but the store is not active (`!_activeConnection()`), it calls `setActive()` to initialize profile loading.

**Dependencies:**

- `LlecoopProfileFireService`: To perform CRUD operations on profile data.
- `FirebaseAuthService`: To monitor the authentication state of the user.
- `activityStore`: To indicate loading states.
- `StoreNotificationService`: To display success or error messages to the user.

## Usage

Inject `llecoopProfileStore` into your Angular components or services to access user profile data and methods.

Example:

```typescript
import { llecoopProfileStore } from '@plastik/llecoop/profile/data-access';
import { inject } from '@angular/core';

// In a component or service
export class MyComponent {
  private readonly profileStore = inject(llecoopProfileStore);

  userName = this.profileStore.getUserName(); // Access computed user name
  currentUser = this.profileStore.user; // Access the user signal

  ngOnInit() {
    // The store typically handles fetching automatically on init if active
    // and user is logged in.
    // To manually trigger an update:
    // this.profileStore.update({ name: 'New Name' });
  }
}
```

This library provides a reactive and robust way to manage user profile information, integrated with Firebase authentication and Firestore.

## Running unit tests

Run `nx test llecoop-profile-data-access` to execute the unit tests via [Jest](https://jestjs.io).

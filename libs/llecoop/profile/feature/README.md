# @plastik/llecoop/profile/feature

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/llecoop/profile/feature](#plastikllecoopprofilefeature)
  - [Description](#description)
  - [Features](#features)
  - [User profile state](#user-profile-state)
  - [Firebase functions](#firebase-functions)
  - [Testing](#testing)

## Description

The **`llecoop-profile-feature`** library is a feature module that handles **user profile functionality** within the **Llecoop** application.
It provides components and services for managing user profile information, settings, and related features.

## Features

- User profile management.
- Profile information display and editing.
- Profile-related routing and navigation.

## User profile state

The **user profile state** is managed by the `llecoopProfileStore`.

## Firebase functions

On updating the user profile, besides updating the user Firestore collection, it runs a **Firebase function** to update the related Auth user data.

See more in the llecoop-triggers app [README](../../../../apps/llecoop-triggers/README.md).

## Testing

Run `nx test llecoop-profile-feature` to execute the unit tests.

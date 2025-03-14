# llecoop-profile-feature

- [llecoop-profile-feature](#llecoop-profile-feature)
  - [Description](#description)
  - [Features](#features)
  - [User profile state](#user-profile-state)
  - [Firebase functions](#firebase-functions)
  - [Testing](#testing)

## Description

The `llecoop-profile-feature` library is a feature module that handles user profile functionality within the LLeCoop application.
It provides components and services for managing user profile information, settings, and related features.

## Features

- User profile management.
- Profile information display and editing.
- Profile-related routing and navigation.

## User profile state

The user profile state is managed by the `llecoopUserStore`.

## Firebase functions

On updating de user profile, besides updating the user firestore collection, it runs a firebase function to update the related Auth user data.

See more in the llecoop-triggers app [README](../../../../apps/llecoop-triggers/README.md).

## Testing

Run `nx test llecoop-profile-feature` to execute the unit tests.

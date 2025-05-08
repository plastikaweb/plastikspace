# skip-link-util

- [skip-link-util](#skip-link-util)
  - [Description](#description)
  - [Features](#features)
  - [Usage](#usage)
    - [1. Add the component to your application layout](#1-add-the-component-to-your-application-layout)
    - [2. Ensure your main content has the ID 'mainContent'](#2-ensure-your-main-content-has-the-id-maincontent)
  - [Implementation Details](#implementation-details)
  - [Running unit tests](#running-unit-tests)

## Description

A component utility that enables applications to use a link to skip to the main content.

## Features

- Improves accessibility by allowing keyboard users to bypass navigation menus
- Visually hidden until focused, following best accessibility practices
- Uses Angular CDK LiveAnnouncer for screen reader announcements
- Automatically scrolls to and focuses the main content area
- Simple implementation with minimal configuration

## Usage

### 1. Add the component to your application layout

```html
<plastik-skip-link></plastik-skip-link>
```

### 2. Ensure your main content has the ID 'mainContent'

```html
<main id="mainContent" tabindex="-1">
  <!-- Your main content here -->
</main>
```

## Implementation Details

- The skip link is visually hidden using the `sr-only` class but becomes visible when focused.
- When activated, it navigates to the URL fragment `#mainContent`.
- After navigation, it focuses the main content element and scrolls it into view.
- Announces the navigation action to screen readers.

## Running unit tests

Run `nx test skip-link-util` to execute the unit tests.

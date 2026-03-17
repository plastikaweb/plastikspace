# @plastik/nasa-images/search/ui/no-results

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/nasa-images/search/ui/no-results](#plastiknasa-imagessearchuino-results)
  - [Description](#description)
  - [How to use](#how-to-use)
  - [Running unit tests](#running-unit-tests)

## Description

This library provides a **UI component** to display a friendly message when **no search results** are found in the **NASA Images** application, ensuring a good user experience even when data is missing.

![nasa-images-search-ui-no-results](no-results.png)

## How to use

It uses **content projection** to clearly encapsulate HTML structure and main CSS styles.

| Selector    | Description                           |
| ----------- | ------------------------------------- |
| `[icon]`    | The icon to show in the UI            |
| `[title]`   | The title to show in the UI           |
| `[message]` | A secondary message to show in the UI |

## Running unit tests

Run `nx test nasa-images-search-ui-no-results` to execute the unit tests.

# llecoop-user-order-product-list-feature

// add documentation

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Running unit tests](#running-unit-tests)

## Overview

This library provides a feature module for the LleCoop user ordering system, specifically for managing product listings. It includes:

- A component for displaying a list of available products
- Integration with the data access layer for fetching and managing product data
- Pagination and sorting capabilities
- Filtering options for searching and categorizing products
- Integration with the Signal-based state management store

## Features

- **Product Listing**: Displays a list of available products with pagination and sorting capabilities
- **Product Filtering**: Allows users to filter products by name and category
- **Pagination Support**: Built-in pagination for handling large product catalogs
- **Sorting Options**: Configure product sorting (e.g., by name, price, update date)
- **Available Products Only**: Automatically filters out unavailable products
- **Reactive Design**: Built with Angular's Signal-based architecture
- **Product Quantity Selected**: Allows users to select the quantity of products they want to order and update the products with persistence cart from local storage or firebase.

## Running unit tests

Run `nx test llecoop-user-order-product-list-feature` to execute the unit tests.

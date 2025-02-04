# llecoop-order-list

- [llecoop-order-list](#llecoop-order-list)
  - [Description](#description)
  - [API](#api)
    - [LlecoopOrderListStore](#llecooporderliststore)
    - [LlecoopUserOrderStore](#llecoopuserorderstore)
  - [Mocks](#mocks)
  - [Running unit tests](#running-unit-tests)

## Description

This library is part of the Llecoop order management system. It provides functionalities to access and manipulate user order lists.

## API

### LlecoopOrderListStore

**Methods:**

- `getAll()`: Retrieves all order lists.
- `create()`: Creates a new order list.
- `changeStatus()`: Changes the status of an order list.
- `cancel()`: Cancels an order list.
- `delete()`: Deletes an order list.
- `getAllOrderListOrders()`: Retrieves all orders for a specific order list.
- `setSorting()`: Sets the sorting order.
- `setSelectedItemId()`: Sets the selected item ID.
- `getItemById()`: Retrieves an order list by ID.
- `setSelectedItemUserOrderId()`: Sets the selected user order ID.

**Computed Properties:**

- `count`: Number of orders.
- `currentOrder`: The current order.
- `currentOrderProducts`: Products in the current order.
- `currentOrderCount`: Count of items in the current order.
- `selectedItem`: The selected item.
- `selectedItemUserOrder`: The selected user order.

### LlecoopUserOrderStore

**Methods:**

- `getAll()`: Retrieves all user orders.
- `create()`: Creates a new user order.
- `update()`: Updates a user order.
- `delete()`: Deletes a user order.
- `setSorting()`: Sets the sorting order.
- `setSelectedItemId()`: Sets the selected item ID.

**Computed Properties:**

- `count`: Number of user orders.
- `selectedItem`: The selected item.

## Mocks

The mocks for testing purposes can be found in the `mocks` folder, which includes:

- [order-list-store.mock.ts](src/mocks/order-list-store.mock.ts)
- [user-order-store.mock.ts](src/mocks/user-order-store.mock.ts)

## Running unit tests

Run `nx test llecoop-order-list` to execute the unit tests.

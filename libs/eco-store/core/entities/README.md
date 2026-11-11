# @plastik/eco-store/entities

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

## Description

Compatibility re-export of [`@plastik/eco/entities`](../../../eco/entities/README.md).

The eco domain entities (tenant, product, product category, cart, order) moved to `libs/eco/entities` so that `eco-admin` can share them (AREF-01).
This library keeps the `@plastik/eco-store/entities` alias working for the eco-store code that already imports it, and exports exactly what `@plastik/eco/entities` exports.

New code imports from `@plastik/eco/entities` directly. Do not add entities here.

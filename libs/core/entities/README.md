# @plastik/core/entities

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

- [@plastik/core/entities](#plastikcoreentities)
  - [Description](#description)
    - [Key Types](#key-types)

## Description

**Core Entities** provides foundational structures, interfaces, and configurations for managing entities within the repository. It serves as a shared domain layer for core type definitions.

### Key Types

- **`PocketBaseUserRoles`**: Defines user role types for the application:
  - `PARTNER`: Partner user role
  - `GLOBAL_ADMIN`: Global administrator with full system access
  - `TENANT_ADMIN`: Tenant-level administrator with organization-specific permissions
- **`PocketBaseUser`**: User entity with tenant reference and contact information
- **`UserContact`**: User contact details structure

# Plastikspace

<div align="center">
  <img width="100" src="./documentation/img/plastikaweb.png" alt="plastikaweb">
</div>

## A personal multi-repository to do tests and experiments with Nx and Angular

<div align="center">

[![Deploy Staging](https://github.com/plastikaweb/plastikspace/actions/workflows/ci.yml/badge.svg)](https://github.com/plastikaweb/plastikspace/actions/workflows/ci.yml)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/plastikaweb/plastikspace)

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-a08021?style=for-the-badge&logo=firebase&logoColor=ffcd34)
![PocketBase](https://img.shields.io/badge/pocketbase-%23b8dbe4.svg?style=for-the-badge&logo=Pocketbase&logoColor=black)
![Apollo-GraphQL](https://img.shields.io/badge/-ApolloGraphQL-311C87?style=for-the-badge&logo=apollo-graphql)

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=for-the-badge)](http://commitizen.github.io/cz-cli/)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg?style=for-the-badge)](https://github.com/facebook/jest)
![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)
![Accessibility](https://img.shields.io/badge/Accessibility-%230170EA.svg?style=for-the-badge&logo=Accessibility&logoColor=white)

[![built with Codeium](https://codeium.com/badges/main)](https://codeium.com)

</div>

- [Plastikspace](#plastikspace)
  - [A personal multi-repository to do tests and experiments with Nx and Angular](#a-personal-multi-repository-to-do-tests-and-experiments-with-nx-and-angular)
  - [📥 Installation](#-installation)
  - [🔧 Commands and Generators](#-commands-and-generators)
  - [📘 Documentation and Conventions](#-documentation-and-conventions)
  - [📱 Applications](#-applications)
  - [📚 Libraries](#-libraries)
    - [🧩 Core](#-core)
      - [API and Data Access](#api-and-data-access)
      - [Utilities](#utilities)
      - [UI and Layout](#ui-and-layout)
    - [🔄 Shared](#-shared)
      - [Signal State (NgRx Signal Store)](#signal-state-ngrx-signal-store)
      - [Auth](#auth)
      - [UI Components](#ui-components)
      - [Utilities](#utilities-1)
  - [📬 Contact](#-contact)
    - [Carlos Matheu Armengol](#carlos-matheu-armengol)

---

## 📥 Installation

> Please make sure you have [rimraf](https://www.npmjs.com/package/rimraf) package installed globally.

```bash
npm install -g rimraf
```

1. **Clone repo**: `git clone git@github.com:plastikaweb/plastikspace.git`
2. **Install dependencies**: `yarn install:local`
3. **Serve locally**: `yarn <app-name>:serve`

## 🔧 Commands and Generators

Common Nx commands:

- **Generate App**: `ng g @nx/angular:app my-app`
- **Generate Lib**: `ng g @nx/angular:lib my-lib`
- **Serve**: `ng serve my-app`
- **Build**: `ng build my-app`
- **Test**: `yarn test`
- **Dep Graph**: `yarn dep-graph`

> **Tip**: Use [Nx Console for VSCode](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console) for a visual interface.

## 📘 Documentation and Conventions

- [🏛️ NX Architecture](documentation/nx-architecture.md)
- [🎨 Code Style](documentation/code-style.md)
- [♿ Accessibility](documentation/accessibility.md)
- [📝 Git Commit Conventions](documentation/commit-conventions.md)
- [🔄 Git Flow and CI/CD](documentation/git-flow.md)
- [💅 CSS Styling](documentation/css-styles.md)

## 📱 Applications

| Application                                             | Description                    |
| :------------------------------------------------------ | :----------------------------- |
| [**nasa-images**](apps/nasa-images/README.md)           | NASA Image Gallery             |
| [**llecoop**](apps/llecoop/README.md)                   | Llecoop main application       |
| [**llecoop-firebase**](apps/llecoop-firebase/README.md) | Firebase functions for Llecoop |
| [**llecoop-triggers**](apps/llecoop-triggers/README.md) | Triggers for Llecoop           |
| [**plastikaweb**](apps/plastikaweb/README.md)           | Personal website               |
| [**eco-store**](apps/eco-store/README.md)               | E-commerce demo                |

## 📚 Libraries

### 🧩 Core

Foundation libraries used across applications.

#### API and Data Access

- [**api-base**](libs/core/util/api-base/README.md): Base interfaces and types for API services.
- [**api-http**](libs/core/util/api-http/README.md): Generic HTTP CRUD services.
- [**api-firebase**](libs/core/util/api-firebase/README.md): Generic Firebase CRUD services.
- [**api-pocketbase**](libs/core/util/api-pocketbase/README.md): Generic PocketBase CRUD services.

#### Utilities

- [**environments**](libs/core/util/environments/README.md): Environment configuration helpers.
- [**assets**](libs/core/util/assets/README.md): Asset management.
- [**cypress-commands**](libs/core/util/cypress-commands/README.md): Custom Cypress commands.
- [**paginator**](libs/core/paginator/README.md): Material Paginator internationalization service.

#### UI and Layout

- [**cms-layout**](libs/core/cms-layout/feature/README.md): CMS layout features.
- [**ng-entry-html**](libs/core/ng-entry-html/util/README.md): HTML entry utilities.
- [**styles**](libs/core/styles/util/tailwind-preset/README.md): Core styles and presets.

### 🔄 Shared

Reusable features and UI components.

#### Signal State (NgRx Signal Store)

- [**data-access-http**](libs/shared/signal-state/data-access-http/README.md): Signal Store features for HTTP.
- [**data-access-firebase**](libs/shared/signal-state/data-access-firebase/README.md): Signal Store features for Firebase.
- [**data-access-pocketbase**](libs/shared/signal-state/data-access-pocketbase/README.md): Signal Store features for PocketBase.

#### Auth

- [**auth-feature**](libs/shared/auth/feature/README.md)
- [**auth-firebase**](libs/shared/auth/firebase/data-access/README.md)
- [**auth-pocketbase**](libs/shared/auth/pocketbase/data-access/README.md)
- [**login**](libs/shared/auth/login/feature/README.md)
- [**register**](libs/shared/auth/register/feature/README.md)

#### UI Components

- [**button**](libs/shared/button/ui/README.md)
- [**table**](libs/shared/table/ui/README.md)
- [**form**](libs/shared/form/feature/README.md)
- [**notification**](libs/shared/notification/data-access/README.md)
- [**activity**](libs/shared/activity/ui/README.md)
- [**img-container**](libs/shared/img-container/ui/README.md)
- [**mat-theme-toggle**](libs/shared/mat-theme-toggle/README.md)
- [**pagination-ui**](libs/shared/pagination/ui/README.md)
- [**pagination-util**](libs/shared/pagination/util/README.md)
- [**sort-selector**](libs/shared/sort-selector/README.md)

#### Utilities

- [**storage**](libs/shared/storage/data-access/README.md)
- [**testing**](libs/shared/testing/README.md)
- [**util**](libs/shared/util/objects/README.md)

## 📬 Contact

### Carlos Matheu Armengol

[![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/plastikaweb)

> 📧 [info@plastikaweb.org](mailto:info@plastikaweb.com)
> 🌐 [www.plastikaweb.com](https://www.plastikaweb.com)

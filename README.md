# Plastikspace

<div align="center">
  <img width="100" src="./documentation/img/plastikaweb.png" alt="plastikaweb">
</div>

## Modern Angular Experimentation Lab

### A personal multi-repository to explore Nx, Angular 21, and cutting-edge web technologies

<div align="center">

[![Deploy Staging](https://github.com/plastikaweb/plastikspace/actions/workflows/ci.yml/badge.svg)](https://github.com/plastikaweb/plastikspace/actions/workflows/ci.yml)
![Coverage](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/plastikaweb/bd70c4cce17a0ad5e1af4a9f063ebdc7/raw/coverage-badge.json)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/plastikaweb/plastikspace)

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular 21](https://img.shields.io/badge/angular-21-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![TailwindCSS 4](https://img.shields.io/badge/tailwindcss-4-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Signals](https://img.shields.io/badge/NgRx-Signals-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-a08021?style=for-the-badge&logo=firebase&logoColor=ffcd34)
![PocketBase](https://img.shields.io/badge/pocketbase-%23b8dbe4.svg?style=for-the-badge&logo=Pocketbase&logoColor=black)
![Apollo-GraphQL](https://img.shields.io/badge/-ApolloGraphQL-311C87?style=for-the-badge&logo=apollo-graphql)

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=for-the-badge)](http://commitizen.github.io/cz-cli/)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg?style=for-the-badge)](https://github.com/facebook/jest)
![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)
![Accessibility](https://img.shields.io/badge/Accessibility-%230170EA.svg?style=for-the-badge&logo=Accessibility&logoColor=white)

</div>

---

## 🚀 Tech Stack Highlights

- **Framework:** [Angular 21](https://angular.io/) (Standalone Components, Signals, Hydration)
- **Monorepo Tooling:** [Nx](https://nx.dev/) (Project Graph, Distributed Task Execution)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management:** [NgRx Signal Store](https://ngrx.io/guide/signals/signal-store)
- **Backend Integrations:**
  - **Firebase:** Real-time DB, Auth, and Cloud Functions (llecoop)
  - **PocketBase:** Lightweight Go backend (eco-store)
  - **GraphQL:** Apollo Client integration (plastikaweb)
- **Quality Assurance:** Jest, Cypress, Pa11y (Accessibility), ESLint

---

## 🏗️ Architecture

This project follows a **Domain-Driven Design (DDD)** approach within an Nx workspace.

```mermaid
graph TD
    subgraph Applications
        Apps[Apps: eco-store, llecoop, nasa-images, etc.]
    end

    subgraph Libraries
        direction TB
        Shared[Shared: UI, Signal State, Auth, Utils]
        Core[Core: API Base, Layout, CMS, Env]
    end

    Apps --> Shared
    Apps --> Core
    Shared --> Core
```

For more details, see the [🏛️ NX Architecture Guide](documentation/nx-architecture.md).

---

## 📥 Getting Started

### Prerequisites

- **Node.js**: v22 (see `.nvmrc`)
- **Yarn**: v4+
- **rimraf**: `npm install -g rimraf` (required for clean scripts)

### Installation

1. **Clone the repo**

   ```bash
   git clone git@github.com:plastikaweb/plastikspace.git
   cd plastikspace
   ```

2. **Full Environment Setup**

   ```bash
   yarn install:local
   ```

---

## 🔧 Development Commands

### Running Applications (Full Local Environment)

Some apps require a backend to be running. These commands start both:

| Command                  | Description                                          |
| :----------------------- | :--------------------------------------------------- |
| `yarn eco-store:local`   | Starts **PocketBase** + **eco-store** frontend       |
| `yarn llecoop:local`     | Starts **Firebase Emulators** + **llecoop** frontend |
| `yarn nasa-images:serve` | Starts the NASA image gallery                        |
| `yarn plastikaweb:serve` | Starts the personal website                          |

### Common Nx Tasks

- **Test Everything**: `yarn test:all`
- **Lint Everything**: `yarn lint:all`
- **Visualize Workspace**: `yarn dep-graph`
- **Affected Changes**: `nx affected:test`

---

## 📘 Documentation & Standards

| Resource                                               | Description                                  |
| :----------------------------------------------------- | :------------------------------------------- |
| [🎨 Code Style](documentation/code-style.md)           | ESLint, Prettier, and Angular best practices |
| [📝 Commit Guide](documentation/commit-conventions.md) | Conventional Commits & Commitizen usage      |
| [♿ Accessibility](documentation/accessibility.md)     | WCAG compliance and Pa11y testing            |
| [🌐 I18n Guide](documentation/i18n.md)                 | ngx-translate and multi-language support     |
| [💅 CSS Styling](documentation/css-styles.md)          | Tailwind 4 configuration and presets         |

---

## 📱 Applications Overview

| Application                                   | Stack                | Description                         |
| :-------------------------------------------- | :------------------- | :---------------------------------- |
| [**eco-store**](apps/eco-store/README.md)     | PocketBase, Signals  | Modern e-commerce showcase.         |
| [**llecoop**](apps/llecoop/README.md)         | Firebase, NgRx       | Collaborative shopping application. |
| [**nasa-images**](apps/nasa-images/README.md) | Public API, Material | NASA imagery explorer.              |
| [**plastikaweb**](apps/plastikaweb/README.md) | GraphQL, Apollo      | Personal portfolio & blog.          |

---

## 📚 Libraries Portfolio

<details>
<summary><b>🧩 Core Libraries</b> (Fundamental Infrastructure)</summary>

- **API & Data**: `api-base`, `api-http`, `api-firebase`, `api-pocketbase`
- **Infrastructure**: `environments`, `assets`, `cypress-commands`, `paginator`
- **Layout**: `cms-layout`, `ng-entry-html`, `styles` (Tailwind Presets)

</details>

<details>
<summary><b>🔄 Shared Libraries</b> (Reusable Features)</summary>

- **Signal State**: `data-access-http`, `data-access-firebase`, `data-access-pocketbase`
- **Auth**: `auth-feature`, `auth-firebase`, `auth-pocketbase`, `login`, `register`
- **UI Components**: `button`, `table`, `form` (Formly), `notification`, `mat-theme-toggle`
- **Utils**: `storage`, `testing`, `countdown`, `objects`

</details>

---

## 📬 Contact

### Carlos Matheu Armengol

[![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/plastikaweb)

> 📧 [info@plastikaweb.com](mailto:info@plastikaweb.com)
> 🌐 [www.plastikaweb.com](https://www.plastikaweb.com)

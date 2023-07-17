# Plastikspace

<div align="center">
  <img width="15%" height="15%" src="./documentation/img/plastikaweb.png">
  <p>A personal multi-repository to do tests and experiments with Nx and Angular. </p>
</div>

[![Deploy Staging](https://github.com/plastikaweb/plastikspace/actions/workflows/cd-dev.yml/badge.svg)](https://github.com/plastikaweb/plastikspace/actions/workflows/cd-dev.yml)

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=for-the-badge)](http://commitizen.github.io/cz-cli/)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg?style=for-the-badge)](https://github.com/facebook/jest)
![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)

This project was generated using [Nx](https://nx.dev).

## Install repo locally

- clone repo: `git clone git@github.com:plastikaweb/plastikspace.git`.
- run `yarn install:local`.
- **to serve it locally in development run `yarn <apn-name>:serve`**.

## Commands & generators

Some of the more usual generators and scripts:

- Run `ng g @nx/angular:app my-app` to generate an application.
- Run `ng g @nx/angular:lib my-lib` to generate a library.
- Run `ng serve my-app` for a dev server. Navigate to localhost:xxxx. The app will automatically reload if you change any of the source files.
- Run `ng g component my-component --project=my-app` to generate a new component.
- Run `ng build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.
- Run `yarn test` to execute the unit tests via [Jest](https://jestjs.io).
- Run `yarn affected:test` to execute the unit tests affected by a change.
- Run `yarn dep-graph` to see a diagram of the dependencies of your projects.

To see a full list of available scripts see **package.json file > scripts**.

> It is strongly recommended to use [Nx Console for VSCode](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console) in order to run Nx generators.
> ![Nx Console for VSCode](documentation/img/nx-console-screenshot.png)

## Workflow configuration and conventions

- [NX architecture](documentation/nx-architecture.md)
- [Code style](documentation/code-style.md)
- [Accessibility](documentation/accessibility.md)
- [Git commit conventions](documentation/commit-conventions.md)
- [Git Flow and CI/CD](documentation/git-flow.md)

## Available applications

- [nasa-images](apps/nasa-images/README.md)
- [experimental](apps/experimental/README.md)

## Available libraries

This is a list of all the global shared libraries. It is very likely that other libraries exist but are related to a single project, so they are listed in the concrete project domain.

### Core

- [core-util-environments](libs/core/util/environments/README.md)
- [core-util-assets](libs/core/util/assets/README.md)
- [core-util-api](libs/core/util/api/README.md)
- [core-styles-util-tailwind-preset](libs/core/styles/util/tailwind-preset/README.md)
- [core-ng-entry-html-util](libs/core/ng-entry-html/util/README.md)
- [core-router-data-access](libs/core/router/data-access//README.md)
- [core-entities](libs/core/entities/README.md)

#### CMS-layout

- [core-cms-layout-feature](libs/core/cms-layout/feature/README.md)
- [core-cms-layout-data-access](libs/core/cms-layout/data-access/README.md)

#### Notification

- [core-notification-entities](libs/core/notification/entities/README.md)
- [core-notification-data-access](libs/core/notification/data-access/README.md)
- [core-notification-ui-mat-snackbar](libs/core/notification/ui/mat-snackbar/README.md)

### Shared

#### Button

- [shared-button-entities](libs/shared/button/entities/README.md)
- [shared-button-ui](libs/shared/button/ui/README.md)

#### Table

- [shared-table-entities](libs/shared/table/entities/README.md)
- [shared-table-ui](libs/shared/table/ui/README.md)

#### Form

- [shared-form-feature](libs/shared/form/feature/README.md)
- [shared-form-ui-year-picker/shared-form-ui-year-picker-type](libs/shared/form/ui/year-picker/README.md)

#### Activity

- [shared-activity-ui](libs/shared/activity/ui/README.md)
- [shared-activity-data-access](libs/shared/activity/data-access/README.md)

#### Util

- [shared-util-entities](libs/shared/util/entities/README.md)
- [shared-util-objects](libs/shared/util/objects/README.md)
- [shared-util-return-as-observable-pipe](libs/shared/util/return-as-observable-pipe/README.md)
- [shared-util-formatters](libs/shared/util/formatters/README.md)

## Contact

Carlos Matheu Armengol

![Freelancer](https://img.shields.io/badge/Freelancer-29B2FE?style=for-the-badge&logo=Freelancer&logoColor=white)
[![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/plastikaweb)
[![Stackblitz](https://img.shields.io/badge/Stackblitz-fff?style=for-the-badge&logo=Stackblitz&logoColor=1389FD)](https://stackblitz.com/@plastikaweb)
[![GitLab](https://img.shields.io/badge/gitlab-%23181717.svg?style=for-the-badge&logo=gitlab&logoColor=white)](https://gitlab.com/plastikaweb)

> [info@plastikaweb.org](mailto:<info@plastikaweb.com>) > [www.plastikaweb.com](https://www.plastikaweb.com)

## Useful links

- [Nx Angular Documentation](https://nx.dev/angular)

# Plastikspace

<div align="center">
  <img width="15%" height="15%" src="./documentation/img/plastikaweb.png">
  <p>A personal multi-repository to do tests and experiments with Nx and Angular. </p>
</div>

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=for-the-badge)](http://commitizen.github.io/cz-cli/)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg?style=for-the-badge)](https://github.com/facebook/jest)

This project was generated using [Nx](https://nx.dev).

## Install repo locally

- clone repo: `git clone git@github.com:plastikaweb/plastikspace.git`.
- execute `yarn install:local`.
- **to serve it locally in development run `yarn <apn-name>:serve`**.

## Commands & generators

Some of the more usual generators and scripts:

- Run `ng g @nrwl/angular:app my-app` to generate an application.
- Run `ng g @nrwl/angular:lib my-lib` to generate a library.
- Run `ng serve my-app` for a dev server. Navigate to localhost:xxxx. The app will automatically reload if you change any of the source files.
- Run `ng g component my-component --project=my-app` to generate a new component.
- Run `ng build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.
- Run `yarn test` to execute the unit tests via [Jest](https://jestjs.io).
- Run `yarn affected:test` to execute the unit tests affected by a change.
- Run `yarn dep-graph` to see a diagram of the dependencies of your projects.

To see a full list of available scripts see **package.json file > scripts**.

> It is strongly recommended to use [Nx Console for VSCode](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console) in order to run Nx generators.
> ![Nx Console for VSCode](documentation/img/nx-console-screenshot.png)

## Style configuration and conventions

- [Git commit conventions](documentation/commit-conventions.md)

## Available applications

- [nasa-images](apps/nasa-images/README.md)

## Available libraries

This is a list of all the global shared libraries. It is very likely that other libraries exist but are related to a single project, so they are listed in the concrete project domain.

### @ngrx related

- [router-state](libs/router-state/README.md)

### Core Apps Configuration

- [environments](libs/environments/README.md)
- [tailwind-preset](libs/tailwind-preset/README.md)

### Shared

#### UI

- [ui-header](libs/shared/ui-header/README.md)
- [ui-footer](libs/shared/ui-footer/README.md)

#### Assets

- [assets](libs/shared/assets/README.md)

#### Utils

- [objects](libs/shared/utils/objects/README.md)

## Contact

Carlos Matheu Armengol

Email: info@plastikaweb.org  
LinkedIn: [plastikaweb](https://www.linkedin.com/in/plastikaweb)  
Web: [plastikaweb.com](https://www.plastikaweb.com)  
Stackblitz: [@plastikaweb](https://stackblitz.com/@plastikaweb)  
Gitlab: [@gitlab](https://gitlab.com/plastikaweb)

## Useful links

- [Nx Angular Documentation](https://nx.dev/angular)

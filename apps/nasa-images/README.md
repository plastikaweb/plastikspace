# NASA Images

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [NASA Images](#nasa-images)
  - [Description](#description)
  - [Features](#features)
  - [Quick Start](#quick-start)
  - [Development Commands](#development-commands)
  - [Architecture \& Libraries](#architecture--libraries)
    - [🔄 Shared](#-shared)
    - [🔍 Search View](#-search-view)
    - [❓ FAQs View](#-faqs-view)
  - [Resources](#resources)

## Description

**NASA Images** is an application that allows users to search and view images from the NASA Image and Video Library. It serves as a demonstration of consuming external APIs and displaying rich media content.

> 📘 **Documentation**: See the [NASA Image library analysis wiki](https://github.com/plastikaweb/plastikspace/wiki/nasa-image-library-project) for detailed analysis and requirements.

## Features

- **Image Search**: Search the NASA archives using keywords.
- **Media Viewer**: View high-quality images and specific details.
- **FAQs**: Application information and common questions.

## Quick Start

1. **Install Dependencies**: `yarn install`
2. **Serve Application**: `yarn nasa-images:serve`

## Development Commands

- **Serve**: `yarn nasa-images:serve`
- **Lint**: `yarn nasa-images:lint`
- **Test**: `yarn nasa-images:test`
- **E2E**: `yarn nasa-images:e2e`
- **Build**: `yarn nasa-images:build`

## Architecture & Libraries

### 🔄 Shared

- [**data-access**](../../libs/nasa-images/data-access/README.md)

### 🔍 Search View

- [**search-feature**](../../libs/nasa-images/search/feature/README.md)
- [**search-data-access**](../../libs/nasa-images/search/data-access/README.md)
- [**search-entities**](../../libs/nasa-images/search/entities/README.md)
- [**search-ui-no-results**](../../libs/nasa-images/search/ui/no-results/README.md)

### ❓ FAQs View

- [**faqs-feature**](../../libs/nasa-images/faqs/feature/README.md)

## Resources

- [NASA Images API Docs](https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf)
- [Repository Folder](https://github.com/plastikaweb/plastikspace/tree/develop/apps/nasa-images)
- [Staging Deploy](https://www.nasa-images-staging.plastikaweb.com)

# @plastik/shared/util/highlight

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

## Description

A utility library providing text highlighting capabilities for Angular applications.

## Features

- **HighlightPipe**: A standalone pipe (`highlight`) that wraps matching search terms in a `<mark>` tag.
- **Accent Insensitive**: Uses `latinize` utility to match terms regardless of accents (e.g., searching "piz" will match "Pizza").
- **Case Insensitive**: Matches terms regardless of case while preserving the original casing in the output.
- **Safe HTML**: Returns `SafeHtml` to allow direct binding to `[innerHTML]`.

## Usage

```html
<span [innerHTML]="text | highlight: searchTerm"></span>
```

## Running unit tests

Run `nx test shared-util-highlight` to execute the unit tests via Vitest.

# core-ng-entry-html-util

- [core-ng-entry-html-util](#core-ng-entry-html-util)
  - [Description](#description)
  - [Single index.html](#single-indexhtml)

## Description

A collection of configuration files to share and avoid DRY between angular applications.

![loading html example page](loading.png)

> initial loading example for project nasa-images

## Single index.html

We are using a single `index.html` file for root angular template bootstrapping.

Each time we add a new application, we should:

- Remove the automatically created app `index.html` file inside `{new-app}/src` folder.
- Update `project.json` application `architect/build/options/index` property value in order to point to the shared `index.html` file:

```json
 "index": "libs/core/ng-entry-html/util/src/index.html",
```

- update the new app app.component.ts selector to `plastik-root`:

```typescript
@Component({
  selector: 'plastik-root',
  templateUrl: './app.component.html',
})
export class AppComponent {}
```

- The svg app file.

You need to have a favicon.svg file in your app assets directory, in order to appear while preloading it. This favicon is the same that will be used as a html head favicon.

```bash
// The path to your favicon svg file
assets/img/favicon.svg
```

# filter-array-pipe

- [filter-array-pipe](#filter-array-pipe)
  - [Description](#description)
  - [How to use](#how-to-use)
  - [Running unit tests](#running-unit-tests)

## Description

Angular pipe used when you need to filter an array on your template.

## How to use

```typescript
class CustomComponent {
  data = [
    {
      id: '1',
      name: 'one',
    },
    {
      id: '2',
      name: 'two',
    },
  ];
}
```

```html
@for (item of data | filterArray: ['name':] 'one'; track item.id) {
<div>{{ item.name }}</div>
}
```

## Running unit tests

Run `nx test filter-array-pipe` to execute the unit tests.

# shared-util-return-as-observable-pipe

- [shared-util-return-as-observable-pipe](#shared-util-return-as-observable-pipe)
  - [Description](#description)
  - [How to use](#how-to-use)
  - [Running unit tests](#running-unit-tests)

## Description

Angular pipe used when you need to return an observable on your template.

Uses the selector **returnAsObservable**.

> A common use is in conjunction with the [@ngrx pushPipe](https://ngrx.io/api/component/PushPipe) or the async pipe, when you need to normalize mixed data with rxjs observable data.

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
@ngFor (let item of data | returnAsObservable | async) {
<div>{{ item.name }}</div>
}
```

## Running unit tests

Run `nx test shared-util-return-as-observable-pipe` to execute the unit tests.

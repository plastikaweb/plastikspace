# shared-form-feature

## Description

A container to inject a form configuration and dynamically create a form with buttons and extras.

## HTML element

`<plastik-shared-table>`

## Formly

It uses internally [Formly Library](https://formly.dev/) that is build on top of Angular Reactive Forms to generate automatically forms.

## Inputs

| Name              | Type                       | Description                     | Default |
| ----------------- | -------------------------- | ------------------------------- | ------- |
| `fields`          | `<Array>FormlyFieldConfig` | the form controls configuration |         |
| `model`           | `T`                        | data model to populate the form |         |
| `submitAvailable` | `boolean`                  | show submit button              | true    |

> To use a button with an image, you must provide image or icon input but no both. Image has preference.

## Output

| Name          | Type              | Description          |
| ------------- | ----------------- | -------------------- |
| `changeEvent` | `EventEmitter<T>` | emits a change event |

## Example

```typescript
  # model and fields @Input

  model = {
    email: 'test@test.com',
    name: 'test,
  };

  fields: FormlyFieldConfig[] = [
    {
      key: 'email',
      type: 'input',
      props: {
        type: 'email',
        label: 'Email address',
        placeholder: 'Email address',
        required: true,
      },
      validators: {
        validation: Validators.compose([Validators.required, Validators.email]),
      },
    },
    {
      key: 'name',
      type: 'input',
      props: {
        type: 'text',
        label: 'Name',
        placeholder: 'Name',
        minLength: 8,
      },
    },
  ];

  onSubmit(model) {
    // do any action with model, call an API service, a local storage service, or a @ngrx action.
  }
```

```html
# template

<plastik-shared-form-feature [fields]="fields" [model]="model" (changeEvent)="onSubmit($event)"> </plastik-shared-form-feature>
```

## Links

- [Formly Library](https://formly.dev/)
- [Angular Reactive Forms](https://angular.io/guide/reactive-forms)

## Running unit tests

Run `nx test shared-form-feature` to execute the unit tests.

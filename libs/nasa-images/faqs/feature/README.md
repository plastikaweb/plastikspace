# nasa-images-faqs-feature

A feature component library to print a FAQs list loaded from the `assets/json/faqs.json` file.

```typescript
// The shape of the FAQs

export interface FAQ {
  question: string;
  answer: string;
}
```

## Running unit tests

Run `nx test nasa-images-faqs-feature` to execute the unit tests.

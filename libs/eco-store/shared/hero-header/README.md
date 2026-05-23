# eco-store-hero-header

Shared hero header component for eco-store views. Provides the `.hero-header`
shell (organic background pattern, responsive padding, subtitle/title typography)
plus convenience inputs and content projection slots so every page reuses the
same header treatment without duplicating markup or global styles.

## Usage

### Simple case (inputs only)

```html
<eco-store-hero-header
  icon="shopping_cart"
  [subtitle]="'cart.summary.itemsCount' | translate: { value: cartStore.itemsCount() }"
  [title]="'cart.steps.summary.title' | translate" />
```

### With trailing action

```html
<eco-store-hero-header
  icon="receipt_long"
  [subtitle]="'orders.list.loadedCount' | translate: { count: ordersStore.count() }"
  [title]="'orders.list.title' | translate"
  headerRole="presentation">
  <plastik-sort-selector
    heroAction
    [options]="ordersStore.sortOptions()"
    [currentSort]="ordersStore.sort()"
    (sortChange)="sort($event)" />
</eco-store-hero-header>
```

### With extras below (default slot)

```html
<eco-store-hero-header
  [icon]="product()?.categoryIcon ?? ''"
  [subtitle]="product()?.categoryName ?? ''"
  [title]="product()?.name ?? ''"
  titleClass="category-title font-black">
  <eco-store-shared-favorite-button
    heroAction
    size="md"
    [isFavorite]="isFavorite()"
    (toggleFavorite)="toggleFavorite()" />
  <div class="flex flex-wrap gap-2" role="list">
    @for (tag of productTags; track tag.label) {
    <plastik-shared-chip role="listitem" [icon]="tag.icon" [label]="tag.label | translate" />
    }
  </div>
</eco-store-hero-header>
```

### Custom layout

When the inputs do not fit (e.g. order detail with an inline status chip and
date), omit the inputs and project the entire content via the default slot:

```html
<eco-store-hero-header>
  <div class="flex w-full flex-row items-center justify-between gap-2">
    <div class="category-subtitle flex items-center gap-2">
      <mat-icon aria-hidden="true">receipt_long</mat-icon>
      <!-- title + chip + date -->
    </div>
    <button matButton="filled">…</button>
  </div>
</eco-store-hero-header>
```

## API

### Inputs

| Name            | Type             | Default                                       | Description                                                            |
| --------------- | ---------------- | --------------------------------------------- | ---------------------------------------------------------------------- |
| `title`         | `string`         | `''`                                          | Heading text rendered inside `<h2>`. Pre-translate at the call site.   |
| `icon`          | `string`         | `''`                                          | Material icon name shown in the subtitle row.                          |
| `subtitle`      | `string`         | `''`                                          | Subtitle text rendered next to the icon.                               |
| `compact`       | `boolean`        | `false`                                       | Applies the `hero-header--compact` modifier (reduced padding).         |
| `revealDelay`   | `string`         | `'50ms'`                                      | Sets the `--delay` CSS variable consumed by the `reveal-up` animation. |
| `disableReveal` | `boolean`        | `false`                                       | Skips the `reveal-up` animation class.                                 |
| `headerRole`    | `string \| null` | `null`                                        | Optional `role` attribute on the host `<header>` element.              |
| `titleClass`    | `string`         | `'category-title font-bold'`                  | Class string applied to the rendered `<h2>`.                           |
| `subtitleClass` | `string`         | `'category-subtitle flex items-center gap-2'` | Class string applied to the subtitle wrapper.                          |

### Content projection slots

| Selector       | Purpose                                                                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `[heroAction]` | Element placed at the right of the title row (sort selector, button…).                                                               |
| _default_      | Rendered inside `.hero-content` after the title row. Use for tags, descriptions, or full custom layouts when no inputs are provided. |

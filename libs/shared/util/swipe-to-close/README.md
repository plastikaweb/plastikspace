# swipe-to-close-util

`@plastik/shared/util/swipe-to-close` (`scope:shared`, `type:util`): `SwipeToCloseDirective`.
A swipe to the left closes a panel sliding in from the left, such as a `mat-sidenav` in `over` mode. Material's drawer closes on Escape and on its backdrop, but not on a swipe.

```html
<mat-sidenav mode="over" plastikSwipeToClose [opened]="isOpen()" (swipeClose)="isOpen.set(false)"
  >…</mat-sidenav
>
```

- While the finger is down the panel follows it to the left (`transform` inline, `transition: none`), never to the right.
- On release it emits `swipeClose` when the swipe reached `swipeCloseThreshold` (`SWIPE_TO_CLOSE_DEFAULT_PX`, 80 px). Otherwise it drops the inline styles and the host's own transition slides the panel back.
- The first 8 px decide the axis: a mostly vertical drag stays a scroll of the panel and never moves it.
- A second finger or `touchcancel` drops the gesture.

The directive never opens or closes anything: the host does, so its animation, focus handling and backdrop stay its own.
It supports a panel on the left only: a panel on the right, or a right-to-left layout, would need the direction reversed.

The slide back is a Web Animation, not a CSS transition: `mat-drawer` takes any `transitionend` on itself for the end of its own animation,
emits `openedChange(true)` again and records the focused element, inside the drawer, as the one to give the focus back to.

Used by the drawer of the eco-admin shell (`@plastik/eco-admin/layout`). eco-store's mobile `mat-sidenav` (`libs/eco-store/core/layout`) is the same case and does not use it yet.

## Running unit tests

Run `yarn nx test swipe-to-close-util` to execute the unit tests.

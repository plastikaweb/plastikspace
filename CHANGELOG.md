# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2026-02-20] - Performance Improvements

### Changed

- Replaced inline function calls in templates with computed signals to reduce per-render recalculations ([#895](https://github.com/plastikaweb/plastikspace/issues/895))
- Consolidated CSS color palette into theme files, eliminating redundant `color-palette.css` ([#895](https://github.com/plastikaweb/plastikspace/issues/895))
- Refactored cart store and `img-container` component for better performance ([#895](https://github.com/plastikaweb/plastikspace/issues/895))
- Improved PocketBase storage loader efficiency ([#895](https://github.com/plastikaweb/plastikspace/issues/895))

---

## [2026-02-19] - Responsive Design Improvements

### Added

- Added custom Material stepper icons per cart step (`shopping_cart`, `box`, `thumb_up`) via `STEPPER_GLOBAL_OPTIONS` ([#874](https://github.com/plastikaweb/plastikspace/issues/874))
- Added CSS container queries (`@container` / `@xl`) for responsive cart item card layout ([#874](https://github.com/plastikaweb/plastikspace/issues/874))

### Changed

- Refactored core Tailwind breakpoint system to align with Angular Material breakpoints and added descriptive comments ([#874](https://github.com/plastikaweb/plastikspace/issues/874))
- Restructured cart summary and shipping layouts using CSS Grid (`md:grid-cols-3`) ([#874](https://github.com/plastikaweb/plastikspace/issues/874))
- Renamed spacing CSS variables from `eco-space-*` to `space-*` ([#874](https://github.com/plastikaweb/plastikspace/issues/874))
- Updated theme CSS variables across all five eco-store themes ([#874](https://github.com/plastikaweb/plastikspace/issues/874))

---

## [2026-02-18] - README Links & JSDoc Warnings

### Fixed

- Fixed broken links in `eco-store` README ([#892](https://github.com/plastikaweb/plastikspace/issues/892))
- Resolved JSDoc warnings in core entities and layout utilities ([#892](https://github.com/plastikaweb/plastikspace/issues/892))
- Enabled TypeScript project references for `pagination` UI library ([#892](https://github.com/plastikaweb/plastikspace/issues/892))

---

## [2026-02-18] - Test Coverage & Accessibility

### Added

- Added comprehensive unit tests for `UserAvatar`, `EcoStoreUnitChip`, `StoreStatusBanner`, and `ShippingUnavailable` components ([#890](https://github.com/plastikaweb/plastikspace/issues/890))
- Implemented unit tests for multiple shared pipes and directives including `BytesToSize`, `HumanizeUnit`, `PocketBaseImageUrl`, `TableCellTitle`, and `PaginationComponent` ([#890](https://github.com/plastikaweb/plastikspace/issues/890))

### Changed

- Initialized global `jest-axe` configuration in `test-setup.ts` and improved accessibility coverage for multiple `eco-store` components ([#890](https://github.com/plastikaweb/plastikspace/issues/890))

---

## [2026-02-17] - Product Detail Layout

### Fixed

- Refactored product detail media section to use CSS Grid for better responsiveness and layout stability ([#870](https://github.com/plastikaweb/plastikspace/issues/870))

## [2026-02-17] - Eco Store Improvements

### Added

- Added data migration script for eco-store ([#871](https://github.com/plastikaweb/plastikspace/issues/871))
- Added mobile navigation and user menu components ([#873](https://github.com/plastikaweb/plastikspace/issues/873))

### Changed

- Updated layout components (header, footer) and improved products list feature and pagination styles ([#871](https://github.com/plastikaweb/plastikspace/issues/871))
- Refactored layout architecture and updated shared libraries ([#873](https://github.com/plastikaweb/plastikspace/issues/873))

---

## [2026-02-11] - Agent Documentation

### Added

- Added `GEMINI.md` guidance for AI agents and refined project documentation ([#866](https://github.com/plastikaweb/plastikspace/issues/866))

---

## [2026-02-11] - Open Closed Store & Styling

### Added

- Implemented open/closed store logic and components ([#814](https://github.com/plastikaweb/plastikspace/issues/814))
- Added "Closing Soon" state to store status with automated 1-hour threshold logic ([#814](https://github.com/plastikaweb/plastikspace/issues/814))
- Implemented pulsing urgency indicator in store status chip ([#814](https://github.com/plastikaweb/plastikspace/issues/814))
- Added `isStoreOpenGuard` to prevent checkout when the store is closed ([#814](https://github.com/plastikaweb/plastikspace/issues/814))
- Added product detail links to cart summary items ([#857](https://github.com/plastikaweb/plastikspace/issues/857))

### Changed

- Improved Angular style and cleaned up tsconfig configurations across multiple libraries ([#859](https://github.com/plastikaweb/plastikspace/issues/859))
- Fixed duplicate template attributes and unused variables ([#859](https://github.com/plastikaweb/plastikspace/issues/859))
- Enhanced Signal Store features and utility pipes ([#859](https://github.com/plastikaweb/plastikspace/issues/859))

---

## [2026-02-06] - Agent Skills Configuration

### Added

- Added `CHANGELOG.md` with project history ([#854](https://github.com/plastikaweb/plastikspace/issues/854))
- Added commitizen skill integration for automated changelog prompts ([#854](https://github.com/plastikaweb/plastikspace/issues/854))
- Added agent skills configuration for multiple IDE integrations (Cursor, Claude, Trae, Windsurf) ([#854](https://github.com/plastikaweb/plastikspace/issues/854))

---

## [2026-02-06] - CI Test Coverage

### Added

- Added test coverage reporting to CI workflow and PRs ([#853](https://github.com/plastikaweb/plastikspace/pull/853))

---

## [2026-02-05] - Persistent Cart Synchronization

### Added

- Added `NewPriceWarningComponent` to cart summary to display price changes ([#851](https://github.com/plastikaweb/plastikspace/pull/851))
- Added persistent cart synchronization between local and remote storage ([#850](https://github.com/plastikaweb/plastikspace/pull/850), [#848](https://github.com/plastikaweb/plastikspace/pull/848))
- Added cart posting to PocketBase ([#848](https://github.com/plastikaweb/plastikspace/pull/848))

### Changed

- Enhanced cart state management with dedicated properties and PocketBase structure ([#851](https://github.com/plastikaweb/plastikspace/pull/851))
- Refactored cart item as the entity for cart store ([#848](https://github.com/plastikaweb/plastikspace/pull/848))

### Fixed

- Fixed cart store issues reviewed by Claude Code ([#851](https://github.com/plastikaweb/plastikspace/pull/851))
- Fixed `isolatedModules` and removed `types` compiler from tsconfig.spec ([#851](https://github.com/plastikaweb/plastikspace/pull/851))
- Replaced markdownlint-cli with markdownlint-cli2 ([#848](https://github.com/plastikaweb/plastikspace/pull/848))

---

## [2026-02-02] - Claude GitHub Actions & Shipping Improvements

### Added

- Added Claude Code Review and PR Assistant GitHub Actions ([#843](https://github.com/plastikaweb/plastikspace/pull/843))
- Added shipping unavailable route and view ([#842](https://github.com/plastikaweb/plastikspace/pull/842))
- Added i18n validation and CI integration ([#842](https://github.com/plastikaweb/plastikspace/pull/842))

### Changed

- Improved shipping form with centralized tier and instruction handling ([#842](https://github.com/plastikaweb/plastikspace/pull/842))
- Enhanced tenant address slots handling ([#842](https://github.com/plastikaweb/plastikspace/pull/842))
- Added dynamic title to custom-label for shipping type ([#842](https://github.com/plastikaweb/plastikspace/pull/842))

---

## [2026-01-31] - Categories Loading Fix

### Fixed

- Fixed categories loading issue - prevent loading without tenant ([#840](https://github.com/plastikaweb/plastikspace/pull/840))

---

## [2026-01-30] - Nx Upgrade & Cloud Setup

### Changed

- Upgraded Nx to v22.4.3 ([#838](https://github.com/plastikaweb/plastikspace/pull/838), [#837](https://github.com/plastikaweb/plastikspace/pull/837))
- Configured Nx Cloud setup ([#834](https://github.com/plastikaweb/plastikspace/pull/834))

### Fixed

- Fixed CI workflow errors ([#838](https://github.com/plastikaweb/plastikspace/pull/838))

---

## [2026-01-28] - Focus Tab Navigation Fix

### Fixed

- Fixed focus tab navigation ([#831](https://github.com/plastikaweb/plastikspace/pull/831))

---

## [2026-01-27] - Default Address Refactoring

### Changed

- Refactored default address handling ([#830](https://github.com/plastikaweb/plastikspace/pull/830))

---

## [2026-01-26] - Tenant Addresses & Categories Stats

### Changed

- Refactored tenant addresses with dynamic slots handling ([#826](https://github.com/plastikaweb/plastikspace/pull/826), [#825](https://github.com/plastikaweb/plastikspace/pull/825), [#823](https://github.com/plastikaweb/plastikspace/pull/823))

### Fixed

- Fixed categories stats display ([#829](https://github.com/plastikaweb/plastikspace/pull/829), [#828](https://github.com/plastikaweb/plastikspace/pull/828))

---

## [2026-01-25] - Tenant Store & PocketHost

### Changed

- Refactored tenant store architecture ([#821](https://github.com/plastikaweb/plastikspace/pull/821))

### Fixed

- Fixed PocketHost FTP configuration ([#822](https://github.com/plastikaweb/plastikspace/pull/822))

---

## [2026-01-24] - Shipping Form & User Addresses

### Added

- Added shipping form and user addresses feature ([#818](https://github.com/plastikaweb/plastikspace/pull/818))

---

## [2026-01-13] - Tenant Configuration

### Added

- Added tenant configuration system ([#810](https://github.com/plastikaweb/plastikspace/pull/810), [#809](https://github.com/plastikaweb/plastikspace/pull/809))

---

## [2026-01-11] - User Logout

### Added

- Added logout functionality ([#807](https://github.com/plastikaweb/plastikspace/pull/807))

---

## [2026-01-10] - Profile Avatar

### Added

- Added profile avatar feature ([#806](https://github.com/plastikaweb/plastikspace/pull/806))

---

## [2026-01-09] - User Login

### Added

- Added login functionality ([#805](https://github.com/plastikaweb/plastikspace/pull/805))

---

## [2025-12-30] - Auth & Cart View

### Added

- Added PocketBase authentication integration ([#803](https://github.com/plastikaweb/plastikspace/pull/803))
- Added cart view feature ([#802](https://github.com/plastikaweb/plastikspace/pull/802))

---

## [2025-12-27] - Bundle Optimization

### Changed

- Reduced bundle size with optimizations ([#801](https://github.com/plastikaweb/plastikspace/pull/801))

---

## [2025-12-24] - Cart Store & Badge

### Added

- Added cart badge component ([#800](https://github.com/plastikaweb/plastikspace/pull/800))
- Added cart store with state management ([#797](https://github.com/plastikaweb/plastikspace/pull/797))

---

## [2025-12-23] - Angular 21 & CI Staging

### Added

- Added eco-store staging workflow ([#796](https://github.com/plastikaweb/plastikspace/pull/796))

### Changed

- Upgraded to Angular 21 ([#795](https://github.com/plastikaweb/plastikspace/pull/795), [#794](https://github.com/plastikaweb/plastikspace/pull/794), [#793](https://github.com/plastikaweb/plastikspace/pull/793))

---

## [2025-12-22] - Product Detail View

### Added

- Added product detail page ([#792](https://github.com/plastikaweb/plastikspace/pull/792), [#791](https://github.com/plastikaweb/plastikspace/pull/791))

---

## [2025-12-17] - Eco Tokens Fix

### Fixed

- Fixed eco tokens styling issues ([#786](https://github.com/plastikaweb/plastikspace/pull/786))

---

## [2025-12-16] - Products Grid Fixes

### Fixed

- Fixed products grid layout issues ([#784](https://github.com/plastikaweb/plastikspace/pull/784), [#783](https://github.com/plastikaweb/plastikspace/pull/783))

---

## [2025-12-15] - A11y & Image Loading

### Changed

- Humanized units display ([#780](https://github.com/plastikaweb/plastikspace/pull/780))
- Improved accessibility compliance ([#779](https://github.com/plastikaweb/plastikspace/pull/779), [#778](https://github.com/plastikaweb/plastikspace/pull/778))

### Fixed

- Fixed image loading errors ([#782](https://github.com/plastikaweb/plastikspace/pull/782))

---

## [2025-12-12] - Image Loader Refactoring

### Changed

- Refactored image loader component ([#774](https://github.com/plastikaweb/plastikspace/pull/774))

---

## [2025-12-11] - Product Ordering

### Added

- Added product ordering functionality ([#772](https://github.com/plastikaweb/plastikspace/pull/772), [#770](https://github.com/plastikaweb/plastikspace/pull/770))

---

## [2025-12-10] - Categories Menu & NgImage

### Added

- Added categories menu ([#765](https://github.com/plastikaweb/plastikspace/pull/765))

### Changed

- Refactored product component to use NgImage ([#767](https://github.com/plastikaweb/plastikspace/pull/767))

### Fixed

- Fixed image display improvements ([#769](https://github.com/plastikaweb/plastikspace/pull/769))

---

## [2025-12-09] - Loading State & Card Hover

### Added

- Added loading state indicators ([#759](https://github.com/plastikaweb/plastikspace/pull/759))

### Changed

- Refactored card product hover effects ([#761](https://github.com/plastikaweb/plastikspace/pull/761))

### Fixed

- Fixed nasa-images build issues ([#763](https://github.com/plastikaweb/plastikspace/pull/763))

---

## [2025-12-05] - Store Pagination

### Added

- Added store pagination feature ([#756](https://github.com/plastikaweb/plastikspace/pull/756))

---

## [2025-12-03] - PocketBase CI Export

### Added

- Added PocketBase export to CI workflow ([#753](https://github.com/plastikaweb/plastikspace/pull/753) - [#744](https://github.com/plastikaweb/plastikspace/pull/744))

### Fixed

- Fixed PocketBase ignore configuration ([#754](https://github.com/plastikaweb/plastikspace/pull/754))

---

## [2025-12-02] - Products List

### Added

- Added products list view ([#743](https://github.com/plastikaweb/plastikspace/pull/743))

---

## [2025-11-28] - API Store Refactoring

### Changed

- Refactored API store architecture ([#740](https://github.com/plastikaweb/plastikspace/pull/740))

---

## [2025-11-21] - Nx 22.1.0 Upgrade

### Changed

- Upgraded Nx to v22.1.0 ([#739](https://github.com/plastikaweb/plastikspace/pull/739))

---

## [2025-11-20] - Store Layout

### Added

- Added store layout structure ([#738](https://github.com/plastikaweb/plastikspace/pull/738))

---

## [2025-11-18] - Products Feature

### Added

- Added products feature ([#735](https://github.com/plastikaweb/plastikspace/pull/735))

---

## [2025-11-17] - Translation Support

### Added

- Added translation/i18n support ([#734](https://github.com/plastikaweb/plastikspace/pull/734))

---

## [2025-11-14] - Categories Store

### Added

- Added categories store with state management ([#733](https://github.com/plastikaweb/plastikspace/pull/733))

---

## [2025-11-12] - Store Layout & CI Fixes

### Added

- Added initial store layout ([#729](https://github.com/plastikaweb/plastikspace/pull/729))

### Fixed

- Fixed pa11y accessibility issues ([#731](https://github.com/plastikaweb/plastikspace/pull/731))
- Fixed CI pipeline failures ([#730](https://github.com/plastikaweb/plastikspace/pull/730))

---

## [2025-11-04] - Environment Configuration

### Added

- Added environment configuration setup ([#726](https://github.com/plastikaweb/plastikspace/pull/726))

---

## [2025-10-30] - Nx 22 & Products/Categories

### Added

- Created products and categories structure ([#723](https://github.com/plastikaweb/plastikspace/pull/723))

### Changed

- Upgraded Nx to v22 ([#725](https://github.com/plastikaweb/plastikspace/pull/725))

---

## [2025-10-29] - Project Setup

### Added

- Initial eco-store project setup ([#720](https://github.com/plastikaweb/plastikspace/pull/720))

---

## [2025-10-22] - CI Error Fixes

### Fixed

- Fixed CI pipeline errors ([#683](https://github.com/plastikaweb/plastikspace/pull/683))
- Fixed CI pipeline errors ([#682](https://github.com/plastikaweb/plastikspace/pull/682))
- Fixed CI pipeline errors ([#681](https://github.com/plastikaweb/plastikspace/pull/681))
- Fixed CI pipeline errors ([#680](https://github.com/plastikaweb/plastikspace/pull/680))
- Fixed CI pipeline errors ([#679](https://github.com/plastikaweb/plastikspace/pull/679))
- Fixed CI pipeline errors ([#678](https://github.com/plastikaweb/plastikspace/pull/678))
- Fixed CI pipeline errors ([#677](https://github.com/plastikaweb/plastikspace/pull/677))
- Fixed CI pipeline errors ([#676](https://github.com/plastikaweb/plastikspace/pull/676))

### Added

- Added AI instructions for development ([#675](https://github.com/plastikaweb/plastikspace/pull/675))

---

## [2025-10-21] - Nx 21.6.5 Upgrade

### Changed

- Upgraded Nx to v21.6.5 ([#674](https://github.com/plastikaweb/plastikspace/pull/674))

---

## [2025-07-03] - Styles Review

### Changed

- Reviewed and refactored styles ([#673](https://github.com/plastikaweb/plastikspace/pull/673))

---

## [2025-06-27] - Mini Cart

### Added

- Added mini cart feature ([#672](https://github.com/plastikaweb/plastikspace/pull/672))

---

## [2025-06-20] - Order Local Storage

### Added

- Added order persistence with local storage ([#668](https://github.com/plastikaweb/plastikspace/pull/668))

---

## [2025-06-18] - Nx 21 Upgrade

### Changed

- Upgraded Nx to v21 ([#666](https://github.com/plastikaweb/plastikspace/pull/666))

---

## [2025-06-17] - Nx Cloud Setup

### Added

- Added Nx Cloud setup ([#665](https://github.com/plastikaweb/plastikspace/pull/665))

---

## [2025-06-06] - Public Store

### Added

- Added public store feature ([#663](https://github.com/plastikaweb/plastikspace/pull/663))

---

## [2025-05-27] - Profile State Refactoring

### Changed

- Refactored profile state management ([#660](https://github.com/plastikaweb/plastikspace/pull/660))

---

## [2025-05-20] - Date.js & Image Upload

### Changed

- Improved date handling with Date.js ([#656](https://github.com/plastikaweb/plastikspace/pull/656))

### Fixed

- Fixed image upload functionality ([#655](https://github.com/plastikaweb/plastikspace/pull/655))

---

## [2025-05-16] - Performance Improvements

### Changed

- Performance improvements to application ([#654](https://github.com/plastikaweb/plastikspace/pull/654))

---

## [2025-05-05] - Storage Rules Fix

### Fixed

- Fixed Firebase storage rules ([#647](https://github.com/plastikaweb/plastikspace/pull/647))

---

## [2025-05-01] - A11y Focus Fix

### Fixed

- Fixed accessibility focus issues ([#645](https://github.com/plastikaweb/plastikspace/pull/645))

---

## [2025-04-30] - A11y Review

### Changed

- Comprehensive accessibility review and improvements ([#643](https://github.com/plastikaweb/plastikspace/pull/643))

---

## [2025-04-26] - A11y Lists & Login Modal

### Changed

- Improved accessibility for list components ([#641](https://github.com/plastikaweb/plastikspace/pull/641))

### Fixed

- Fixed login modal issues ([#640](https://github.com/plastikaweb/plastikspace/pull/640))

---

## [2025-04-25] - Error Handler Fix

### Fixed

- Fixed error handler issues ([#639](https://github.com/plastikaweb/plastikspace/pull/639))

---

## [2025-04-24] - Query Params & Filter Input

### Changed

- Improved user query params handling ([#636](https://github.com/plastikaweb/plastikspace/pull/636))

### Fixed

- Fixed product query params ([#635](https://github.com/plastikaweb/plastikspace/pull/635))
- Fixed filter input component ([#634](https://github.com/plastikaweb/plastikspace/pull/634))

---

## [2025-04-23] - Product Image

### Added

- Added product image feature ([#633](https://github.com/plastikaweb/plastikspace/pull/633))

---

## [2025-04-09] - Plastikaweb Skills

### Added

- Added plastikaweb skills configuration ([#631](https://github.com/plastikaweb/plastikspace/pull/631))

---

## [2025-04-08] - Plastikaweb Init

### Added

- Initialized plastikaweb application ([#630](https://github.com/plastikaweb/plastikspace/pull/630))

---

## [2025-04-06] - Category Params

### Changed

- Improved category params handling ([#622](https://github.com/plastikaweb/plastikspace/pull/622))

---

## [2025-04-04] - Form Disabled & Product Categories

### Fixed

- Fixed form disabled state handling ([#615](https://github.com/plastikaweb/plastikspace/pull/615))
- Fixed product edit categories list ([#614](https://github.com/plastikaweb/plastikspace/pull/614))

---

## [2025-04-03] - Menu Users & User Loading

### Fixed

- Fixed menu users display ([#613](https://github.com/plastikaweb/plastikspace/pull/613))
- Fixed user loading state ([#612](https://github.com/plastikaweb/plastikspace/pull/612))

---

## [2025-04-02] - Orders List Refactoring

### Changed

- Refactored orders list component ([#611](https://github.com/plastikaweb/plastikspace/pull/611))

---

## [2025-03-25] - Social Login & Order Status

### Added

- Added user order status feature ([#606](https://github.com/plastikaweb/plastikspace/pull/606))

### Fixed

- Fixed social login functionality ([#607](https://github.com/plastikaweb/plastikspace/pull/607))

---

## [2025-03-20] - Order List Cancel/Delete

### Fixed

- Fixed order list cancel and delete functionality ([#602](https://github.com/plastikaweb/plastikspace/pull/602))

---

## [2025-03-19] - Deliver Action & Order Status

### Added

- Added deliver action feature ([#599](https://github.com/plastikaweb/plastikspace/pull/599))

### Fixed

- Fixed no edit order issue ([#601](https://github.com/plastikaweb/plastikspace/pull/601))
- Fixed order status handling ([#598](https://github.com/plastikaweb/plastikspace/pull/598))

---

## [2025-03-17] - Product Categories Fix

### Fixed

- Fixed product categories functionality ([#591](https://github.com/plastikaweb/plastikspace/pull/591))

---

## [2025-03-04] - User Name Registration

### Added

- Added user name during registration ([#577](https://github.com/plastikaweb/plastikspace/pull/577))

---

## [2025-03-01] - Password Form & Category Pagination

### Changed

- Improved category pagination performance ([#572](https://github.com/plastikaweb/plastikspace/pull/572))

### Fixed

- Fixed request password form ([#573](https://github.com/plastikaweb/plastikspace/pull/573))

---

## [2025-02-11] - Products Pagination

### Changed

- Improved products pagination performance ([#562](https://github.com/plastikaweb/plastikspace/pull/562))

---

## [2025-02-04] - Zoneless Refactoring

### Changed

- Refactored to zoneless change detection ([#561](https://github.com/plastikaweb/plastikspace/pull/561))

---

## [2025-01-28] - Sort Category Product Fix

### Fixed

- Fixed sort category product functionality ([#558](https://github.com/plastikaweb/plastikspace/pull/558))

---

## [2025-01-23] - Overlay & Cell Refactoring

### Changed

- Refactored category name cell component ([#555](https://github.com/plastikaweb/plastikspace/pull/555))

### Fixed

- Fixed overlay overflow issues ([#556](https://github.com/plastikaweb/plastikspace/pull/556))

---

## [2025-01-22] - Product Name UI

### Changed

- Refactored product name UI component ([#554](https://github.com/plastikaweb/plastikspace/pull/554))

---

## [2025-01-21] - User Order & Notifications

### Fixed

- Fixed user order count display ([#549](https://github.com/plastikaweb/plastikspace/pull/549))
- Fixed dismiss notification on routing ([#547](https://github.com/plastikaweb/plastikspace/pull/547))
- Fixed link hover styling ([#545](https://github.com/plastikaweb/plastikspace/pull/545))

---

## [2025-01-08] - Material 19 Upgrade

### Changed

- Upgraded to Angular Material 19 ([#522](https://github.com/plastikaweb/plastikspace/pull/522))

---

## [2024-12-31] - Order Total

### Added

- Added order total feature ([#520](https://github.com/plastikaweb/plastikspace/pull/520))

---

## [2024-12-19] - NgRx 19 & View Config

### Changed

- Upgraded to NgRx 19 ([#517](https://github.com/plastikaweb/plastikspace/pull/517))

### Fixed

- Fixed view config issues ([#516](https://github.com/plastikaweb/plastikspace/pull/516))

---

## [2024-12-18] - ES6 Private Fields

### Changed

- Refactored to use ES6 private fields ([#515](https://github.com/plastikaweb/plastikspace/pull/515))

---

## [2024-12-13] - NgOptimizedImage

### Changed

- Implemented NgOptimizedImage for performance ([#513](https://github.com/plastikaweb/plastikspace/pull/513))

---

## [2024-12-12] - Angular 19 Upgrade

### Changed

- Upgraded to Angular 19 ([#511](https://github.com/plastikaweb/plastikspace/pull/511))

---

## [2024-12-11] - User Order Resume

### Added

- Added user order resume feature ([#509](https://github.com/plastikaweb/plastikspace/pull/509))

---

## [2024-12-06] - Deactivate Guard

### Added

- Added deactivate guard functionality ([#506](https://github.com/plastikaweb/plastikspace/pull/506))

---

## [2024-12-05] - Shared Form UI

### Changed

- Refactored shared form UI components ([#497](https://github.com/plastikaweb/plastikspace/pull/497))

---

## [2024-12-03] - User Order Form & Activity Store

### Changed

- Refactored activity store ([#493](https://github.com/plastikaweb/plastikspace/pull/493))

### Fixed

- Fixed user order form issues ([#495](https://github.com/plastikaweb/plastikspace/pull/495))

---

## [2024-11-29] - Llecoop Layout

### Changed

- Refactored llecoop layout ([#489](https://github.com/plastikaweb/plastikspace/pull/489))

---

## [2024-11-27] - Color Picker Spec Fix

### Fixed

- Fixed input color picker spec ([#486](https://github.com/plastikaweb/plastikspace/pull/486))

---

## [2024-11-26] - Nx 20 & Nasa Images Fixes

### Changed

- Upgraded to Nx 20 and Angular 19 ([#477](https://github.com/plastikaweb/plastikspace/pull/477))

### Fixed

- Fixed nasa images e2e tests ([#482](https://github.com/plastikaweb/plastikspace/pull/482))
- Fixed workflow errors ([#481](https://github.com/plastikaweb/plastikspace/pull/481))
- Fixed nasa images serve ([#480](https://github.com/plastikaweb/plastikspace/pull/480))

---

## [2024-11-23] - Order List UI Improvements

### Changed

- Improved status icon in order list ([#475](https://github.com/plastikaweb/plastikspace/pull/475))

### Fixed

- Fixed status column width ([#473](https://github.com/plastikaweb/plastikspace/pull/473))
- Fixed order products sort ([#472](https://github.com/plastikaweb/plastikspace/pull/472))

---

## [2024-11-22] - Deactivate Order & Submit Config

### Added

- Added deactivate order button ([#471](https://github.com/plastikaweb/plastikspace/pull/471))

### Changed

- Refactored submit configuration ([#466](https://github.com/plastikaweb/plastikspace/pull/466))

---

## [2024-11-20] - User Order UI Improvements

### Changed

- Improved user order styles ([#463](https://github.com/plastikaweb/plastikspace/pull/463))
- Refactored new order modal ([#462](https://github.com/plastikaweb/plastikspace/pull/462))

### Fixed

- Fixed cart button issues ([#461](https://github.com/plastikaweb/plastikspace/pull/461))
- Fixed disable edit user order ([#460](https://github.com/plastikaweb/plastikspace/pull/460))

---

## [2024-11-19] - Shared Documentation

### Added

- Added shared component documentation ([#457](https://github.com/plastikaweb/plastikspace/pull/457))

---

## [2024-11-15] - Order Detail & Modal Styles

### Changed

- Refactored modal styles ([#449](https://github.com/plastikaweb/plastikspace/pull/449))
- Improved mobile UI ([#448](https://github.com/plastikaweb/plastikspace/pull/448))

### Fixed

- Fixed order detail form ([#456](https://github.com/plastikaweb/plastikspace/pull/456))

---

## [2024-11-14] - Staging Workflow

### Added

- Added staging workflow ([#438](https://github.com/plastikaweb/plastikspace/pull/438))

---

## [2024-11-13] - Cloud Hosting

### Added

- Added cloud hosting configuration ([#437](https://github.com/plastikaweb/plastikspace/pull/437), [#436](https://github.com/plastikaweb/plastikspace/pull/436), [#435](https://github.com/plastikaweb/plastikspace/pull/435))

---

## [2024-11-11] - Order List Orders View

### Added

- Added order list orders view ([#432](https://github.com/plastikaweb/plastikspace/pull/432))

---

## [2024-10-23] - Orders Count & Edit User Order

### Added

- Added orders count feature ([#428](https://github.com/plastikaweb/plastikspace/pull/428))
- Added edit user order functionality ([#426](https://github.com/plastikaweb/plastikspace/pull/426))

---

## [2024-10-21] - Order Totals & Filters

### Added

- Added totals to order view ([#424](https://github.com/plastikaweb/plastikspace/pull/424))
- Added filters functionality ([#422](https://github.com/plastikaweb/plastikspace/pull/422))

---

## [2024-10-19] - Product Category Filter

### Added

- Added product category filter ([#418](https://github.com/plastikaweb/plastikspace/pull/418))

---

## [2024-10-18] - Layout Fix

### Changed

- Refactored and fixed layout issues ([#415](https://github.com/plastikaweb/plastikspace/pull/415))

---

## [2024-10-17] - Order Detail Header

### Added

- Added header for order detail view ([#413](https://github.com/plastikaweb/plastikspace/pull/413))

---

## [2024-10-16] - Delete User Order & Order List

### Added

- Added delete user order functionality ([#410](https://github.com/plastikaweb/plastikspace/pull/410))
- Added user order list ([#408](https://github.com/plastikaweb/plastikspace/pull/408))

---

## [2024-10-15] - Close List Order & User Order

### Added

- Added close list order functionality ([#407](https://github.com/plastikaweb/plastikspace/pull/407))
- Added user order feature ([#404](https://github.com/plastikaweb/plastikspace/pull/404))

---

## [2024-10-09] - Activate Order & Delete User

### Added

- Added activate order functionality ([#402](https://github.com/plastikaweb/plastikspace/pull/402))
- Added delete user functionality ([#400](https://github.com/plastikaweb/plastikspace/pull/400))

### Fixed

- Fixed product stock unit change ([#398](https://github.com/plastikaweb/plastikspace/pull/398))

---

## [2024-10-08] - Login Activity & Order Management

### Added

- Added delete order functionality ([#394](https://github.com/plastikaweb/plastikspace/pull/394))
- Added new order feature ([#392](https://github.com/plastikaweb/plastikspace/pull/392))

### Changed

- Refactored login activity handling ([#396](https://github.com/plastikaweb/plastikspace/pull/396))

---

## [2024-10-07] - Hide Admin Button Fix

### Fixed

- Fixed hide admin button functionality ([#389](https://github.com/plastikaweb/plastikspace/pull/389))

---

## [2024-10-05] - Categories Fix

### Fixed

- Fixed categories functionality ([#386](https://github.com/plastikaweb/plastikspace/pull/386))

---

## [2024-10-04] - Admin Claim & User Registration

### Added

- Added admin claim functionality ([#384](https://github.com/plastikaweb/plastikspace/pull/384))
- Added admin claim functionality ([#381](https://github.com/plastikaweb/plastikspace/pull/381))
- Added admin claim functionality ([#378](https://github.com/plastikaweb/plastikspace/pull/378))
- Added admin claim functionality ([#376](https://github.com/plastikaweb/plastikspace/pull/376))

### Changed

- Set email header style ([#384](https://github.com/plastikaweb/plastikspace/pull/384))

### Fixed

- Fixed block duplicate user creation ([#375](https://github.com/plastikaweb/plastikspace/pull/375))

---

## [2024-10-03] - Improved Registration & White List

### Added

- Added white listed users feature ([#368](https://github.com/plastikaweb/plastikspace/pull/368))

### Changed

- Improved registration flow ([#372](https://github.com/plastikaweb/plastikspace/pull/372), [#370](https://github.com/plastikaweb/plastikspace/pull/370))

---

## [2024-10-02] - Auth Activity & Password Recovery

### Added

- Added auth activity display ([#364](https://github.com/plastikaweb/plastikspace/pull/364))
- Added password recovery functionality ([#362](https://github.com/plastikaweb/plastikspace/pull/362))
- Added auth links ([#360](https://github.com/plastikaweb/plastikspace/pull/360))
- Added user list feature ([#357](https://github.com/plastikaweb/plastikspace/pull/357))

---

## [2024-10-01] - User List

### Added

- Added user list functionality ([#354](https://github.com/plastikaweb/plastikspace/pull/354))

---

## [2024-09-30] - User List Enhancements

### Added

- Enhanced user list features ([#352](https://github.com/plastikaweb/plastikspace/pull/352), [#351](https://github.com/plastikaweb/plastikspace/pull/351))

---

## [2024-09-29] - Auth Session Fixes

### Fixed

- Removed Firebase session issues ([#348](https://github.com/plastikaweb/plastikspace/pull/348))
- Fixed auth persistence in production ([#346](https://github.com/plastikaweb/plastikspace/pull/346))

---

## [2024-09-28] - Workflows & Firebase Functions

### Added

- Added CRUD products triggers ([#338](https://github.com/plastikaweb/plastikspace/pull/338))

### Fixed

- Fixed workflows configuration ([#343](https://github.com/plastikaweb/plastikspace/pull/343))
- Fixed budget max size ([#340](https://github.com/plastikaweb/plastikspace/pull/340))

---

## [2024-09-27] - Firebase Functions

### Added

- Added Firebase functions ([#336](https://github.com/plastikaweb/plastikspace/pull/336))

---

## [2024-09-26] - Assets Fix

### Fixed

- Fixed assets configuration ([#335](https://github.com/plastikaweb/plastikspace/pull/335))

---

## [2024-09-25] - Products List Refactoring

### Changed

- Refactored products list ([#333](https://github.com/plastikaweb/plastikspace/pull/333))

---

## [2024-09-23] - Product Management

### Added

- Added product availability toggle ([#331](https://github.com/plastikaweb/plastikspace/pull/331))
- Added delete product functionality ([#329](https://github.com/plastikaweb/plastikspace/pull/329))
- Added delete category functionality ([#327](https://github.com/plastikaweb/plastikspace/pull/327))

---

## [2024-09-22] - Notifications

### Added

- Added notifications system ([#325](https://github.com/plastikaweb/plastikspace/pull/325))

---

## [2024-09-21] - Bundle Size Optimization

### Fixed

- Fixed bundle size issues ([#323](https://github.com/plastikaweb/plastikspace/pull/323))

---

## [2024-09-20] - Product & Category Edit

### Added

- Added product edit functionality ([#321](https://github.com/plastikaweb/plastikspace/pull/321))
- Added category edit functionality ([#320](https://github.com/plastikaweb/plastikspace/pull/320))

---

## [2024-09-19] - Form Validators & Firebase Emulator

### Added

- Added Firebase emulator for llecoop ([#315](https://github.com/plastikaweb/plastikspace/pull/315))

### Fixed

- Fixed form validators ([#318](https://github.com/plastikaweb/plastikspace/pull/318))

---

## [2024-09-18] - Products Filter

### Added

- Added products filter functionality ([#313](https://github.com/plastikaweb/plastikspace/pull/313))

---

## [2024-09-16] - New Product Form

### Added

- Added new product form ([#311](https://github.com/plastikaweb/plastikspace/pull/311))

---

## [2024-09-14] - New Category Form

### Added

- Added new category form ([#309](https://github.com/plastikaweb/plastikspace/pull/309))

---

## [2024-09-13] - Llecoop Login

### Added

- Added llecoop login functionality ([#307](https://github.com/plastikaweb/plastikspace/pull/307))

---

## [2024-09-06] - Abstract Facade Refactoring

### Changed

- Refactored abstract facade pattern ([#305](https://github.com/plastikaweb/plastikspace/pull/305))

---

## [2024-09-05] - Products List

### Added

- Added products list feature ([#303](https://github.com/plastikaweb/plastikspace/pull/303))

---

## [2024-09-03] - Llecoop Deploy CI

### Added

- Added llecoop deployment CI workflow ([#297](https://github.com/plastikaweb/plastikspace/pull/297) - [#293](https://github.com/plastikaweb/plastikspace/pull/293))

---

## [2024-09-02] - Categories Filter

### Added

- Added categories filter functionality ([#290](https://github.com/plastikaweb/plastikspace/pull/290))

---

## [2024-08-29] - Sort Categories Table

### Added

- Added sort functionality for categories table ([#287](https://github.com/plastikaweb/plastikspace/pull/287))

---

## [2024-08-28] - Shared List View

### Changed

- Refactored shared list view component ([#285](https://github.com/plastikaweb/plastikspace/pull/285))

---

## [2024-08-27] - Menu Skeleton Llecoop

### Changed

- Refactored menu skeleton for llecoop ([#284](https://github.com/plastikaweb/plastikspace/pull/284))

---

## [2024-08-24] - Llecoop Favicon

### Added

- Added llecoop favicon ([#283](https://github.com/plastikaweb/plastikspace/pull/283))

---

## [2024-08-23] - Loading Indicator & Categories

### Added

- Added loading indicator ([#281](https://github.com/plastikaweb/plastikspace/pull/281))
- Added categories title ([#279](https://github.com/plastikaweb/plastikspace/pull/279))
- Added categories list ([#270](https://github.com/plastikaweb/plastikspace/pull/270))

### Fixed

- Fixed llevat title ([#277](https://github.com/plastikaweb/plastikspace/pull/277))

---

## [2024-08-08] - Angular 18 Upgrade

### Changed

- Upgraded to Angular 18 ([#268](https://github.com/plastikaweb/plastikspace/pull/268))

---

## [2024-07-09] - Llecoop Layout

### Added

- Added llecoop layout ([#266](https://github.com/plastikaweb/plastikspace/pull/266))

---

## [2024-06-29] - Llecoop Init

### Added

- Initialized llecoop application ([#264](https://github.com/plastikaweb/plastikspace/pull/264))

---

## [2024-01-06] - Angular 17 Upgrade

### Changed

- Upgraded to Angular 17 ([#261](https://github.com/plastikaweb/plastikspace/pull/261))

---

## [2023-11-21] - Material Tailwind

### Added

- Added Material Tailwind integration ([#259](https://github.com/plastikaweb/plastikspace/pull/259))

---

## [2023-09-12] - Nx Upgrade

### Changed

- Upgraded Nx version ([#256](https://github.com/plastikaweb/plastikspace/pull/256))

---

## [2023-09-10] - Highlight Directive

### Added

- Added highlight directive ([#253](https://github.com/plastikaweb/plastikspace/pull/253))

---

## [2023-09-09] - Search Images E2E

### Added

- Added search images e2e tests ([#251](https://github.com/plastikaweb/plastikspace/pull/251))

---

## [2023-08-24] - FAQs E2E Tests

### Added

- Added FAQs e2e tests ([#250](https://github.com/plastikaweb/plastikspace/pull/250))

---

## [2023-08-21] - App E2E Tests

### Added

- Added app e2e tests ([#249](https://github.com/plastikaweb/plastikspace/pull/249))

---

## [2023-08-14] - API Cache

### Changed

- Implemented API caching for performance ([#247](https://github.com/plastikaweb/plastikspace/pull/247))

---

## [2023-08-03] - NgRx Refactoring

### Changed

- Refactored to use ngrxLet directive ([#244](https://github.com/plastikaweb/plastikspace/pull/244))
- Refactored NgRx state management ([#242](https://github.com/plastikaweb/plastikspace/pull/242))

---

## [2023-07-28] - Remove CoreCMS

### Changed

- Removed CoreCMS dependency ([#241](https://github.com/plastikaweb/plastikspace/pull/241))

---

## [2023-07-19] - CSS Performance

### Changed

- CSS performance improvements ([#238](https://github.com/plastikaweb/plastikspace/pull/238))

---

## [2023-07-17] - Experimental Features

### Added

- Added experimental features ([#237](https://github.com/plastikaweb/plastikspace/pull/237))

---

## [2023-07-14] - FAQs Titles Refactoring

### Changed

- Refactored FAQs titles ([#235](https://github.com/plastikaweb/plastikspace/pull/235))

---

## [2023-07-13] - Angular 16.5.1 Upgrade

### Changed

- Upgraded to Angular 16.5.1 ([#234](https://github.com/plastikaweb/plastikspace/pull/234))

---

## [2023-06-15] - Search Form & Year Picker

### Added

- Added year picker component ([#227](https://github.com/plastikaweb/plastikspace/pull/227))

### Fixed

- Fixed search form mobile issues ([#229](https://github.com/plastikaweb/plastikspace/pull/229))

---

## [2023-05-22] - Query Reset Fix

### Fixed

- Fixed query reset functionality ([#225](https://github.com/plastikaweb/plastikspace/pull/225))

---

## [2023-05-20] - Remove Enum

### Changed

- Removed enum for performance ([#224](https://github.com/plastikaweb/plastikspace/pull/224))

---

## [2023-05-18] - Test Warnings Fix

### Fixed

- Fixed test warnings ([#221](https://github.com/plastikaweb/plastikspace/pull/221))

---

## [2023-04-06] - Shared Entities Documentation

### Added

- Added shared entities documentation ([#166](https://github.com/plastikaweb/plastikspace/pull/166))

---

## [2023-02-10] - Custom Index & API

### Added

- Added custom index functionality ([#77](https://github.com/plastikaweb/plastikspace/pull/77))
- Added API integration ([#76](https://github.com/plastikaweb/plastikspace/pull/76))

---

## [2023-02-02] - Header Social

### Added

- Added header social links ([#74](https://github.com/plastikaweb/plastikspace/pull/74))

---

## [2023-01-29] - Header Title & Sidenav

### Added

- Added sidenav component ([#71](https://github.com/plastikaweb/plastikspace/pull/71))

### Fixed

- Fixed header title on small screens ([#72](https://github.com/plastikaweb/plastikspace/pull/72))

---

## [2023-01-12] - App Scope & Favicon

### Added

- Added head favicon ([#66](https://github.com/plastikaweb/plastikspace/pull/66))
- Added Nx boundaries configuration ([#64](https://github.com/plastikaweb/plastikspace/pull/64))

### Fixed

- Fixed app scope issues ([#67](https://github.com/plastikaweb/plastikspace/pull/67))

---

## [2022-12-21] - Plastik Path Style

### Changed

- Styled plastik path component ([#61](https://github.com/plastikaweb/plastikspace/pull/61))

---

## [2022-12-20] - Commitizen Fix

### Fixed

- Fixed commitizen configuration ([#60](https://github.com/plastikaweb/plastikspace/pull/60))

---

## [2022-12-15] - README & JSDoc

### Added

- Added README documentation ([#55](https://github.com/plastikaweb/plastikspace/pull/55))

### Changed

- Updated JSDoc format ([#54](https://github.com/plastikaweb/plastikspace/pull/54))

---

## [2022-12-01] - ESLint & Code Quality

### Added

- Added utils library ([#43](https://github.com/plastikaweb/plastikspace/pull/43))

### Changed

- Fixed deprecation warnings ([#52](https://github.com/plastikaweb/plastikspace/pull/52))
- Added readonly rule ([#50](https://github.com/plastikaweb/plastikspace/pull/50))
- Added no-console rule ([#49](https://github.com/plastikaweb/plastikspace/pull/49))
- Added ESLint NgRx rules ([#48](https://github.com/plastikaweb/plastikspace/pull/48))

---

## [2022-11-30] - NgRx 15 Upgrade

### Changed

- Upgraded to NgRx 15 ([#39](https://github.com/plastikaweb/plastikspace/pull/39))

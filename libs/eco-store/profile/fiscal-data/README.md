# eco-store-profile-fiscal-data-feature

Profile "Dades fiscals" section for the eco-store app. Each partner has at most one fiscal
identity (fiscal name, NIF/NIE/CIF, address, city, zip) used for invoicing.

The form validates the tax ID with `nifValidator` (DNI/NIE/CIF checksum) and the postal code
with `zipValidator`, and saves through `pocketBaseUserProfileStore.saveFiscalProfile()`, which
creates or updates the record depending on whether a fiscal profile already exists.

## Running unit tests

Run `nx test eco-store-profile-fiscal-data-feature` to execute the unit tests via Vitest.

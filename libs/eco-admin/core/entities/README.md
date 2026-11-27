# @plastik/eco-admin/entities

Models and constants of **eco-admin** that no other app needs. Project `eco-admin-entities`, tags `scope:eco-admin` + `type:entity`.
Anything both eco apps share belongs in `@plastik/eco/entities`.

| Export                    | Value          | Used by                                                                               |
| :------------------------ | :------------- | :------------------------------------------------------------------------------------ |
| `ECO_ADMIN_APP_NAME`      | `Eco Admin`    | The page title (`EcoAdminTitleStrategy`), the auth screens, the tenant's rail header. |
| `ECO_ADMIN_PLATFORM_NAME` | `Eco Platform` | The rail header of a global administrator.                                            |

Both are brand names, so they are not translated. `index.html` repeats `Eco Admin` in its static `<title>`, shown before the app boots.

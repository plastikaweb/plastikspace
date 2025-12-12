# Llecoop Firebase

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-a08021?style=for-the-badge&logo=firebase&logoColor=ffcd34)

- [Description](#description)
- [Configuration](#configuration)
- [Development Commands](#development-commands)
- [Next Steps](#next-steps)

## Description

**Llecoop Firebase** manages the Firebase configuration, rules, and hosting for the Llecoop application. It utilizes `nx-firebase` for seamless integration within the Nx workspace.

## Configuration

### Application Files

- `database.rules.json`: Default Firebase Realtime Database Rules.
- `firestore.indexes.json`: Default Firebase Firestore Database Rules.
- `storage.rules`: Default Firebase Storage Rules.
- `public/index.ts`: Default Firebase hosting site.

### Workspace Root Files

- `firebase.json`: Firebase CLI Configuration.
- `.firebaserc`: Firebase CLI Deployment Targets.

## Development Commands

- **Deploy**: `nx run llecoop-firebase:deploy`
- **Serve (Emulator)**: `nx run llecoop-firebase:serve`
- **Build Functions**: `nx run llecoop-firebase:build`
- **Test Functions**: `nx run llecoop-firebase:test`
- **Lint Functions**: `nx run llecoop-firebase:lint`

## Next Steps

1. **Authenticate**: `firebase login`
2. **Add Target**: `firebase use --add`
3. **Add Function**: `nx g @simondotm/nx-firebase:function my-function --firebaseApp llecoop-firebase`

> See the [Nx-Firebase README](https://github.com/simondotm/nx-firebase/blob/main/README.md) for more info.

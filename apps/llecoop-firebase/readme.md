# Llecoop Firebase

## Firebase configuration and hosting for Llecoop

---

- [Llecoop Firebase](#llecoop-firebase)
  - [Firebase configuration and hosting for Llecoop](#firebase-configuration-and-hosting-for-llecoop)
  - [📂 Generated Files](#-generated-files)
    - [Application Files](#application-files)
    - [Workspace Root Files](#workspace-root-files)
  - [🛠️ Commands](#️-commands)
  - [🔗 Dependencies](#-dependencies)
  - [🚀 Next Steps](#-next-steps)

---

## 📂 Generated Files

### Application Files

- `database.rules.json`: Default Firebase Realtime Database Rules
- `firestore.indexes.json`: Default Firebase Firestore Database Rules
- `storage.rules`: Default Firebase Storage Rules
- `public/index.ts`: Default Firebase hosting site

### Workspace Root Files

- `firebase.json`: Firebase CLI Configuration
- `.firebaserc`: Firebase CLI Deployment Targets

## 🛠️ Commands

- **Deploy**: `nx run llecoop-firebase:deploy`
- **Serve (Emulator)**: `nx run llecoop-firebase:serve`
- **Build Functions**: `nx run llecoop-firebase:build`
- **Test Functions**: `nx run llecoop-firebase:test`
- **Lint Functions**: `nx run llecoop-firebase:lint`

## 🔗 Dependencies

Nx-Firebase adds the following to your workspace:

- `firebase-tools`
- `firebase-admin`
- `firebase-functions`

## 🚀 Next Steps

1. **Authenticate**: `firebase login`
2. **Add Target**: `firebase use --add`
3. **Add Function**: `nx g @simondotm/nx-firebase:function my-function --firebaseApp llecoop-firebase`

> See the [Nx-Firebase README](https://github.com/simondotm/nx-firebase/blob/main/README.md) for more info.

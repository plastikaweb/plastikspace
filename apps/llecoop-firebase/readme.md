# llecoop-firebase

- [llecoop-firebase](#llecoop-firebase)
  - [Generated Application Files](#generated-application-files)
  - [Generated Workspace Root Files](#generated-workspace-root-files)
  - [Generated dependencies](#generated-dependencies)
  - [Next Steps](#next-steps)
  - [Commands](#commands)

## Generated Application Files

- `database.rules.json` - Default Firebase Realtime Database Rules
- `firestore.indexes.json` - Default Firebase Firestore Database Rules
- `storage.rules` - Default Firebase Storage Rules
- `public/index.ts` - Default Firebase hosting site

## Generated Workspace Root Files

- `firebase.json` - Firebase CLI Configuration for this project
- `.firebaserc` - Default Firebase CLI Deployment Targets Configuration

## Generated dependencies

Nx-Firebase will add `firebase-tools`, `firebase-admin` and `firebase-functions` to your workspace if they do not already exist.

## Next Steps

- Read about the [Firebase CLI here](https://firebase.google.com/docs/cli)
- `firebase login` - Authenticate the Firebase CLI
- `firebase use --add` - Add your Firebase Project as a target to `.firebaserc`
- `nx g @simondotm/nx-firebase:function my-function --firebaseApp llecoop-firebase` - Add a firebase function to this project

See the plugin [README](https://github.com/simondotm/nx-firebase/blob/main/README.md) for more information.

## Commands

- `nx run llecoop-firebase:deploy` - Deploy this app to firebase
- `nx run llecoop-firebase:serve` - Serve this app using the firebase emulator
- `nx run llecoop-firebase:build` - Build all functions associated with this app
- `nx run llecoop-firebase:test` - Test all functions associated with this app
- `nx run llecoop-firebase:lint` - Lint all functions associated with this app

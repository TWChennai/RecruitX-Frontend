RecruitX-Frontend
=================

## Dev Setup

### Node

#### Using asdf Package Manager
  * Install [asdf](https://github.com/asdf-vm/asdf) (the package manager) that will be used to handle multiple versions of erlang and elixir.

  Note: `brew` installation is not working as expected :(

  ```bash
  rm -rf ~/.asdf && git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.4.2

  # if you are using bash
  echo -e '\n. $HOME/.asdf/asdf.sh' >> ~/.bash_profile
  echo -e '\n. $HOME/.asdf/completions/asdf.bash' >> ~/.bash_profile

  # if you are using zsh
  echo -e '\n. $HOME/.asdf/asdf.sh' >> ~/.zshrc
  echo -e '\n. $HOME/.asdf/completions/asdf.bash' >> ~/.zshrc
  ```

  * Install
  ```bash
  brew install autoconf # if autoconf is not present already.
  asdf plugin-add nodejs https://github.com/asdf-vm/asdf-nodejs.git
  bash ~/.asdf/plugins/nodejs/bin/import-release-team-keyring
  asdf install
  asdf install nodejs 6.11.0
  ```

Note: The versions of tools installed can be found in `.asdf/installs/`

## Dependencies
Install other dependencies
```bash
brew install phantomjs gradle
npm install -g ionic@1.3.22 cordova bower

npm install
```

## Environment variables:
```
API_URL
VERSION
OKTA_URL
API_KEY
DEPLOY_CHANNEL
OKTA_ENABLED
```

## Run Tests
```bash
PHANTOMJS_BIN="$(which phantomjs)" ./node_modules/.bin/karma start tests/unit-tests.conf.js
```

## Build and Run the app
1. Add an emulator using Android Studio. This will install android as well as create avds.

https://developer.android.com/studio/run/managing-avds.html


#### Android
```bash
ionic build android
```

1. Launch an emulator
https://developer.android.com/studio/run/managing-avds.html

2. Run
```bash
ionic run android
```


#### iOS
```bash
ionic build ios
```

1. Open the iOS app in Xcode
```bash
open platforms/ios/RecruitX.xcworkspace
```
2. Run the app (CMD + R)

RecruitX-Frontend
=================

## Dev Setup

### Node

#### Using asdf Package Manager

  * [asdf](https://github.com/asdf-vm/asdf) package manager is used to handle multiple versions of node.
  * Install asdf

  ```bash
  brew install autoconf # if autoconf is not present already.
  brew install asdf

  # if using bash
  echo "source /usr/local/opt/asdf/asdf.sh" >> ~/.bashrc

  # if using zsh
  echo "source /usr/local/opt/asdf/asdf.sh" >> ~/.zshrc
  ```

  * Install node

  ```bash
  asdf plugin-add nodejs https://github.com/asdf-vm/asdf-nodejs.git
  bash /usr/local/opt/asdf/plugins/nodejs/bin/import-release-team-keyring
  cd /path/to/RecruitX-Frontend
  asdf install
  ```

## Dependencies
Install other dependencies
```bash
brew install phantomjs gradle
npm install -g ionic@1.3.22 cordova bower

npm install
```

### Other Dependencies

* Download and install direnv , then hook it bash / zsh.
  https://direnv.net/

* Download and install git-crypt.
  copy the backend.key into project folder. unlock the .envrc file which will export environment variables
  ```bash
     git-crypt unlock backend.key

To connect with app with local server, API_URL should contain ip address of your local machine instead of 'localhost'.
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

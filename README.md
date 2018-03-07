RecruitX-Frontend
=================

## Dependencies
```
install node 6.11.0 and nvm 3 or 4
brew install phantomjs gradle
npm install -g ionic@1.3.22 cordova bower

npm install
bower install
```

### Environment variables:
```
API_URL
VERSION
OKTA_URL
API_KEY
DEPLOY_CHANNEL
```

## Run Tests
```
PHANTOMJS_BIN="$(which phantomjs)" ./node_modules/.bin/karma start tests/unit-tests.conf.js
```

### Android
1. Add an emulator using Android Studio
This will install android as well as create vds.

https://developer.android.com/studio/run/managing-avds.html


## Build and Run
```
1.

ionic build android
ionic build ios
```

Launch an emulator
https://developer.android.com/studio/run/managing-avds.html

2. Run `ionic run android`

### iOS

1. Open the iOS app in Xcode `open platforms/ios/RecruitX.xcworkspace`
2. Run the app (CMD + R)

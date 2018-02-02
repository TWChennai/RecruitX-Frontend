RecruitX-Frontend
=================

## Dependencies
```
brew install node@8 phantomjs gradle
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

## Build and Run
```
ionic platform add android
ionic platform add ios

ionic build android
ionic build ios
```

### Android
1. Add an emulator using Android Studio
2. Run `ionic run android`

### iOS

1. Open the iOS app in Xcode `open platforms/ios/RecruitX.xcworkspace`
2. Run the app (CMD + R)

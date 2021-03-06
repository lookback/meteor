Package.describe({
  // XXX We currently hard-code the "launch-screen" package in the
  // build tool. If this package is in your app, we turn off the
  // default splash screen loading behavior (this packages hides it
  // explicitly). In the future, there should be a better interface
  // between such packages and the build tool.
  name: 'launch-screen',
  summary: 'Default and customizable launch screen on mobile.',
  version: '1.0.0'
});

Cordova.depends({
  'org.apache.cordova.splashscreen': '0.3.3'
});

Package.onUse(function(api) {
  api.addFiles('mobile-launch-screen.js', 'web');
  api.use(['blaze', 'templating'], 'web', { weak: true });

  // XXX remove weak dependency on iron:router. Instead, add
  // code to iron:router to use this package directly.
  api.use(['iron:router'], 'web', { weak: true });

  api.export('LaunchScreen');
});


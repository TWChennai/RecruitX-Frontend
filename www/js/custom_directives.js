angular.module('recruitX')
  .directive('disableUiSref', ['$parse', '$rootScope',
    function($parse, $rootScope) {
      return {
        priority: 100, // compile before ngClick
        restrict: 'A', // restrict to attributes
        compile: function($element, attr) {
          var fn = $parse(attr.disableUiSref);
          return {
            pre: function link(scope, element) {
              var eventName = 'click';
              element.on(eventName, function(event) {
                var callback = function() {
                  if (fn(scope, {
                    $event: event
                  })) {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    return false;
                  }
                };
                if ($rootScope.$$phase) {
                  scope.$evalAsync(callback);
                } else {
                  scope.$apply(callback);
                }
              });
            },
            post: function() {}
          };
        }
      };
    }
  ]);

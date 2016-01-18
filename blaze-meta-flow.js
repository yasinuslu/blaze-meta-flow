Meta.flow = {
  defaults: {
    title: ""
  }
};

Meta.flow.config = function (defaults) {
  _.extend(Meta.flow.defaults, defaults);
};

Meta.flow.onAfterAction = function (route) {
  FlowRouter.subsReady(function () {
    var options = route.route.options;

    Meta.dict.set("tag", {});
    var meta = _.extend({}, Meta.flow.defaults, options.meta);
    Meta.setTitle(getResult(meta.title, route));

    var other = _.omit(meta, "title");
    _.each(other, function (val, key) {
      Meta.set(key, getResult(val, route));
    });
  });
};

// onAfterAction needs to be triggered after subscriptions and needs getParam to be available
// if we add it as an enter trigger we have these problems (subscriptions not completed)
// we can call it like FlowRouter.subsReady(fn); Doesn't work on first route
FlowRouter.Route.prototype.callAction = _.wrap(FlowRouter.Route.prototype.callAction, function (func, route) {
  func.apply(this, _.rest(arguments));
  Meta.flow.onAfterAction(route);
});

var getResult = function (val, route) {
  return _.isFunction(val) ? val(route) : val;
};

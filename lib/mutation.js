exports.handleMutation = (request, value, mutate) => {
  if (mutate) {
    Object.keys(value).forEach(parameter => {
      if (request[parameter] === undefined) {
        Object.defineProperty(request, parameter, { value: value[parameter], enumerable: true });
      }
    });
  }

  return null;
};

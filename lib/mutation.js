exports.handleMutation = (request, value) => {
  Object.keys(value).forEach(parameter => {
    if (request[parameter] === undefined) {
      Object.defineProperty(request, parameter, { value: value[parameter], enumerable: true });
    }
  });

  return null;
};

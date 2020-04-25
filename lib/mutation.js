exports.handleMutation = (request, value, mutate) => {
  if (mutate) {
    Object.keys(value).forEach(parameter => {
      Object.defineProperty(request, parameter, { value: value[parameter], enumerable: true });
    });
  }

  return null;
};

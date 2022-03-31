exports.handleMutation = (request, parameter, value, mutate) => {
  if (mutate) {
    request[parameter] = value;
  }

  return null;
};

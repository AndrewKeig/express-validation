
exports.clean = (results) => results
  .filter(item => item)
  .reduce((a, b) => a.concat(b), [])
  .reduce((acc, curr) => ({ ...acc, ...curr }), null);

exports.keyByField = (results, run) => {
  if (run) {
    return Object.keys(results)
      .map(parameter => results[parameter]
        .reduce((a, b) => Object.assign(a, { [b.context.key]: b.message }), {}));
  }

  return results;
};

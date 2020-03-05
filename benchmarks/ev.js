/* eslint-disable no-console */
const Benchmark = require('benchmark');
const { validate, Joi } = require('../lib/index');

const schema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .required(),
  }),
};

const middleware = validate(schema, {}, {});
const suite = new Benchmark.Suite();

suite
  .add('Params no errors', () => middleware({ params: { id: '1' } }, {}, () => { }))
  .add('Params with errors', () => middleware({ params: { id: 'fail' } }, {}, () => { }))
  .on('complete', function suiteComplete() {
    console.log(`Fastest is ${this.filter('fastest').map('name')}`);

    for (let i = 0; i < this.length; i += 1) {
      console.log(this[i].toString());
    }
  })
  .run({ async: true });

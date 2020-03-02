
//   console.log(errors);

//   errors.details.forEach(function (error) {
//     const errorExists = errObj.find(function (item) {
//       if (item && item.field === error.path && item.location === location) {
//         console.log('----', item);
//         item.messages.push(error.message);
//         item.types.push(error.type);
//         return item;
//       }
//       return;
//     });

//     if (!errorExists) {
//       errObj.push({
//         field: error.path,
//         location: location,
//         messages: [error.message],
//         types: [error.type]
//       });
//     }
//     // console.log('errObj', errObj);
//   });
// });


// if (this.flatten) {
//   return this.errors.map(item => item.messages).reduce((a, b) => a.concat(b), []);
// }

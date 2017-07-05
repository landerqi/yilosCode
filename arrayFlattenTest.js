
function flatten(arr) {
  return arr.reduce(function(acc, val) {
    return acc.concat(Array.isArray(val) ? flatten(val) : val);
  }, [])
}
flatten([[[1, [1.1]], 2, 3], [4, 5]]);

var flatten = (arr) => arr.reduce(
    (acc, val) => acc.concat(Array.isArray(val) ? flatten(val) : val),
    []
  )
flatten([[[1, [1.1]], 2, 3], [4, 5]]);

const flatten = arr => arr.reduce(
  (acc, val) => acc.concat(Array.isArray(val) ? flatten(val) : val),
  []
)

var flatten = (arr) => {
  return arr.reduce(
    (acc, val) => acc.concat(Array.isArray(val) ? flatten(val) : val),
    []
  )
}
flatten([[[1, [1.1]], 2, 3], [4, 5]]);

function flattenDeep (arr) {
  var result = [];
  (function flatten(arr) {
    var index = -1,
        length = arr.length;
    while (++index < length) {
      var value = arr[index];
      if (!Array.isArray(value)) {
        result.push(value);
      } else {
        flatten(value);
      }
    }
  })(arr)
  return result;
}
flattenDeep([[[1, [1.1]], 2, 3], [4, 5]]);

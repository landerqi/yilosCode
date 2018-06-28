var LIMIT = 10000000;
var arr = new Array(LIMIT);
arr.push({a: 22});
console.time("Array insertion time");
for (var i = 0; i < LIMIT; i++) {
arr[i] = i;
}
console.timeEnd("Array insertion time");
function delayedPromise(time, value) {
  return new Promise(function(resolve, reject) {
    setTimeout(() => resolve(value), time)
  })
}

async function serial() {
 for (let i = 0; i<10; i+=1) {
  let promise = delayedPromise(Math.random() * 1000, i)
  let result = await promise
  console.log("Resolved serial: " + result)
 }
 console.log("Done with serial!")
}

async function parallel() {
  let promises = range(0, 10).map((i) => delayedPromise(Math.random() * 1000, i))
  for (let promise of promises) {
    console.log("Resolved parallel: " + await promise)
  }
  console.log("Done with parallel!")
}

async function all() {
  let promises = range(0, 10).map((i) => delayedPromise(Math.random() * 1000, i))
  await Promise.all(promises.map(async (promise) => console.log("Resolved all: " + await promise)))

  console.log("Done with all!")
}

async function race() {
  let promises = range(0, 10).map((i) => delayedPromise(Math.random() * 1000, i))
  console.log("Resolved race: " + await Promise.race(promises))

  console.log("Done with race!")
}

function range(start, count) {
  return Array.apply(0, Array(count))
    .map(function (element, index) {
      return index + start;
    });
}

serial().then(parallel).then(all).then(race)

console.log(process.argv);

let totalNum = 0,
	argLength = process.argv.length;

for (let i = 2; i < argLength; i ++) {
	totalNum += Number(process.argv[i]);
}

console.log(totalNum);


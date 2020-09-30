
export function getArguments() {
	const args = process.argv.slice(2);
	const argMap = {};

	if (args.length % 2)
		usageError();

	for (let i = 0; i < args.length; i += 2) {
		let key = args[i];
		
		if (!/^--([a-zA-Z]+-)*[a-zA-Z]+$/g.test(key))
			throw new Error('Invalid argument name ' + key);
		
		key = key
			.replace(/^--/, '')
			.replace(/-([a-z])/g, g => g[1].toUpperCase());
		
		argMap[key] = args[i + 1];
	}

	let userId = parseInt(argMap['userId']);
	let transferId = parseInt(argMap['transferId']);
	let amount = parseFloat(argMap['amount']);

	if (!userId || !transferId || !amount) {
		usageError();
	}
	return argMap;
}

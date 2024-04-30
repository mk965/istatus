/**
 * 处理并解析命令行参数为键值对对象。
 *
 * @param {string[]} args 命令行参数的字符串数组，每个参数形式为`key=value`。
 * @returns {Record<string, string>} 返回一个记录（对象），其中包含解析后的键值对参数。
 */
export const argsHandle = (args: string[]): Record<string, string | boolean> => {
	const params: Record<string, string | boolean> = {};

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		if (arg.startsWith('--')) {
			const key = arg.slice(2);
			const nextArg = args[i + 1];
			if (nextArg && !nextArg.startsWith('--')) {
				params[key] = nextArg;
				i++; // skip the value since we already handled it
			} else {
				params[key] = true; // if no value provided, set it to true
			}
		}
	}
	return params;
};

/**
 * 处理并解析命令行参数为键值对对象。
 *
 * @param {string[]} args 命令行参数的字符串数组，每个参数形式为`key=value`。
 * @returns {Record<string, string>} 返回一个记录（对象），其中包含解析后的键值对参数。
 */
export const argsHandle = (args: string[]): Record<string, string> => {
	return args.reduce<Record<string, string>>((params, arg) => {
		const [key, value] = arg.split('=') as [string, string];
		params[key] = value;
		return params;
	}, {});
};

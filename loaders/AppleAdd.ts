import fs from 'fs';
import path from 'path';

const defaultOptions = {
	date: new Date().toISOString(),
	value: 0,
	dataFilePath: path.resolve(__dirname, '../data/AppleHealth.json'),
}

// type Options = typeof defaultOptions;
// = {
// 	date: string;
// 	value: number;
// 	dataFilePath?: string
// };

/**
 *
 * @param options
 */
export const AddData = async (options: any) => {
	return new Promise((resolve, reject) => {

		if (!options.type || !options.date || !options.value) reject('type, date, value is required');

		fs.readFile(options.dataFilePath, (err, data) => {
			if (err) {
				console.error('Error reading file:', err);
				reject(err);
				return;
			}
			try {
				const curData = JSON.parse(data.toString());
				if (!curData[options.type]) curData[options.type] = {};
				
				(options.date ?? []).forEach((date: string, index: number) => {
					if (!options.value[index]) return;
					if (!curData[options.type][date]) curData[options.type][date] = 0;
					curData[options.type][date] = +options.value[index];
				});

				fs.writeFile(options.dataFilePath, JSON.stringify(curData), (err) => {
					if (err) {
						console.error('Error writing file:', err);
						reject(err);
						return;
					}
					resolve(true);
				});
			} catch (error) {
				console.error('TypeError: ', error);
				reject(error);
			}
		});
	});
};

export default AddData;

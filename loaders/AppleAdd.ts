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
				if (!curData[options.type][options.date]) curData[options.type][options.date] = 0;
				curData[options.type][options.date] += +options.value;
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

		// console.log(fileStr)
		


		// fs.createReadStream(options.dataFilePath)
		// 	.pipe(fs.createWriteStream(options.dataFilePath, { flags: 'a' }))
		// 	.on('finish', () => {
		// 		resolve(true);
		// 	})
		// 	.on('error', (err) => {
		// 		reject(err);
		// 	});
	});
};

export default AddData;

import fs from 'fs';

const getFileSize = (filePath: string) => {
	return new Promise<number>((resolve, reject) => {
		fs.stat(filePath, (err, stats) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(stats.size);
		});
	});
};

export { getFileSize };
import fs from 'fs';
import dayjs from 'dayjs';
import sax, { SAXStream } from 'sax';
import { HEALTH_RECORD_TYPES } from './config';
import { getFileSize } from '../utils/file';
import ProgressBar from '../utils/progressBar';

// Define the map of type to key only once
const typeToKeyMap: Record<string, keyof typeof HEALTH_RECORD_TYPES> = {};
for (const key in HEALTH_RECORD_TYPES) {
	if (HEALTH_RECORD_TYPES.hasOwnProperty(key)) {
		typeToKeyMap[HEALTH_RECORD_TYPES[key].type] = key;
	}
}

type HealthRecordType = keyof typeof HEALTH_RECORD_TYPES;
type Options = {
	type?: HealthRecordType;
	historyFilePath: string;
	outputFilePath: string;
};
type Data = Record<string, Record<string, number>>;

const LoadHistoryData = async (options: Options) => {
	return new Promise<Data>(async (resolve, reject) => {
		const { type, historyFilePath, outputFilePath } = options;
		const totalFileSize = await getFileSize(options.historyFilePath);
		const progressBar = ProgressBar(totalFileSize);
		const saxStream: SAXStream = sax.createStream(true);
		const writeStream = fs.createWriteStream(outputFilePath);
		const data: Data = {};
		let bytesRead: number = 0;

		const processRecord = (node: sax.Tag) => {
			const curType = typeToKeyMap[node.attributes.type as string];
			if (!curType) return;
			const config = HEALTH_RECORD_TYPES[curType];
			const func = config.func;
			if (!data[curType]) data[curType] = {};
			const date = dayjs(node.attributes.creationDate as any).format(
				'YYYY-MM-DD'
			);
			if (!data[curType][date]) data[curType][date] = func('0');
			data[curType][date] += func(`${node.attributes.value}`);
		};

		saxStream.on('error', function (e) {
			console.error('error!', e);
			this.resume();
		});

		saxStream.on('opentag', function (node) {
			if (
				!type ||
				(type &&
					node.name === 'Record' &&
					node.attributes.type === HEALTH_RECORD_TYPES[type].type)
			) {
				processRecord(node as sax.Tag);
			}
		});

		saxStream.on('end', function () {
			writeStream.write(JSON.stringify(data));
			writeStream.end();
			progressBar.stop();
			resolve(data);
		});

		fs.createReadStream(historyFilePath)
			.pipe(saxStream)
			.on('data', (chunk) => {
				bytesRead += chunk.length;
				progressBar.tick(bytesRead);
			})
			.on('error', (err) => {
				reject(err);
			});
	});
};

export default LoadHistoryData;

// type: 'water',
// loadHistoryData({
//     historyFilePath: path.resolve(__dirname, './test.xml'),
//     outputFilePath: path.resolve(__dirname, './file-copy.json'),
// }).then((data) => {
//     console.log('done', data);
// }).catch(err => {
//     console.error('Error:', err);
// });


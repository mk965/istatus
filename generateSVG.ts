import dayjs from "dayjs";

type DataItem = {
	date: Date;
	key: string;
	value: number;
};

type CreateSVGOptions = {
	cellSize: number;
	cellPadding: number;
};

type LevelColor = {
	bg: string;
	border: string;
};

const generateDayRect = (
	xCoord: number,
	yCoord: number,
	cellSize: number,
	bgColor: string,
	borderColor: string,
	date: string
) => {
	return `<g>
	  <rect
		x="${xCoord}"
		y="${yCoord}"
		width="${cellSize}"
		height="${cellSize}"
		date="${date}"
		fill="${bgColor}"
		stroke="${borderColor}"
		rx="4"
		ry="4"
	  />
	</g>`;
};

const getLevelColor = (num: number): LevelColor => {
	const levelMap: { [key: number]: LevelColor } = {
		0: { bg: '#ebedf0', border: 'rgba(27, 31, 35, 0.06)' },
		1: { bg: '#9be9a8', border: 'rgba(27, 31, 35, 0.06)' },
		1000: { bg: '#40c463', border: 'rgba(27, 31, 35, 0.06)' },
		2000: { bg: '#30a14e', border: 'rgba(27, 31, 35, 0.06)' },
		3000: { bg: '#216e39', border: 'rgba(27, 31, 35, 0.06)' },
	};
	const levels = Object.keys(levelMap).map(Number).reverse();
	const levelKey = levels.find((key) => num >= key) || 0;
	return levelMap[levelKey];
};

const generateYearSVG = (
	dataObj: Record<string, DataItem>,
	targetYear: number,
	options: CreateSVGOptions
) => {
	const { cellSize = 20, cellPadding = 4 } = options;
	// const svgWidth = 53 * cellSize;
	// const svgHeight = 7 * cellSize + cellPadding * 6;
	let svg = '';

	let week = 0;
	for (let day = 0; day < 366; day++) {
		// const currentDate = new Date(targetYear, 0, 1);

		let currentDate = dayjs().year(targetYear).month(0).date(1);
		currentDate = currentDate.add(day, 'day');

		const weekDay = currentDate.day();
		if (currentDate.year() !== targetYear) break;
		const xCoord = week * cellSize + cellPadding;
		const yCoord = weekDay * cellSize + cellPadding;
		const dateStr = currentDate.format('YYYY-MM-DD');
		const data = dataObj[dateStr];
		const value = data?.value ?? 0;
		const { bg, border } = getLevelColor(value);

		// const currentDate = new Date(targetYear, 0, 1);
		// currentDate.setDate(currentDate.getDate() + day);
		// const weekDay = currentDate.getDay();
		// if (currentDate.getFullYear() !== targetYear) break;
		// const xCoord = week * cellSize + cellPadding;
		// const yCoord = weekDay * cellSize + cellPadding;
		// const dateStr = dayjs(currentDate).format('YYYY-MM-DD');
		// const data = dataObj[dateStr];
		// const value = data?.value ?? 0;
		// const { bg, border } = getLevelColor(value);

		// console.log(currentDate);

		svg += generateDayRect(
			xCoord,
			yCoord,
			cellSize - cellPadding,
			bg,
			border,
			dateStr
		);
		weekDay === 6 && week++;
	}

	return svg;
};

const sortByYear = (
	data: Record<string, number>
): Record<string, Record<string, DataItem>> => {
	const yearObj: Record<string, Record<string, DataItem>> = {};

	for (const [key, value] of Object.entries(data)) {
		const date = new Date(key);
		const year = date.getFullYear();
		if (!yearObj[year]) yearObj[year] = {};
		yearObj[year][key] = { key, value, date };
	}

	return yearObj;
};

export const generateSVG = (data: Record<string, number>): string => {
	const options: CreateSVGOptions = {
		cellSize: 20,
		cellPadding: 4,
	};

	const yearSVGHeight = options.cellSize * 7;
	const yearGap = 30;

	const svgArr = Object.entries(sortByYear(data)).map(
		([year, yearData], index) => {
			const yearSVG = generateYearSVG(yearData, parseInt(year), options);
			const svg = `
				<text x="10" y="${index * yearSVGHeight + (index + 1) * (yearGap - 2)}" font-size="20" fill="#ebedf0" font-weight="800">${year}</text>
				<svg width="${options.cellSize * 53}" height="${yearSVGHeight}" x="0" y="${index * yearSVGHeight + (index + 1) * yearGap}">
					${yearSVG}
				</svg>`;
			return svg;
		}
	);

	return `<svg viewBox="0 0 ${options.cellSize * 53} ${svgArr.length * yearSVGHeight + svgArr.length * yearGap}" xmlns="http://www.w3.org/2000/svg">
		${svgArr.join('')}
	</svg>`;
};

interface HealthRecordType {
	type: string;
	unit: string;
	track_color: string;
	func: (arg: string) => number;
}


export const HEALTH_RECORD_TYPES: Record<string, HealthRecordType> = {
    // 消耗的能量
	energy: {
		type: 'HKQuantityTypeIdentifierActiveEnergyBurned',
		unit: 'kCal',
		track_color: '#ED619C',
		func: parseFloat,
    },
    // 锻炼时长
	exercise: {
		type: 'HKQuantityTypeIdentifierAppleExerciseTime',
		unit: 'mins',
		track_color: '#D7FD37',
		func: parseInt,
    },
    // 站立小时
	stand: {
		type: 'HKCategoryTypeIdentifierAppleStandHour',
		unit: 'hours',
		track_color: '#62F90B',
		func: (x: string) =>
			x.includes('HKCategoryValueAppleStandHourStood') ? 1 : 0,
    },
    // 喝水量
	water: {
		type: 'HKQuantityTypeIdentifierDietaryWater',
		unit: 'mL',
		track_color: '#aaa',
		func: parseInt,
	},
};
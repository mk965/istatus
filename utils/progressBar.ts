import { SingleBar } from 'cli-progress';

export default function createProgressBar(total: number, options = {}) {
	const defaultOptions = {
		format: 'Progress [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}',
	};
	const progressBar = new SingleBar({ ...defaultOptions, ...options });

	try {
		progressBar.start(total, 0);
	} catch (error) {
		console.error('Error starting progress bar:', error);
	}

	return {
		tick: (value: number) => {
			try {
				progressBar.update(value);
			} catch (error) {
				console.error('Error updating progress bar:', error);
			}
		},
		stop: () => {
			try {
				progressBar.stop();
			} catch (error) {
				console.error('Error stopping progress bar:', error);
			}
		},
	};
}

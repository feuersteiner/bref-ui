export default {
	props:
		'label?: string; value?: number; onSeek?: (value: number) => void; disabled?: boolean = false; size?: BaseSize = medium',
	purpose: 'Show determinate or indeterminate progress.',
	example: '<Progress value={0.4} label="Upload progress" />'
};

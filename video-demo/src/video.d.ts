export {};

declare global {
	interface Window {
		__brefVideo?: {
			duration: number;
			seek: (seconds: number) => Promise<void>;
		};
	}
}

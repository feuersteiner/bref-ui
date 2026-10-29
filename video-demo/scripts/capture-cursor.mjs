export const center = async (locator) => {
	const box = await locator.boundingBox();
	if (!box) throw new Error('A recorded interaction target is not visible.');
	return [box.x + box.width / 2, box.y + box.height / 2];
};
export const move = (a, b, progress) => {
	const p = Math.min(1, Math.max(0, progress));
	const t = p * p * p * (p * (p * 6 - 15) + 10);
	return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
};

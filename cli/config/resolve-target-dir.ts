export const resolveTargetDir = (
	projectRoot: string,
	ui: string,
	aliases: Record<string, string> = {}
): string => {
	const mappings = Object.entries({ $lib: 'src/lib', ...aliases }).sort(
		([left], [right]) => right.length - left.length
	);
	const match = mappings.find(([alias]) => ui === alias || ui.startsWith(`${alias}/`));

	if (!match) throw new Error(`Cannot resolve UI alias "${ui}".`);

	const [alias, target] = match;
	const directory = target.startsWith('/') ? target : `${projectRoot}/${target}`;
	return Bun.fileURLToPath(Bun.pathToFileURL(`${directory}${ui.slice(alias.length)}`));
};

import type { Run, RunReport } from './run-state.svelte.js';

type Recipe = {
	prompt: string;
	report: Omit<RunReport, 'findings'> & { findings: readonly RunReport['findings'][number][] };
	steps: readonly (readonly string[])[];
};

const quoted = (text: string) => `“${text.length > 180 ? text.slice(0, 177) + '…' : text}”`;
const brief = (run: Run) => (run.instruction ? `\n\nLatest brief: ${quoted(run.instruction)}` : '');

export function answer(run: Run, text: string, recipe: Recipe) {
	const report = run.report ?? recipe.report;
	const completed = run.nodes.filter((node) => node.progress === 100);
	const current = run.nodes[run.step];
	if (/\b(brief|prompt|instruction|asked|working on)\b/i.test(text))
		return `Original request: ${quoted(run.prompt ?? recipe.prompt)}${brief(run)}`;
	if (/\b(next|recommend|should|after)\b/i.test(text)) {
		if (run.status === 'completed') return report.next + brief(run);
		if (run.status === 'cancelled')
			return `Retry to resume this brief from the first step. ${completed.length} of ${run.nodes.length} steps finished before cancellation.${brief(run)}`;
		if (run.status === 'queued')
			return `This run is queued behind active work. First: ${run.nodes[0].name.toLowerCase()}.${brief(run)}`;
		return `${current.name}: ${current.purpose}${run.nodes[run.step + 1] ? ` Then: ${run.nodes[run.step + 1].name.toLowerCase()}.` : ' This is the final step.'}${brief(run)}`;
	}
	if (
		/\b(progress|status|done|finished|ready|long|happening|going|complete|completed|how far)\b/i.test(
			text
		) &&
		!/\b(results?|reports?|findings)\b/i.test(text)
	) {
		const progress = Math.round(
			run.nodes.reduce((sum, node) => sum + node.progress, 0) / run.nodes.length
		);
		const status =
			run.status === 'running'
				? `${current.name} is ${current.progress}% complete.`
				: run.status === 'queued'
					? 'Queued; waiting for the active run to finish.'
					: run.status === 'cancelled'
						? 'Cancelled; no further steps will run until retry.'
						: 'All steps are complete; the report is ready.';
		return `${status} ${completed.length}/${run.nodes.length} steps complete (${progress}% overall).${brief(run)}`;
	}
	if (run.workflow === 0 && /\b(schedule|timeline|when|weeks?)\b/i.test(text))
		return `${report.findings[2].title}: ${report.findings[2].text}${brief(run)}`;
	if (run.workflow < 2 && /\b(who|audience)\b/i.test(text))
		return `${run.workflow === 0 ? report.findings[0].text : report.summary}${brief(run)}`;
	const finding = report.findings.find((item) =>
		item.title
			.toLowerCase()
			.split(/\W+/)
			.some((word) => word.length > 3 && new RegExp(`\\b${word}\\b`, 'i').test(text))
	);
	if (finding)
		return `${finding.title}: ${finding.text}${run.status !== 'completed' ? '\n\nThis is the sample target; execution is still incomplete.' : ''}`;
	const node = run.nodes.find((item) => text.toLowerCase().includes(item.name.toLowerCase()));
	if (node) return `${node.name}: ${node.output ?? `Not completed yet. ${node.purpose}`}`;
	if (/\b(why|evidence|source|interviews|patterns)\b/i.test(text) && run.workflow === 2)
		return `The six sample interviews mention setup friction four times, examples three times, and sharing twice. That supports prioritizing setup. These are demo findings, not newly collected research.${brief(run)}`;
	if (/\b(results?|reports?|summary|summarize|find|found|findings|explain|show)\b/i.test(text)) {
		if (!completed.length)
			return `No completed results yet. ${run.status === 'cancelled' ? 'Retry to start again.' : `First step: ${run.nodes[0].purpose}`}${brief(run)}`;
		if (run.status === 'completed')
			return `${run.nodes.at(-1)?.output ?? report.summary}${brief(run)}`;
		return `${completed.length} completed step${completed.length === 1 ? '' : 's'} so far:\n\n${completed.map((node) => node.output).join('\n\n')}${brief(run)}`;
	}
	const options = [
		'Change the audience or launch timing',
		'Change the audience or page CTA',
		'Shorten the summary'
	][run.workflow];
	return `Ask about ${run.title.toLowerCase()}: progress, completed results or the next step. ${options}, or save another instruction as a brief note.${brief(run)}`;
}

export function revise(run: Run, text: string, recipe: Recipe) {
	const report: RunReport = {
		...(run.report ?? recipe.report),
		findings: (run.report ?? recipe.report).findings.map((finding) => ({ ...finding }))
	};
	const changes: string[] = [];
	let firstAffected = run.nodes.length - 1;
	const audience = text
		.match(
			/\b(?:audience\s*(?:to|is|:)|(?:focus on|target|for)\s+)\s*(.+?)(?:[.!?;\n]|\s+(?:in|over|within)\s+(?:one|two|three|four|[1-8])[- ]weeks?\b|$)/i
		)?.[1]
		?.trim();
	if (audience && run.workflow < 2) {
		firstAffected = 0;
		if (run.workflow === 0)
			report.findings[0].text = `For ${audience}. Lead with fewer steps from idea to finished work.`;
		else
			report.summary = `A quiet place for ${audience} to capture ideas, connect notes and find them again.`;
		changes.push(`Audience changed to ${quoted(audience)}.`);
	}
	const weeks = text.match(/\b(one|two|three|four|[1-8])[- ]weeks?\b/i)?.[1];
	if (weeks && run.workflow === 0) {
		firstAffected = Math.min(firstAffected, 1);
		const count =
			({ one: 1, two: 2, three: 3, four: 4 } as Record<string, number>)[weeks.toLowerCase()] ??
			Number(weeks);
		report.findings[2] = {
			...report.findings[2],
			title: `${count} week${count === 1 ? '' : 's'}`,
			text:
				count === 1
					? 'Invite 12 early users and share one working example. Keep the release private this week.'
					: `Week 1: invite 12 early users. Share three real workflows before a small public release in week ${count}.`
		};
		changes.push(`Launch schedule changed to ${count} week${count === 1 ? '' : 's'}.`);
	}
	const cta = text
		.match(/\b(?:cta|call to action)\s*(?:to|is|:|=)?\s*[“"']?(.+?)[”"']?[.!?]?$/i)?.[1]
		?.trim();
	if (cta && run.workflow === 1) {
		report.next = `Close with one invitation: ${cta.replace(/[”"']$/, '')}.`;
		changes.push(`Page CTA changed to ${quoted(cta)}.`);
	}
	if (/\b(shorter|concise|brief(er)?)\b/i.test(text)) {
		report.summary = report.summary.split('. ')[0].replace(/\.$/, '') + '.';
		changes.push('Final step shortened to a summary and next action.');
	}
	run.instruction = text;
	run.report = report;
	// Recompute affected steps; preserve earlier completed evidence.
	if (run.workflow === 0 && changes.length) {
		run.nodes[0].result = `${report.findings[0].text} ${report.findings[1].text}`;
		run.nodes[1].result = `${report.findings[2].title}: ${report.findings[2].text}`;
	} else if (run.workflow === 1 && audience) {
		run.nodes[0].result = report.summary;
	}
	const final = run.nodes.at(-1)!;
	final.result = /\b(shorter|concise|brief(er)?)\b/i.test(text)
		? `${report.summary}\nNext: ${report.next}`
		: `${report.summary}\n${report.findings.map((finding) => `${finding.title}: ${finding.text}`).join('\n')}\nNext: ${report.next}`;
	if (!changes.length) final.result += `\nBrief note for review: ${text}`;
	run.nodes.slice(firstAffected).forEach((node) => {
		node.output = undefined;
		node.progress = 0;
	});
	run.step = Math.min(run.step, firstAffected);
	return changes.length
		? changes.join(' ')
		: `Saved as a brief note: ${quoted(text)}. The final output will include this note; the sample findings stay unchanged.`;
}

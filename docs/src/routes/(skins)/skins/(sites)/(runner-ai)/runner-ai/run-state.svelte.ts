import { answer, revise } from './run-conversation.js';
import { samples, workflows, type CopyField, type MarketingCopy } from './marketing-assessment.js';
export { workflows } from './marketing-assessment.js';

export type RunStatus = 'draft' | 'queued' | 'running' | 'completed' | 'cancelled';
export type Message = { id: number; role: 'user' | 'agent'; text: string };
export type CustomStep = { name: string; checked: boolean };
export type RunConfig = { workflow: number; scope: CopyField[]; custom: CustomStep[] };
export const customStepLimit = 5;
export const stepNameLimit = 40;
export type RunNode = {
	/** Sample insight behind this step; custom review steps have none. */
	insightIndex?: number;
	name: string;
	purpose: string;
	result: string;
	progress: number;
	output?: string;
};
export type RunReport = {
	icon: string;
	title: string;
	summary: string;
	findings: { icon: string; title: string; text: string }[];
	next: string;
};
export type Run = {
	view: string;
	config: RunConfig;
	selectedNode: number;
	inspectorOpen: boolean;
	copy: MarketingCopy;
	applied: CopyField[];
	feedback: string;
	id: number;
	title: string;
	workflow: number;
	status: RunStatus;
	step: number;
	instruction: string;
	prompt?: string;
	report?: RunReport;
	draft: string;
	messages: Message[];
	nodes: RunNode[];
};

export function createRuns() {
	let serial = 0;
	let messageSerial = 0;
	let runs = $state<Run[]>([]);
	let selectedId = $state(1);
	let timer: ReturnType<typeof setInterval> | undefined;
	const selected = $derived(runs.find((run) => run.id === selectedId)!);
	const canCreate = $derived(
		runs.length < 12 || runs.some((run) => ['completed', 'cancelled'].includes(run.status))
	);

	function say(run: Run, role: Message['role'], text: string) {
		run.messages = [...run.messages, { id: ++messageSerial, role, text }].slice(-40);
	}

	function make(workflow: number, prompt: string, completed = false): Run {
		const recipe = workflows[workflow];
		return {
			view: completed ? 'assessment' : 'run',
			config: {
				workflow,
				scope: samples[workflow].insights.map((insight) => insight.field),
				custom: []
			},
			selectedNode: 0,
			inspectorOpen: false,
			copy: { ...samples[workflow].copy },
			applied: [],
			feedback: '',
			id: ++serial,
			title: recipe.name,
			workflow,
			status: completed ? 'completed' : 'queued',
			step: completed ? recipe.steps.length : 0,
			instruction: prompt === recipe.prompt ? '' : prompt,
			prompt,
			draft: '',
			messages: [
				{ id: ++messageSerial, role: 'user', text: prompt },
				{
					id: ++messageSerial,
					role: 'agent',
					text: completed
						? `${recipe.report.summary}\n\n${recipe.report.next}`
						: `The ${recipe.steps.length}-step demo will ${recipe.steps.map(([name]) => name.toLowerCase()).join(', then ')}. Ask about progress or revise the brief.`
				}
			],
			nodes: recipe.steps.map(([name, purpose, result], insightIndex) => ({
				insightIndex,
				name,
				purpose,
				result,
				progress: completed ? 100 : 0,
				output: completed ? result : undefined
			}))
		};
	}

	function advanceQueue() {
		if (runs.some((run) => run.status === 'running')) return;
		const next = [...runs].reverse().find((run) => run.status === 'queued');
		if (next) next.status = 'running';
	}

	function createDraft() {
		if (!canCreate) return false;
		if (runs.length >= 12) {
			const oldest = [...runs]
				.reverse()
				.find((run) => run.status === 'completed' || run.status === 'cancelled');
			runs = runs.filter((run) => run.id !== oldest?.id);
		}
		const run = make(0, workflows[0].prompt);
		run.status = 'draft';
		run.view = 'input';
		runs = [run, ...runs];
		selectedId = run.id;
		return true;
	}

	function configure(run: Run, config: RunConfig) {
		if (run.status === 'running' || run.status === 'queued' || !samples[config.workflow]) return;
		run.config = {
			workflow: config.workflow,
			scope: config.scope.filter(
				(field, index, fields) =>
					fields.indexOf(field) === index &&
					samples[config.workflow].insights.some((insight) => insight.field === field)
			),
			custom: config.custom
				.map(({ name, checked }) => ({ name: name.trim().slice(0, stepNameLimit), checked }))
				.filter(
					(step, index, steps) =>
						step.name &&
						!takenNames(config.workflow, steps.slice(0, index)).includes(step.name.toLowerCase())
				)
				.slice(0, customStepLimit)
		};
		if (run.status === 'draft') run.title = workflows[config.workflow].name;
	}

	function startRun(run: Run) {
		if (run.status === 'running' || run.status === 'queued') return false;
		const { workflow, scope, custom } = run.config;
		const sample = samples[workflow];
		if (!sample || !hasScope(run.config)) return false;
		run.workflow = workflow;
		run.title = sample.name;
		run.prompt = workflows[workflow].prompt;
		run.copy = { ...sample.copy };
		run.applied = [];
		run.feedback = '';
		run.report = undefined;
		run.instruction = '';
		run.step = 0;
		run.selectedNode = 0;
		run.inspectorOpen = false;
		run.nodes = [
			...sample.insights.flatMap((insight, insightIndex) =>
				scope.includes(insight.field)
					? [
							{
								insightIndex,
								name: insight.title,
								purpose: insight.purpose,
								result: insight.rationale,
								progress: 0
							}
						]
					: []
			),
			...custom
				.filter((step) => step.checked)
				.map(({ name }) => ({
					name,
					purpose: `Review the draft for ${name}.`,
					result: `Checked the draft for ${name}. No edit suggested.`,
					progress: 0
				}))
		];
		run.status = 'queued';
		run.view = 'run';
		runs = [run, ...runs.filter((item) => item.id !== run.id)];
		advanceQueue();
		return true;
	}

	function cancel(run: Run) {
		if (run.status !== 'running' && run.status !== 'queued') return;
		run.status = 'cancelled';
		say(
			run,
			'agent',
			`Cancelled with ${run.nodes.filter((node) => node.progress === 100).length}/${run.nodes.length} steps complete. The brief and completed outputs are saved.`
		);
		advanceQueue();
	}

	function retry(run: Run) {
		return startRun(run);
	}

	function applyEdit(run: Run, index: number) {
		if (run.status !== 'completed') return;
		const sample = samples[run.workflow];
		const insight = sample.insights[index];
		if (!insight) return;
		const applied = run.applied.includes(insight.field);
		run.copy[insight.field] = applied ? sample.copy[insight.field] : insight.rewrite;
		run.applied = applied
			? run.applied.filter((field) => field !== insight.field)
			: [...run.applied, insight.field];
		run.feedback = applied
			? `${insight.title} edit undone. Original copy restored.`
			: `${insight.title} edit applied to this local draft.`;
	}

	function send(run: Run) {
		const text = run.draft.trim().slice(0, 1000);
		if (!text) return;
		run.draft = '';
		say(run, 'user', text);
		const command = text
			.toLowerCase()
			.replace(/[.!?]+$/, '')
			.replace(/^(?:can|could|would) you /, '')
			.trim();
		if (
			/^(?:please )?(?:cancel|stop|pause)(?: (?:this run|the run|run|it))?(?: please)?$/.test(
				command
			)
		) {
			if (run.status === 'running' || run.status === 'queued') cancel(run);
			else
				say(
					run,
					'agent',
					run.status === 'completed'
						? 'This run is complete; nothing is running. Retry to start again.'
						: 'This run is already cancelled. The saved brief is available for retry.'
				);
		} else if (
			/^(?:please )?(?:retry|rerun|restart|try again|start again)(?: (?:this run|the run|run|it))?(?: please)?$/.test(
				command
			)
		) {
			if (run.status === 'completed' || run.status === 'cancelled') retry(run);
			else
				say(
					run,
					'agent',
					run.status === 'queued'
						? 'This run is already queued; its place is unchanged.'
						: 'This run is already running. Stop it before restarting.'
				);
		} else if (/^(?:hi|hello|hey|thanks|thank you|ok|okay)[.!]*$/i.test(text)) {
			say(
				run,
				'agent',
				`Ask about ${run.title.toLowerCase()}, check progress, or revise the saved brief.`
			);
		} else if (
			/^(?:please )?(?:make|change|revise|update|use|focus|target|shorten|add|remove|replace|save|keep|aim|set)\b/i.test(
				text
			) ||
			/^(?:can|could|would) you (?:please )?(?:make|change|revise|update|use|focus|target|shorten|add|remove|replace)\b/i.test(
				text
			)
		) {
			if (run.instruction === text) {
				say(run, 'agent', 'That instruction is already saved; no additional revision was started.');
				return;
			}
			const change = revise(run, text, workflows[run.workflow]);
			if (run.status === 'completed') {
				run.status = 'queued';
				runs = [run, ...runs.filter((item) => item.id !== run.id)];
				advanceQueue();
			}
			say(
				run,
				'agent',
				`${change} ${run.status === 'cancelled' ? 'Retry to apply it.' : run.status === 'queued' ? 'The revised steps are queued.' : 'The affected steps will use the updated brief.'}`
			);
		} else {
			say(run, 'agent', answer(run, text, workflows[run.workflow]));
		}
	}

	function step() {
		const run = runs.find((item) => item.status === 'running');
		if (!run) return;
		const node = run.nodes[run.step];
		node.progress = Math.min(100, node.progress + 5);
		if (node.progress < 100) return;
		node.output = node.result;
		run.step += 1;
		if (run.step === run.nodes.length) {
			run.status = 'completed';
			const report = run.report ?? workflows[run.workflow].report;
			say(run, 'agent', `Completed: ${report.summary}\n\nNext: ${report.next}`);
			advanceQueue();
		}
	}

	const first = make(0, workflows[0].prompt);
	const previous = make(2, workflows[2].prompt, true);
	runs = [first, previous];
	advanceQueue();

	return {
		get runs() {
			return runs;
		},
		get selected() {
			return selected;
		},
		get canCreate() {
			return canCreate;
		},
		select(id: number) {
			if (runs.some((run) => run.id === id)) selectedId = id;
		},
		createDraft,
		configure,
		startRun,
		cancel,
		retry,
		applyEdit,
		send,
		start() {
			if (!timer) timer = setInterval(step, 300);
		},
		stop() {
			clearInterval(timer);
			timer = undefined;
		}
	};
}

function takenNames(workflow: number, custom: CustomStep[]) {
	return [
		...samples[workflow].insights.map((insight) => insight.title),
		...custom.map(({ name }) => name)
	].map((name) => name.toLowerCase());
}

export function hasScope(config: RunConfig) {
	return config.scope.length > 0 || config.custom.some((step) => step.checked);
}

export function stepNameError(config: RunConfig, value: string) {
	const name = value.trim();
	if (!name) return 'Enter a step name.';
	if (name.length > stepNameLimit) return `Use ${stepNameLimit} characters or fewer.`;
	if (takenNames(config.workflow, config.custom).includes(name.toLowerCase()))
		return `“${name}” is already in the review scope.`;
	if (config.custom.length >= customStepLimit)
		return `Add up to ${customStepLimit} custom steps. Remove one to add another.`;
}

export function nodeStatus(run: Run, index: number) {
	if (run.nodes[index].progress === 100) return 'done';
	if (run.status === 'cancelled') return 'cancelled';
	if (index === run.step && run.status === 'running') return 'running';
	return 'queued';
}

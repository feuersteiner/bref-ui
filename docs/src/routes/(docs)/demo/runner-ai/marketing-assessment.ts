import type { IconProps } from 'bref-ui/types';

export type CopyField = 'headline' | 'body' | 'cta';
export type MarketingCopy = Record<CopyField, string>;
export const copyLabels: Record<CopyField, string> = {
	headline: 'Headline',
	body: 'Supporting copy',
	cta: 'Call to action'
};

type Insight = {
	icon: IconProps['name'];
	title: string;
	purpose: string;
	field: CopyField;
	rationale: string;
	rewrite: string;
};
type Sample = {
	name: string;
	reportTitle: string;
	audience: string;
	context: string;
	copy: MarketingCopy;
	insights: Insight[];
};

export const samples: Sample[] = [
	{
		name: 'Forma · Landing page',
		reportTitle: 'Make client review the clear benefit',
		audience: 'Independent designers managing client projects',
		context: 'A project hub for client feedback, files and approvals.',
		copy: {
			headline: 'A better way to work.',
			body: 'Forma brings everything together so you can focus on what matters.',
			cta: 'Learn more'
		},
		insights: [
			{
				icon: 'group',
				title: 'Audience clarity',
				purpose: 'Make the intended reader recognizable.',
				field: 'body',
				rationale:
					'“Everything” and “what matters” could address any team. Name independent designers and the client review they need to manage.',
				rewrite:
					'Built for independent designers: keep every client review beside the work, from first draft to final approval.'
			},
			{
				icon: 'lightbulb',
				title: 'Value proposition',
				purpose: 'Replace a broad promise with a concrete benefit.',
				field: 'headline',
				rationale:
					'“A better way” promises an improvement without explaining it. Lead with the feedback, files and approvals the product brings together.',
				rewrite: 'Client feedback, files and approvals in one place.'
			},
			{
				icon: 'ads_click',
				title: 'Call to action',
				purpose: 'Show what happens after the click.',
				field: 'cta',
				rationale:
					'“Learn more” leaves the destination unclear. A sample project gives the reader a specific, low-commitment next step.',
				rewrite: 'Explore a sample project'
			}
		]
	},
	{
		name: 'Fieldnotes · Welcome email',
		reportTitle: 'Make the first notebook the next step',
		audience: 'Freelance UX researchers organizing interview notes',
		context: 'A research notebook for interview notes, quotes and themes.',
		copy: {
			headline: 'Welcome to Fieldnotes!',
			body: 'We’re excited to have you. Discover powerful tools for better thinking.',
			cta: 'Get started'
		},
		insights: [
			{
				icon: 'group',
				title: 'Audience clarity',
				purpose: 'Connect the welcome to the reader’s work.',
				field: 'body',
				rationale:
					'“Powerful tools” never identifies the research task. Mention interview notes and a first notebook so the email feels relevant.',
				rewrite:
					'Keep interview notes, quotes and research themes together in your first Fieldnotes notebook.'
			},
			{
				icon: 'lightbulb',
				title: 'Value proposition',
				purpose: 'Give the welcome a useful reason to open.',
				field: 'headline',
				rationale:
					'“Welcome” confirms signup but says little about the benefit. Connect the headline to the researcher’s next useful outcome.',
				rewrite: 'Turn interview notes into a clear research story.'
			},
			{
				icon: 'ads_click',
				title: 'Call to action',
				purpose: 'Make the first useful action explicit.',
				field: 'cta',
				rationale:
					'“Get started” does not explain the first step. Name the notebook the reader will create.',
				rewrite: 'Create a research notebook'
			}
		]
	},
	{
		name: 'Relay · Product ad',
		reportTitle: 'Replace inflated claims with a clear offer',
		audience: 'Small agency leads coordinating client delivery',
		context: 'A shared view of project tasks, client approvals and delivery dates.',
		copy: {
			headline: 'Your team, supercharged.',
			body: 'The ultimate platform for seamless collaboration and maximum productivity.',
			cta: 'Click here'
		},
		insights: [
			{
				icon: 'group',
				title: 'Audience clarity',
				purpose: 'Name the team and the work being improved.',
				field: 'body',
				rationale:
					'“Ultimate platform” could describe any business software. Small agency leads need to recognize client approvals and delivery dates.',
				rewrite:
					'For small agencies: assign the next step, collect client approvals and see delivery dates in one shared view.'
			},
			{
				icon: 'lightbulb',
				title: 'Value proposition',
				purpose: 'Turn an inflated claim into a useful outcome.',
				field: 'headline',
				rationale:
					'“Supercharged” adds energy without a clear benefit. Describe the coordination problem this product helps solve.',
				rewrite: 'Keep client projects moving without chasing updates.'
			},
			{
				icon: 'ads_click',
				title: 'Call to action',
				purpose: 'Describe the destination of the ad.',
				field: 'cta',
				rationale:
					'“Click here” names the gesture, not the value. A project overview makes the destination understandable.',
				rewrite: 'See the project overview'
			}
		]
	}
];

export const workflows = samples.map((sample) => ({
	name: sample.name,
	prompt: `Headline: ${sample.copy.headline}\nCopy: ${sample.copy.body}\nCTA: ${sample.copy.cta}`,
	report: {
		icon: 'edit_note',
		title: sample.reportTitle,
		summary: 'Name the audience, make the benefit specific and describe the next step.',
		findings: sample.insights.map((insight) => ({
			icon: insight.icon,
			title: insight.title,
			text: insight.rationale
		})),
		next: 'Review the suggested edits against the campaign brief before publishing.'
	},
	steps: sample.insights.map(
		(insight) => [insight.title, insight.purpose, insight.rationale] as const
	)
}));

export default {
	props:
		"items: readonly SelectOptionDataProps[]; value?: string | string[]; onChange?: (value: string | string[]) => void; id?: string; placeholder?: string = Select…; emptyMessage?: SelectEmptyProps = { message: 'No options found' }; size?: BaseSize = medium; disabled?: boolean = false",
	purpose: 'Choose labeled options from a dropdown.',
	setup: 'let value = $state<string>();',
	example:
		'<label for="fruit">Fruit</label>\n<Select id="fruit" items={[{ id: "apple", label: "Apple" }]} bind:value />'
};

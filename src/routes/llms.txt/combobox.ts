export default {
	props:
		"items: readonly SelectOptionDataProps[]; value?: string | string[]; onChange?: (value: string | string[]) => void; id?: string = Generated; placeholder?: string = Select…; emptyMessage?: SelectEmptyProps = { message: 'No options found' }; size?: BaseSize = medium; disabled?: boolean = false; variant?: Exclude<Variant, 'filled'> = soft; wide?: boolean = false",
	purpose: 'Search and choose labeled options.',
	setup: 'let value = $state<string>();',
	example: '<Combobox items={[{ id: "apple", label: "Apple" }]} bind:value aria-label="Fruit" />'
};

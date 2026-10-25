export default {
	props:
		'items: TreeItemProps[]; sections?: TreeSectionProps[] = []; label?: string = Tree view; size?: BaseSize = medium; glass?: boolean = false; selection?: string | string[]; defaultExpanded?: boolean = false; onDelete?: (id: string) => void; node?: Snippet<[TreeItemProps]>',
	purpose: 'Navigate or select nested items.',
	example:
		'<TreeView items={[{ id: "files", label: "Files", children: [{ id: "notes", label: "Notes" }] }]} label="Files" />'
};

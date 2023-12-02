export interface ArticleTypeOption {
	value: string;
	label: string;
}

export const ARTICLE_TYPE_OPTIONS: ArticleTypeOption[] = [
	{ value: 'article', label: '文章' },
	{ value: 'requirements', label: '需求文档' },
];

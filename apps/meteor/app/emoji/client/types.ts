import type { TranslationKey } from '@rocket.chat/ui-contexts';

export type EmojiItem = {
	emoji: string;
	image: string;
	emojiHandle: string;
};

export type EmojiCategory = {
	key: string;
	i18n: TranslationKey;
};

export type EmojiByCategory = {
	key: string;
	i18n: TranslationKey;
	emojis: {
		list: EmojiItem[];
		limit: number | null;
	};
};

export type EmojiCategoryPosition = {
	el: Element;
	top: number;
};

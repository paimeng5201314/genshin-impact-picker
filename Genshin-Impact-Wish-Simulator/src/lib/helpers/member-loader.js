import { browser } from '$app/environment';
import { memberList } from '$lib/store/app-stores';
import { localMemberList } from './dataAPI/api-localstore';

export let memberDB = [];

memberList.subscribe((v) => {
	memberDB = v;
});

export const parseMembers = (content) => {
	const seen = new Set();
	return content
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter((line) => line && !line.startsWith('#'))
		.map((line) => {
			const match = line.match(/^([345])\s+(.+)$/);
			return { chineseChar: match?.[2]?.trim() || line, rarity: Number(match?.[1] || 3) };
		})
		.filter(({ chineseChar }) => {
			if (seen.has(chineseChar)) return false;
			seen.add(chineseChar);
			return true;
		})
		.map((item, index) => ({ name: `member-${index}`, ...item }));
};

// The roster is deliberately file-based: edit static/member-list.txt and restart/refresh.
export const loadMembers = async () => {
	if (!browser) return [];
	const response = await fetch('/member-list.txt', { cache: 'no-store' });
	if (!response.ok) throw new Error(`Unable to load member-list.txt (${response.status})`);
	const data = parseMembers(await response.text());
	memberDB = data;
	memberList.set(data);
	localMemberList.set(data);
	return data;
};

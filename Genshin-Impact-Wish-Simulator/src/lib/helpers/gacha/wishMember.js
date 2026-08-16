import { getMemberItem, rand } from './itemdrop-base';

const memberWish = {
	init({ stdver, version, phase }) {
		this._stdver = stdver;
		this._version = version;
		this._phase = phase;
		return this;
	},

	get(rarity, excludedNames = new Set()) {
		const available = getMemberItem().filter(({ chineseChar }) => !excludedNames.has(chineseChar));
		const matchingRarity = available.filter((item) => item.rarity === rarity);
		// Prefer the configured tier, but keep exact game odds even when that tier has too
		// few unique names: the probability roll is authoritative for result and animation.
		const selected = rand(matchingRarity.length ? matchingRarity : available);
		return selected ? { ...selected, rarity } : selected;
	}
};

export default memberWish;

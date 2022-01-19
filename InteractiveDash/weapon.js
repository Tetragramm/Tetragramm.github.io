define(['ko'], function(ko) {

	return function (weaponState) {
		const that = {};

		that.type = ko.observable(weaponState &&  weaponState.type  ? weaponState.type : "");
		that.ammo = ko.observable(weaponState &&  weaponState.ammo  ? weaponState.ammo : 0);
		that.ap = ko.observable(weaponState &&  weaponState.ap  ? weaponState.ap : 0);
		that.jam = ko.observable(weaponState &&  weaponState.jam  ? weaponState.jam : "");
		that.knife_hits = ko.observable(weaponState &&  weaponState.knife_hits  ? weaponState.knife_hits : 0);
		that.close_hits = ko.observable(weaponState &&  weaponState.close_hits  ? weaponState.close_hits : 0);
		that.long_hits = ko.observable(weaponState &&  weaponState.long_hits  ? weaponState.long_hits : 0);
		that.extreme_hits = ko.observable(weaponState &&  weaponState.extreme_hits  ? weaponState.extreme_hits : 0);
		that.knife_damage = ko.observable(weaponState &&  weaponState.knife_damage  ? weaponState.knife_damage : 0);
		that.close_damage = ko.observable(weaponState &&  weaponState.close_damage  ? weaponState.close_damage : 0);
		that.long_damage = ko.observable(weaponState &&  weaponState.long_damage  ? weaponState.long_damage : 0);
		that.extreme_damage = ko.observable(weaponState &&  weaponState.extreme_damage  ? weaponState.extreme_damage : 0);
		that.tags = ko.observable(weaponState &&  weaponState.tags  ? weaponState.tags : "");

		that.toJSON = function() {

			const weaponState = {
				"type": that.type(),
				"ammo": that.ammo(),
				"ap": that.ap(),
				"jam": that.jam(),
				"knife_hits": that.knife_hits(),
				"close_hits": that.close_hits(),
				"long_hits": that.long_hits(),
				"extreme_hits": that.extreme_hits(),
				"knife_damage": that.knife_damage(),
				"close_damage": that.close_damage(),
				"long_damage": that.long_damage(),
				"extreme_damage": that.extreme_damage(),
				"tags": that.tags()
			};

			return JSON.stringify(weaponState);
		};

		that.top = function(index) {
			return 780 + (index * 322);
		};		

		return that;
	};
});
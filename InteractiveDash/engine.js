define(['ko'], function(ko) {

	return function (engineState) {
		const that = {};

		that.rpm = ko.observable(engineState &&  engineState.rpm  ? engineState.rpm : 0);
		that.wear = ko.observable(engineState &&  engineState.wear  ? engineState.wear : 0);
		that.reliability = ko.observable(engineState &&  engineState.reliability  ? engineState.reliability : 0);
		that.ideal_altitide = ko.observable(engineState &&  engineState.ideal_altitide  ? engineState.ideal_altitide : 0);
		that.overspeed = ko.observable(engineState &&  engineState.overspeed ? engineState.overspeed : 0);
		that.notes = ko.observable(engineState &&  engineState.notes  ? engineState.notes : "");

		that.toJSON = function() {

			const engineState = {
				"rpm": that.rpm(),
				"wear": that.wear(),
				"reliability": that.reliability(),
				"ideal_altitide": that.ideal_altitide(),
				"overspeed": that.overspeed(),
				"notes": that.notes()
			};

			return JSON.stringify(engineState);
		};

		that.top = function(index) {
			return 780 + (index * 322);
		};

		return that;
	};
});
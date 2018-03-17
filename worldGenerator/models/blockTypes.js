module.exports = {
	'1': {
		id: 1,
		name: 'Void',
		bias: {
			etherBias: 1,
			plasmaBias: 0,
			matterBias: 0
		},
		altitudeBase: 0,
		correlations: {
			6: 0.5,
			3: 0.5
		}
	},
	'2': {
		id: 2,
		name: 'Ocean',
		bias: {
			etherBias: 0.2,
			plasmaBias: 0.8,
			matterBias: 0
		},
		altitudeBase: 0,
		correlations: {
			3: -0.3,
			5: -0.2
		}
	},
	'3': {
		id: 3,
		name: 'Wasteland',
		bias: {
			etherBias: 0.2,
			plasmaBias: 0,
			matterBias: 0.8
		},
		altitudeBase: 30,
		correlations: {
			2: -0.5
		}
	},
	'4': {
		id: 4,
		name: 'Plains',
		bias: {
			etherBias: 0.2,
			plasmaBias: 0.1,
			matterBias: 0.7
		},
		altitudeBase: 30
	},
	'5': {
		id: 5,
		name: 'Basic',
		altitudeBase: 50
	},
	'6': {
		id: 6,
		name: 'Mountains',
		bias: {
			etherBias: 0.1,
			plasmaBias: 0.1,
			matterBias: 0.8
		},
		altitudeBase: 80,
		correlations: {
			2: -0.5
		}
	},
	'7': {
		id: 7,
		name: 'Swamp',
		bias: {
			etherBias: 0.2,
			plasmaBias: 0.4,
			matterBias: 0.4
		},
		altitudeBase: 20
	}
};

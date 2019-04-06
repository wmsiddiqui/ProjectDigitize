const biasValidator = require('./biasValidator');

exports.getResources = function(numberOfResources, bias) {
	if (bias) {
		biasValidator.validateBias(bias);
	}

	let generated = {
		etherGenerated: 0,
		plasmaGenerated: 0,
		matterGenerated: 0
	};

	for (i = 0; i < numberOfResources; i++) {
		if (bias) {
			let randomNumber = Math.random();
			if (randomNumber < bias.etherBias) {
				generated.etherGenerated++;
			} else if (randomNumber < bias.etherBias + bias.plasmaBias) {
				generated.plasmaGenerated++;
			} else if (randomNumber < bias.etherBias + bias.plasmaBias + bias.matterBias) {
				generated.matterGenerated++;
			} else {
				throw new Error('ResourceRandomizer failed to produce correct spread');
			}
		} else {
			let randomNumber = Math.floor(Math.random() * 3);
			if (randomNumber == 0) {
				generated.etherGenerated++;
			} else if (randomNumber == 1) {
				generated.plasmaGenerated++;
			} else if (randomNumber == 2) {
				generated.matterGenerated++;
			} else {
				throw new Error('ResourceRandomizer failed to produce correct spread');
			}
		}
	}
	return generated;
};

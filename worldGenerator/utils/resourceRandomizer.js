exports.getResources = function(numberOfResources, bias) {
	if (bias && (bias.etherBias * 10 + bias.plasmaBias * 10 + bias.matterBias * 10) / 10 != 1) {
		throw new Error('Bias not configured correctly in resource randomizer');
	}

	var generated = {
		etherGenerated: 0,
		plasmaGenerated: 0,
		matterGenerated: 0
	};

	for (i = 0; i < numberOfResources; i++) {
		if (bias) {
			var randomNumber = Math.random();
			if (randomNumber <= bias.etherBias) {
				generated.etherGenerated++;
			} else if (randomNumber <= bias.etherBias + bias.plasmaBias) {
				generated.plasmaGenerated++;
			} else if (randomNumber <= bias.etherBias + bias.plasmaBias + bias.matterBias) {
				generated.matterGenerated++;
			} else {
				throw new Error('ResourceRandomizer failed to produce correct spread');
			}
		} else {
			var randomNumber = Math.floor(Math.random() * 3);
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

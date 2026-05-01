const fs = require('fs').promises;
const path = require('path');
const Region = require('./worldGenerator/models/region');
const blockTypesProvider = require('./worldGenerator/utils/blockTypesProvider');
const saveClient = require('./worldGenerator/utils/localSaveClient');

const express = require('express');
const app = express();
app.use(express.json());

let regions = {};

const rehydrateRegions = () => {
	const stored = saveClient.getAllRegions();
	for (const json of stored) {
		regions[json.id] = Region.fromJson(json, saveClient, blockTypesProvider);
	}
	console.log(`Rehydrated ${stored.length} region(s) from disk.`);
};
app.post('/region/:id', async (req, res) => {
	const id = req.params.id;
	const existing = await saveClient.getRegion(id);
	const size = parseInt(req.body && req.body.size) || 3;
	const region = existing
		? Region.fromJson(existing, saveClient, blockTypesProvider)
		: new Region(id, size, saveClient, blockTypesProvider);
	regions[id] = region;
	res.send(`${existing ? 'Loaded' : 'Created'} Region with id: ${id}`);
});

app.post('/region/:id/createBlock', (req, res) => {
	const region = regions[req.params.id];
	if (!region) {
		return res.status(404).send(`Region '${req.params.id}' not found. Create it first with POST /region/${req.params.id}`);
	}

	const block = region.createBlock();
	res.send(`Created new Block with id ${block.getId()}`);
});

app.post('/region/:id/populate', (req, res) => {
	const region = regions[req.params.id];
	if (!region) {
		return res.status(404).send(`Region '${req.params.id}' not found. Create it first with POST /region/${req.params.id}`);
	}

	const blocks = [];
	while (region._remainingCapacity > 0) {
		blocks.push(region.createBlock().getId());
	}

	res.json({ created: blocks.length, blocks });
});

app.get('/region/:id/view', async (req, res) => {
	const regionId = req.params.id;
	const blockTypes = blockTypesProvider.getBlockTypes();

	const blockTypeColors = {
		'1': '#6b21a8', // Void - deep purple
		'2': '#1d4ed8', // Ocean - blue
		'3': '#92400e', // Wasteland - brown
		'4': '#15803d', // Plains - green
		'5': '#6b7280', // Neutral - gray
		'6': '#78716c', // Mountains - stone
		'7': '#166534', // Swamp - dark green
		'8': '#b45309'  // Village - amber
	};

	const blockTypesJson = JSON.stringify(
		Object.fromEntries(
			Object.entries(blockTypes).map(([id, bt]) => [
				id,
				{ name: bt.name, color: blockTypeColors[id] || '#374151' }
			])
		)
	);

	const template = await fs.readFile(path.join(__dirname, 'views/regionView.html'), 'utf8');
	const html = template
		.replace(/\{\{\s*regionId\s*\}\}/g, regionId)
		.replace(/\{\{\s*blockTypesJson\s*\}\}/, blockTypesJson);

	res.setHeader('Content-Type', 'text/html');
	res.send(html);
});

app.get('/region/:regionId/:blockId', (req, res) => {
	res.send(`${req.params.regionId}.${req.params.blockId}`);
});

app.get('/region/:id', async (req, res, next) => {
	const response = await saveClient.getRegion(req.params.id);
	if (!response) {
		return res.status(404).json({ error: `Region '${req.params.id}' not found` });
	}
	res.json(response);
});

saveClient.ready.then(() => {
	rehydrateRegions();
	app.listen(3000, () => {
		console.log('Server running on port 3000');
	});
});

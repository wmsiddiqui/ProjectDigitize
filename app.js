const fs = require('fs').promises;
const path = require('path');
const World = require('./worldGenerator/models/world');
const blockTypesProvider = require('./worldGenerator/utils/blockTypesProvider');
const saveClient = require('./worldGenerator/utils/localSaveClient');

const express = require('express');
const app = express();
app.use(express.json());

let worlds = {};

const blockTypeColors = {
	'1': '#6b21a8',
	'2': '#1d4ed8',
	'3': '#92400e',
	'4': '#15803d',
	'5': '#6b7280',
	'6': '#78716c',
	'7': '#166534',
	'8': '#b45309'
};

const getBlockTypesJson = () => {
	const blockTypes = blockTypesProvider.getBlockTypes();
	return JSON.stringify(
		Object.fromEntries(
			Object.entries(blockTypes).map(([id, bt]) => [
				id,
				{ name: bt.name, color: blockTypeColors[id] || '#374151' }
			])
		)
	);
};

const rehydrateWorlds = async () => {
	const stored = saveClient.getAllWorlds();
	for (const json of stored) {
		worlds[json.id] = await World.fromJson(json, saveClient, blockTypesProvider);
	}
	console.log(`Rehydrated ${stored.length} world(s) from disk.`);
};

const FACE_ADJACENCY = {
	front: { up: 'top', down: 'bottom', left: 'left', right: 'right' },
	back: { up: 'top', down: 'bottom', left: 'right', right: 'left' },
	top: { up: 'back', down: 'front', left: 'left', right: 'right' },
	bottom: { up: 'front', down: 'back', left: 'left', right: 'right' },
	left: { up: 'top', down: 'bottom', left: 'back', right: 'front' },
	right: { up: 'top', down: 'bottom', left: 'front', right: 'back' }
};

const buildFaceNav = (worldId, face) => {
	const adj = FACE_ADJACENCY[face];
	if (!adj) return '<div id="grid-container"></div>';
	const btn = (dir, arrow) =>
		`<a class="nav-btn nav-${dir}" href="/world/${worldId}/region/${adj[dir]}/view">${arrow}<span>${adj[dir]}</span></a>`;
	return `<nav class="face-nav-layout">
		${btn('up', '&#8593;')}
		<div class="nav-middle-row">
			${btn('left', '&#8592;')}
			<div id="grid-container"></div>
			${btn('right', '&#8594;')}
		</div>
		${btn('down', '&#8595;')}
	</nav>`;
};

// ── World endpoints ──────────────────────────────────────────────────────────

app.post('/world/:id', async (req, res) => {
	const id = req.params.id;
	const existingJson = await saveClient.getWorld(id);
	const size = parseInt(req.body && req.body.size) || 5;

	if (existingJson) {
		worlds[id] = await World.fromJson(existingJson, saveClient, blockTypesProvider);
		return res.send(`Loaded World with id: ${id}`);
	}

	const world = new World(id, size, saveClient, blockTypesProvider);
	worlds[id] = world;

	for (const face of World.FACE_NAMES) {
		const region = world.getRegion(face);
		while (region._remainingCapacity > 0) {
			region.createBlock();
		}
	}

	res.send(`Created World with id: ${id}`);
});

app.get('/world/:id/view', async (req, res) => {
	const worldId = req.params.id;
	const template = await fs.readFile(path.join(__dirname, 'views/worldView.html'), 'utf8');
	const html = template
		.replace(/\{\{\s*worldId\s*\}\}/g, worldId)
		.replace(/\{\{\s*blockTypesJson\s*\}\}/, getBlockTypesJson());
	res.setHeader('Content-Type', 'text/html');
	res.send(html);
});

app.post('/world/:id/populate', async (req, res) => {
	const world = worlds[req.params.id];
	if (!world) {
		return res.status(404).send(`World '${req.params.id}' not found. Create it first with POST /world/${req.params.id}`);
	}
	const results = {};
	for (const face of World.FACE_NAMES) {
		const region = world.getRegion(face);
		const blocks = [];
		while (region._remainingCapacity > 0) {
			blocks.push(region.createBlock().getId());
		}
		results[face] = { created: blocks.length };
	}
	res.json(results);
});

app.get('/world/:id/region/:face/view', async (req, res) => {
	const { id, face } = req.params;
	const template = await fs.readFile(path.join(__dirname, 'views/regionView.html'), 'utf8');
	const backAnchor = `<a href="/world/${id}/view" style="color:#9ca3af;font-size:0.8rem;text-decoration:none;display:inline-block;margin-bottom:12px;">&#8592; Back to World</a>`;
	const html = template
		.replace(/\{\{\s*regionLabel\s*\}\}/g, `${id} \u2014 ${face}`)
		.replace(/\{\{\s*regionDataUrl\s*\}\}/g, `/world/${id}/region/${face}`)
		.replace(/\{\{\s*backLink\s*\}\}/, backAnchor)
		.replace(/\{\{\s*faceNav\s*\}\}/, buildFaceNav(id, face))
		.replace(/\{\{\s*blockTypesJson\s*\}\}/, getBlockTypesJson());
	res.setHeader('Content-Type', 'text/html');
	res.send(html);
});

app.get('/world/:id/region/:face', async (req, res) => {
	const { id, face } = req.params;
	const regionJson = await saveClient.getRegion(`${id}.${face}`);
	if (!regionJson) {
		return res.status(404).json({ error: `Face '${face}' not found in world '${id}'` });
	}
	res.json(regionJson);
});

app.post('/world/:id/region/:face/createBlock', (req, res) => {
	const { id, face } = req.params;
	const world = worlds[id];
	if (!world) return res.status(404).send(`World '${id}' not found.`);
	const region = world.getRegion(face);
	if (!region) return res.status(404).send(`Face '${face}' is not valid. Use: ${World.FACE_NAMES.join(', ')}`);
	const block = region.createBlock();
	res.send(`Created new Block with id ${block.getId()}`);
});

app.post('/world/:id/region/:face/populate', (req, res) => {
	const { id, face } = req.params;
	const world = worlds[id];
	if (!world) return res.status(404).send(`World '${id}' not found.`);
	const region = world.getRegion(face);
	if (!region) return res.status(404).send(`Face '${face}' is not valid. Use: ${World.FACE_NAMES.join(', ')}`);
	const blocks = [];
	while (region._remainingCapacity > 0) {
		blocks.push(region.createBlock().getId());
	}
	res.json({ created: blocks.length, blocks });
});

app.get('/world/:id', async (req, res) => {
	const worldJson = await saveClient.getWorld(req.params.id);
	if (!worldJson) {
		return res.status(404).json({ error: `World '${req.params.id}' not found` });
	}
	res.json(worldJson);
});


saveClient.ready.then(async () => {
	await rehydrateWorlds();
	app.listen(3000, () => {
		console.log('Server running on port 3000');
	});
});


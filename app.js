const Region = require('./worldGenerator/models/region');
const blockTypesProvider = require('./worldGenerator/utils/blockTypesProvider');
const redisSaveClient = require('./worldGenerator/utils/redisSaveClient');

const express = require('express');
const app = express();

let regions = {};

app.post('/region/:id', (req, res) => {
	console.log(`Posting new Region with id ${req.params.id}`);

	const region = new Region(req.params.id, 3, redisSaveClient, blockTypesProvider);

	res.send(`Created Region with id: ${region._id}`);
});

app.post('/region/:id/createBlock', (req, res) => {
	console.log('Creating new block');

	res.send(`Created new Block with id ${req.params.id}`);
});

app.get('/region/:regionId/:blockId', (req, res) => {
	res.send(`${req.params.regionId}.${req.params.blockId}`);
});

app.get('/region/:id', async (req, res, next) => {
	console.log('getting region');
	const response = await redisSaveClient.getRegion(req.params.id);
	console.log(response);
	res.json(response);
});

app.listen(3000, () => {
	console.log('Server running on port 3000');
});

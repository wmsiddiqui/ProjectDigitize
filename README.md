# ProjectDigitize

A procedural world generator that creates regions made up of typed blocks, each with their own resources. Designed to run on low-powered hardware such as a Raspberry Pi.

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher

## Setup

```bash
npm install
```

## Running the server

```bash
node app.js
```

The server starts on port 3000. Data is persisted automatically to `data/regions.json`.

## API

### Create a region
```bash
curl -X POST http://localhost:3000/region/<id>
```
Creates a new 3×3 region by default. Pass a `size` in the JSON body to use a different grid size (1–200):
```bash
curl -X POST http://localhost:3000/region/<id> \
  -H "Content-Type: application/json" \
  -d '{"size": 10}'
```
If the region already exists on disk it is loaded into memory rather than recreated.

### Add a single block
```bash
curl -X POST http://localhost:3000/region/<id>/createBlock
```

### Populate all blocks at once
```bash
curl -X POST http://localhost:3000/region/<id>/populate
```
Fills every remaining empty cell in one call. Returns a JSON list of the created block IDs.

### Get region data (JSON)
```bash
curl http://localhost:3000/region/<id>
```

### Visualize a region
Open in your browser:
```
http://localhost:3000/region/<id>/view
```
Displays a colour-coded grid of all blocks with their resource counts (Ether, Plasma, Matter), a legend, and capacity stats.

## Running tests

**Unit tests:**
```bash
npm test
```

**Acceptance tests:**
```bash
npm run acceptance
```

## Project structure

```
app.js                          Entry point, Express server and routes
configs/
  blockTypes.json               Block type definitions (name, bias, cap, correlations, selfAffinity)
worldGenerator/
  models/
    block.js                    Block model
    region.js                   Region model (holds a 2D map of blocks)
  utils/
    biasValidator.js            Validates resource bias configurations
    blockCreator.js             Helper for creating blocks
    blockTypeGenerator.js       Determines block types based on neighbour correlations
    blockTypesProvider.js       Loads and validates block types from config
    localSaveClient.js          File-based persistence (reads/writes data/regions.json)
    neighborHelper.js           Finds neighbours and tracks available grid positions
    numberChecker.js            Number validation utilities
    resourceRandomizer.js       Generates resources according to bias
views/
  regionView.html               HTML template for the region visualizer
tests/
  unit/                         Unit tests (Mocha + Chai + Sinon)
  acceptance/                   Acceptance tests
```

## Design decisions

### Dependency injection
DI is used where dependencies need to be swapped out for testing (e.g. the save client). Modules with no external side effects are imported directly. This keeps tests fast and deterministic without needing a running data store.

### Local file persistence
Data is stored as JSON in `data/regions.json` using Node's built-in `fs` module — no external database required. This keeps the footprint minimal, which is important for running on a Raspberry Pi. If higher write throughput is ever needed, the save client can be swapped out independently thanks to DI.

### Block type configuration (`configs/blockTypes.json`)
Each block type supports the following properties:

| Property | Required | Description |
|---|---|---|
| `name` | Yes | Display name |
| `cap` | Yes | Maximum total resources the block can hold |
| `bias` | No | Resource generation weights (`etherBias`, `plasmaBias`, `matterBias` — must sum to 1) |
| `correlations` | No | Map of other type IDs to probability weights (-1 to 1). Positive values make that neighbour type more likely; negative values make it less likely. All values must sum to between -1 and 1. |
| `selfAffinity` | No | Probability weight (0–1) added toward generating the same type again when this block is a neighbour. Encourages terrain clustering. `selfAffinity + sum of positive correlations` must not exceed 1. |

# ProjectDigitize

A procedural world generator that creates cube-shaped worlds, each with six region faces made up of typed blocks with their own resources. Designed to run on low-powered hardware such as a Raspberry Pi.

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

### Worlds

A world is a cube with six region faces (`top`, `bottom`, `front`, `back`, `left`, `right`), all sharing the same grid size.

#### Create a world
```bash
curl -X POST http://localhost:3000/world/<id>
```
Creates a new world with a default 5×5 region size. Pass a `size` in the JSON body to use a different grid size (1–200):
```bash
curl -X POST http://localhost:3000/world/<id> \
  -H "Content-Type: application/json" \
  -d '{"size": 10}'
```
If the world already exists on disk it is loaded into memory rather than recreated.

#### Populate all faces at once
```bash
curl -X POST http://localhost:3000/world/<id>/populate
```
Fills every empty cell across all 6 faces. Returns a JSON object keyed by face name with the count of blocks created per face.

#### Get world data (JSON)
```bash
curl http://localhost:3000/world/<id>
```

#### Visualize a world
Open in your browser:
```
http://localhost:3000/world/<id>/view
```
Displays a cube-net layout with all 6 faces as mini-grids, each showing block type colours and fill stats. Click any face to open its full region view.

### Regions (faces of a world)

#### View a specific face
```
http://localhost:3000/world/<id>/region/<face>/view
```
Displays a colour-coded grid of all blocks on that face with resource counts (Ether, Plasma, Matter), a legend, and capacity stats. Includes a link back to the world view.

#### Get face data (JSON)
```bash
curl http://localhost:3000/world/<id>/region/<face>
```

#### Add a single block to a face
```bash
curl -X POST http://localhost:3000/world/<id>/region/<face>/createBlock
```

#### Populate a single face
```bash
curl -X POST http://localhost:3000/world/<id>/region/<face>/populate
```
Fills every remaining empty cell on that face. Returns a JSON list of the created block IDs.

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
data/
  regions.json                  Persisted world and region data ({ worlds: {}, regions: {} })
worldGenerator/
  models/
    world.js                    World model (6-faced cube, one Region per face)
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
  worldView.html                HTML template for the world overview (cube-net layout)
  regionView.html               HTML template for the region/face visualizer
tests/
  unit/                         Unit tests (Mocha + Chai + Sinon)
  acceptance/                   Acceptance tests
```

## Design decisions

### Dependency injection
DI is used where dependencies need to be swapped out for testing (e.g. the save client). Modules with no external side effects are imported directly. This keeps tests fast and deterministic without needing a running data store.

### Local file persistence
Data is stored as JSON in `data/regions.json` using Node's built-in `fs` module — no external database required. The file uses the structure `{ worlds: {}, regions: {} }`. This keeps the footprint minimal, which is important for running on a Raspberry Pi. If higher write throughput is ever needed, the save client can be swapped out independently thanks to DI.

### World and region model
A `World` is a six-sided cube. Each face is a `Region` — an N×N grid of typed `Block`s. All six regions within a world share the same grid size, set at creation time. Region IDs are namespaced as `worldId.face` (e.g. `earth.top`) so they remain unique across worlds.

### Block type configuration (`configs/blockTypes.json`)
Each block type supports the following properties:

| Property | Required | Description |
|---|---|---|
| `name` | Yes | Display name |
| `cap` | Yes | Maximum total resources the block can hold |
| `bias` | No | Resource generation weights (`etherBias`, `plasmaBias`, `matterBias` — must sum to 1) |
| `correlations` | No | Map of other type IDs to probability weights (-1 to 1). Positive values make that neighbour type more likely; negative values make it less likely. All values must sum to between -1 and 1. |
| `selfAffinity` | No | Probability weight (0–1) added toward generating the same type again when this block is a neighbour. Encourages terrain clustering. `selfAffinity + sum of positive correlations` must not exceed 1. |

const express = require('express');
const app = express();
const cors = require('cors');
const { fork } = require('child_process');
require('dotenv').config();

const { getOBUdata } = require('./repository/obu');

// OBU data
const obuData = getOBUdata();
const OBU_MAP = {};
let obuProcess = {};
for (const data of obuData) {
	const child_process = fork('obu.js', [data.port, data.id]);
	obuProcess[data.id] = child_process;
	OBU_MAP[data.id] = {
		id: data.id,
		name: data.name,
		speed: undefined,
		heartbeat: 'INACTIVE',
		route: undefined,
	};
}

app.use(cors());
app.use(express.json());

app.get('/obu', (req, res) => {
	res.json(Array.from(Object.values(OBU_MAP)));
});

app.get('/obu/:id', (req, res) => {
	res.json(OBU_MAP.get(req.params.id));
});

app.post('/obu/:id', (req, res) => {
	const id = req.params.id;
	const data = req.body;

	// Update the status
	const heartbeat = data.heartbeat;
	if (heartbeat) {
		obuProcess[id].send({
			type: 'heartbeat',
			value: heartbeat,
		});
		OBU_MAP[id].heartbeat = heartbeat;
	}

	// Update the speed of the OBU
	const speed = data.speed;
	if (speed) {
		obuProcess[id].send({
			type: 'speed',
			value: speed,
		});
		OBU_MAP[id].speed = speed;
	}

	// Update the route of the OBU
	const route = data.route;
	if (route) {
		obuProcess[id].send({
			type: 'route',
			value: route,
		});
		OBU_MAP[id].route = route;
	}

	res.json(OBU_MAP[id]);
});

app.listen(8000, () => {
	console.log('Simulator is running on port 8000');
});
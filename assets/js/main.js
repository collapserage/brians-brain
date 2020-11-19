const COLORS = {
	'purple': {
		old: 'plum',
		young: 'purple',
		background: 'white',
		border: 'lightblue'
	},
	'red': {
		old: 'orange',
		young: 'red',
		background: 'white',
		border: 'lightblue'
	},
	'black': {
		old: 'gray',
		young: 'black',
		background: 'white',
		border: 'lightblue'
	},
	'brown': {
		old: 'tan',
		young: 'brown',
		background: 'white',
		border: 'lightblue'
	},
	'firebrick': {
		old: 'pink',
		young: 'firebrick',
		background: 'white',
		border: 'lightblue'
	},
	'darkgreen': {
		old: 'lightgreen',
		young: 'darkgreen',
		background: 'white',
		border: 'lightblue'
	},
	'darkblue': {
		old: 'lightskyblue',
		young: 'darkblue',
		background: 'white',
		border: 'lightblue'
	}
}

var sizeX = 250,
	sizeY = 250,
	cellSize = 3,
	line = 1,

	log = document.querySelector('#log-block'),
	canvas = document.querySelector('canvas'),
	ctx = canvas.getContext('2d'),
	newcanvas = document.createElement('canvas'),
	newctx = newcanvas.getContext('2d'),
	clearcanvas = document.createElement('canvas'),
	clearctx = clearcanvas.getContext('2d'),

	color = COLORS['purple'],
	colorsindex = [color.background, color.old, color.young, color.border],
	stateMap = [],
	tempMap = [],
	interval = 250,
	started = false,
	canPaint, paintMode, generation, oldY, fps, repaints, fpsTotal, middleRow, twoRows, youngCells, oldCells, posX, posY, count, loop, date, printLoop, i, j, k, l, sx, sy;

function startStop() {
	if(!started) {
		loop = requestAnimationFrame(brain);
		printLoop = window.setInterval(function() {print()}, 250);
	} else {
		cancelAnimationFrame(loop);
		window.clearInterval(printLoop);
	}
	started = !started;
}

function preInit() {
	if (localStorage.getItem('sizeX')) {
		sizeX = parseInt(localStorage.getItem('sizeX'));
		document.querySelector('#sizeX').value = sizeX;
	}
	if (localStorage.getItem('sizeY')) {
		sizeY = parseInt(localStorage.getItem('sizeY'));
		document.querySelector('#sizeY').value = sizeY;
	}
	if (localStorage.getItem('cellSize')) {
		cellSize = parseInt(localStorage.getItem('cellSize'));
		document.querySelector('#cellSize').value = cellSize;
	}
	if (localStorage.getItem('line')) line = parseInt(localStorage.getItem('line'));
	if (localStorage.getItem('color')) changeColor(localStorage.getItem('color'));
	if (localStorage.getItem('slide')) {
		document.querySelector('#settings').classList.add('hidden');
		document.querySelector('#slide').textContent = 'settings ^';
	}

}

function init() {
	canvas.width  = cellSize * sizeX + line;
	canvas.height = cellSize * sizeY + line;
	newcanvas.width  = canvas.width;
	newcanvas.height = canvas.height;
	clearcanvas.width  = canvas.width;
	clearcanvas.height = canvas.height;

	ctx.fillStyle = color.border;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	generation = 0;
	oldY = 0;
	fps = 0;
	repaints = 0;
	fpsTotal = 0;
	youngCells = 0;
	oldCells = 0;
	createClearField();
}

function createClearField() {
	clearctx.fillStyle = colorsindex[0];
	for (i = 0; i < sizeX; i++) {
		for (j = 0; j < sizeY; j++) {
			clearctx.fillRect(line + i * cellSize, line + j * cellSize, cellSize - line, cellSize - line);
		}
	}
}

function setSize() {
	sx = parseInt(document.getElementById('sizeX').value);
	if (sx > 1 ) sizeX = sx;
	sy = parseInt(document.getElementById('sizeY').value);
	if (sy > 1) sizeY = sy;

	stateMap.length = sizeX;
	for (i = 0; i < sizeX; i++) {
		!stateMap[i] ? stateMap[i] = new Array(sizeY) : stateMap[i].length = sizeY;
		for (j = 0; j < sizeY; j++)
			if (!stateMap[i][j]) stateMap[i][j] = 0;
	}

	localStorage.setItem('sizeX', sizeX);
	localStorage.setItem('sizeY', sizeY);
	init();
	draw(true);
}

function setCellSize() {
	cellSize = document.getElementById('cellSize').value;
	localStorage.setItem('cellSize', cellSize);
	init();
	draw(true);
}

function switchBorders() {
	if(line)
		line--;
	else
		line++;

	localStorage.setItem('line', line);
	init();
	draw(true);
}

function populate(blank) {
	for (i = 0; i < sizeX; i++) {
		stateMap[i] = new Array(sizeY);
		for (j = 0; j < sizeY; j++) {
			stateMap[i][j] = blank ? 0 : Math.floor(Math.random() * 3);
			newctx.fillStyle = colorsindex[stateMap[i][j]];
			newctx.fillRect(line + i * cellSize, line + j * cellSize, cellSize - line, cellSize - line);
		}
	}

	ctx.drawImage(newcanvas, 0, 0);
}

function draw(repaint) {
	newctx.drawImage(clearcanvas, 0, 0);
		for (i = 0; i < sizeX; i++) {
			for (j = 0; j < sizeY; j++) {
				if (repaint === true || stateMap[i][j]) {
					newctx.fillStyle = colorsindex[stateMap[i][j]];
					newctx.fillRect(line + i * cellSize, line + j * cellSize, cellSize - line, cellSize - line);
					repaints++;
				}
			}
		}

	ctx.drawImage(newcanvas, 0, 0);
}

function checkNeighbour(posX, posY, row) {
	if (posX < 0) posX = sizeX - 1;
		else if (posX >= sizeX) posX = 0;
	if (posY < 0) posY = sizeY - 1;
		else if (posY >= sizeY) posY = 0;
	if (tempMap[posX][posY] == 2) {
		count++;
		if (row > -1)
			twoRows++;
		if (row == 0)
			middleRow++;
	}
}

function countNeighbours(x, y) {
	if (y == 0 || oldY != y - 1) { // oldY is used to fix "jumps" over alive cells, when optimized algorithm fails
		count = 0;
		twoRows = 0;
		middleRow = 0;
		for (k = -1; k < 2; k++) {
			for (l = -1; l < 2; l++) {
				checkNeighbour(x + k, y + l, l)
			}
		}
	} else {
		count = twoRows;
		twoRows -= middleRow;
		middleRow = twoRows;
		for (l = -1; l < 2; l++)
			checkNeighbour(x + l, y + 1, 1)
	}
	oldY = y;
	return count;
}

function brain() {
	brainStep();
	loop = requestAnimationFrame(brain);
}

function brainStep() {
	date = performance.now();
	youngCells = 0;
	oldCells = 0;
	repaints = 0;

	i = sizeX;
	while (i--)
		tempMap[i] = stateMap[i].slice(0); // performance!

	for (i = 0; i < sizeX; i++) {
		for (j = 0; j < sizeY; j++) {
			if (stateMap[i][j] == 0 && countNeighbours(i, j) == 2) { // key rule of the game
				stateMap[i][j] = 2;
				youngCells++;
			} else if (stateMap[i][j] == 2) {
				stateMap[i][j] = 1;
				oldCells++;
			} else stateMap[i][j] = 0;
		}
	}

	draw();
	generation++;
	fps = Math.round(1000/(performance.now() - date));
	fpsTotal += fps;
}


function print() {
	log.innerHTML = 'Field: ' + sizeX + 'x' + sizeY + ', cell: ' + cellSize + '<br>' +
					'Generation: ' + generation + '<br>' +
					'Old cells: ' + oldCells + '<br>' +
					'Young cells: ' + youngCells + '<br>' +
					'Repaints: ' + repaints + '<br>' +
					'FPS: ' + Math.round(fps) + '<br>' +
					'Average FPS: ' + Math.round(fpsTotal/generation);
}

function paintCell(xPos, yPos) {
	if (canPaint && paintMode) {
		x = Math.floor(xPos/cellSize);
		y = Math.floor(yPos/cellSize);
		if ((x < 0) || (y < 0) || (xPos > cellSize * sizeX - line) || (yPos > cellSize * sizeY - line))
			return;

		stateMap[x][y] = paintMode;
		ctx.fillStyle = colorsindex[paintMode];
		ctx.fillRect(line + x * cellSize, line + y * cellSize, cellSize - line, cellSize - line);
	}
}

function changeColor(newColor) {
	color = COLORS[newColor];
	colorsindex = [color.background, color.old, color.young, color.border];
	document.querySelector('.active').classList.remove('active');
	document.querySelector('.' + color.young).classList.add('active');

	Array.prototype.forEach.call(document.querySelectorAll('button'), function(el) { el.style.backgroundColor = color.young })
	Array.prototype.forEach.call(document.querySelectorAll('aside section>header'), function(el) { el.style.backgroundColor = color.young })
	Array.prototype.forEach.call(document.querySelectorAll('aside section>div'), function(el) { el.style.backgroundColor = color.old })
}

document.querySelector('canvas').addEventListener('mousedown', function(e) {
	canPaint = true;
	paintCell(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
})
document.querySelector('canvas').addEventListener('mousemove', function(e) {
	paintCell(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
})
document.querySelector('body').addEventListener('mouseup', function(e) {
	canPaint = false
})

document.querySelector('#sizeX').addEventListener('keyup', function(e) {if (e.keyCode == 13) setSize()});
document.querySelector('#sizeY').addEventListener('keyup', function(e) {if (e.keyCode == 13) setSize()});
document.querySelector('#cellSize').addEventListener('keyup', function(e) {if (e.keyCode == 13) setCellSize()});

document.querySelector('#colors').addEventListener('click', function(event) {
	if (event.target.parentNode.id == 'colors') {
		changeColor(event.target.classList[0]);
		localStorage.setItem('color', event.target.classList[0]);
		draw(true);
	}
});

document.querySelector('#paint').addEventListener('click', function(event) {
	if (event.target.parentNode.id == 'paint') {
		try {
			document.querySelector('.pressed').classList.remove('pressed');
		} catch(e) {}

		if (!event.target.classList.contains('pressed')) {
			event.target.classList.add('pressed');
			paintMode = event.target.getAttribute('data-state');
		} else {
			event.target.classList.remove('pressed');
			paintMode = undefined;
		}
	}
});

document.querySelector('#slide').addEventListener('click', function(event) {
	document.querySelector('#settings').classList.toggle('hidden');
	if (document.querySelector('#settings').classList.contains('hidden')) {
		this.textContent = 'settings ↑';
		localStorage.setItem('slide', true);
	} else {
		this.textContent = 'settings ↓';
		localStorage.removeItem('slide');
	}
});

preInit();
init();
populate(true);
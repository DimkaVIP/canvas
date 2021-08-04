const WIDTH = 600;
const HEIGHT = 200;
const DPI_WIDTH = WIDTH * 2;
const DPI_HEIGHT = HEIGHT * 2;
const ROWS_COUNT = 5;
const PADDING = 40;
const VIIEW_HEIGHT = DPI_HEIGHT - PADDING * 2;
const VIIEW_WIDTH = DPI_WIDTH;

function canvas(canvas, data = []) {
	const ctx = canvas.getContext('2d');

	canvas.style.width = WIDTH + 'px';
	canvas.style.height = HEIGHT + 'px';

	canvas.width = DPI_WIDTH;
	canvas.height = DPI_HEIGHT;

	const [yMin, yMax] = cumputedBoundaries(data);
	const yRatio = VIIEW_HEIGHT / (yMax - yMin);
	const xRatio = VIIEW_WIDTH / (data.columns[0].length - 2);

	const step = VIIEW_HEIGHT / ROWS_COUNT;
	const textStep = (yMax - yMin) / ROWS_COUNT

	ctx.beginPath();
	ctx.font = '25px normal sans-serif';
	ctx.fillStyle = 'teal';
	ctx.strokeStyle = '#bbb';
	for (let i = 1; i <= ROWS_COUNT; i++) {
		const y = step * i;
		const text = Math.round(yMax - textStep * i);
		ctx.fillText(text.toString(), 0, y + PADDING);
		ctx.moveTo(0, y + PADDING);
		ctx.lineTo(DPI_WIDTH, y + PADDING);
	}
	ctx.stroke();
	ctx.closePath();

	data.columns.forEach(col => {
		const name = col[0];
		if (data.types[name] === 'line') {
			const coords = col.map((y, i) => {
				return [
					Math.floor((i - 1) * xRatio),
					Math.floor(DPI_HEIGHT - PADDING - y * yRatio)
				]
			}).filter((_, i) => i !== 0);
			const color = data.colors[name]
			line(ctx, coords, { color });
		}
	});
}

function line(ctx, coords, { color }) {
	ctx.beginPath();
	ctx.lineWidth = 4;
	ctx.strokeStyle = color;
	for (const [x, y] of coords) {
		// ctx.lineTo(x, DPI_HEIGHT - PADDING - y * yRatio);
		ctx.lineTo(x, y);
	}
	ctx.stroke();
	ctx.closePath();
}

canvas(document.querySelector('canvas'), getChartData());

function cumputedBoundaries({ columns, types }) {
	let min, max;
	columns.forEach(col => {
		if (types[col[0]] !== 'line') {
			return;
		}
		if (typeof min !== 'number') min = col[1];
		if (typeof max !== 'number') max = col[1];
		if (min > col[1]) min = col[1];
		if (max < col[1]) max = col[1];
		for (let i = 2; i < col.length; i++) {
			if (min > col[i]) min = col[i];
			if (max < col[i]) max = col[i];
		}
	});

	return [min, max];
}
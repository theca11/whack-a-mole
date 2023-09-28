let globalSettings = {};

window.onload = () => {
	const formEl = document.querySelector('form');
	const customMinEl = document.querySelector('input[name="customMin"]');
	const customMaxEl = document.querySelector('input[name="customMax"]');

	// Load global settings to form
	globalSettings = window.opener.getGlobalSettings();
	customMinEl.value = globalSettings.customMin;
	customMaxEl.value = globalSettings.customMax;

	// Send settigs to property inspector on form edit
	formEl.addEventListener(
		'input',
		Utils.debounce(500, () => {
			window.opener.sendCustomSettingsToInspector({
				customMin: Number(customMinEl.value),
				customMax: Number(customMaxEl.value),
			});
		}),
	);

	// Generate top scores table
	drawTopScores();
};

// Reset top scores listener
document.querySelector('#reset').addEventListener('click', () => {
	const blankTopScores = levels.map(() => Array(times.length).fill(0));
	window.opener.sendCustomSettingsToInspector({ topScores: blankTopScores });
	globalSettings.topScores = blankTopScores;
	drawTopScores();
});

// Draw top scores table
function drawTopScores() {
	const topScores = globalSettings.topScores ?? levels.map(() => Array(times.length).fill(0));
	document.querySelector('#top').innerHTML = createTable(topScores, times, levels);
}

// -- Aux variables/functions to generate top scores table
const times = [5, 10, 20, 30, 'endless'].map((t) => (isNaN(t) ? t : t + 's'));
const levels = ['easy', 'normal', 'hard', 'custom'];

function createTable(data, rowHeadings, columnHeadings) {
	let [...rows] = data;
	if (columnHeadings) {
		rowHeadings = ['', ...rowHeadings];
		rows = rows.map((row, i) => [columnHeadings[i], ...row]);
	}

	return `
	  <table>
		<thead>${getCells(rowHeadings, 'th')}</thead>
		<tbody>${createBody(rows)}</tbody>
	  </table>
	`;
}

function getCells(data, type) {
	return data.map((cell) => `<${type}>${cell}</${type}>`).join('');
}

function createBody(data) {
	return data.map((row) => `<tr>${getCells(row, 'td')}</tr>`).join('');
}
// --

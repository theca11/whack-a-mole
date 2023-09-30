import { DidReceiveGlobalSettingsData, KeyDownData, WillAppearData } from './types';
import { SDAction } from './SDAction';

// -- Actions and contexts caches
const startAction = new SDAction('dev.theca11.whack-a-mole.start');
const scoreAction = new SDAction('dev.theca11.whack-a-mole.score');
const timerAction = new SDAction('dev.theca11.whack-a-mole.timer');
const tileAction = new SDAction('dev.theca11.whack-a-mole.tile');
const startContexts = new Set<string>();
const scoreContexts = new Set<string>();
const timerContexts = new Set<string>();
const tilesContexts = new Set<string>();

// -- Game options config
const times: (number | 'endless')[] = [5, 10, 20, 30, 'endless'];
const levels = ['easy', 'normal', 'hard', 'custom'];
const levelsConfig: Record<string, { min: number, max: number }> = {
	easy: { min: 1000, max: 1500 },
	normal: { min: 650, max: 950 },
	hard: { min: 450, max: 800 },
	custom: { min: 650, max: 950 },
};

// --  Default settings, later updated with saved global settings
type Settings = { level: number, time: number, customMin: number, customMax: number, topScores: number[][]}
let settings: Settings = {
	level: 1,
	time: 1,
	customMin: 500,
	customMax: 1000,
	topScores: levels.map(() => Array(times.length).fill(0)),
};

// -- Main game variables
let countdownInterval: NodeJS.Timeout | undefined; // main game interval
let ready = true;		// ready to start
let inProgress = false;	// game in progress
let score = 0;			// current score
let remainingTime = 0;	// current remaining time
let lastTile: string;	// last tile context with a mole
let showTop = false;	// whether to show last or top score


// -- SD connection and global settings
$SD.onConnected(() => {
	console.log('Stream Deck connected');
	$SD.getGlobalSettings();
});

$SD.onDidReceiveGlobalSettings(({ payload }: DidReceiveGlobalSettingsData<Partial<Settings>>) => {
	settings = { ...settings, ...payload.settings };
	levelsConfig.custom = { ...levelsConfig.custom, min: settings.customMin, max: settings.customMax };
	timerContexts.forEach(ctx => setTimerTitle(ctx));
	scoreContexts.forEach(ctx => setScoreTitle(ctx));
});
// --

// -- Actions listeners
// --- Start
startAction.onWillAppear((evtData: WillAppearData<unknown>) => {
	startContexts.add(evtData.context);
	setStartTitle(evtData.context);
	$SD.setState(evtData.context, !inProgress ? 0 : 1);
});

startAction.onWillDisappear((evtData: WillAppearData<unknown>) => {
	startContexts.delete(evtData.context);
});

startAction.onSinglePress(() => {
	if (ready && !inProgress && tilesContexts.size > 0) startGame();
});

startAction.onLongPress(() => {
	if (inProgress) {
		remainingTime = 0;
		endGame();
	}
});
// ---

// --- Score
scoreAction.onWillAppear((evtData: WillAppearData<unknown>) => {
	scoreContexts.add(evtData.context);
	setScoreTitle(evtData.context);
	$SD.setState(evtData.context, !inProgress ? 0 : 1);
});

scoreAction.onWillDisappear((evtData: WillAppearData<unknown>) => {
	scoreContexts.delete(evtData.context);
});

scoreAction.onSinglePress(() => {
	if (!inProgress) {
		showTop = !showTop;
		scoreContexts.forEach(ctx => setScoreTitle(ctx));
	}
});
// ---

// --- Timer
timerAction.onWillAppear((evtData: WillAppearData<unknown>) => {
	timerContexts.add(evtData.context);
	setTimerTitle(evtData.context);
	$SD.setState(evtData.context, !inProgress ? 0 : 1);
});

timerAction.onWillDisappear((evtData: WillAppearData<unknown>) => {
	timerContexts.delete(evtData.context);
});

timerAction.onSinglePress(() => {
	if (ready && !inProgress) {
		const nextIdx = (settings.time + 1) % times.length;
		settings.time = nextIdx;
		$SD.setGlobalSettings(settings);
		timerContexts.forEach(ctx => setTimerTitle(ctx));
		if (showTop) {
			scoreContexts.forEach(ctx => setScoreTitle(ctx));
		}
	}
});

timerAction.onLongPress(() => {
	if (ready && !inProgress) {
		const nextIdx = (settings.level + 1) % levels.length;
		settings.level = nextIdx;
		$SD.setGlobalSettings(settings);
		timerContexts.forEach(ctx => setTimerTitle(ctx));
		if (showTop) {
			scoreContexts.forEach(ctx => setScoreTitle(ctx));
		}
	}
});
// ---

// --- Tile
tileAction.onWillAppear((evtData: WillAppearData<unknown>) => {
	tilesContexts.add(evtData.context);
	$SD.setState(evtData.context, 0);
});

tileAction.onWillDisappear((evtData: WillAppearData<unknown>) => {
	tilesContexts.delete(evtData.context);
	if (inProgress && tilesContexts.size === 0) endGame();
});

tileAction.onSinglePress((evtData: KeyDownData<unknown>) => {
	const { state } = evtData.payload;
	if (state) {
		$SD.setState(evtData.context, 0);
		score += getMoleMultiplier(state);
		scoreContexts.forEach(ctx => setScoreTitle(ctx));
		if (times[settings.time] === 'endless') {
			remainingTime += getMoleMultiplier(state);
			timerContexts.forEach(ctx => setTimerTitle(ctx));
		}
	}
});
// ---
// --

// -- Whack-a-mole methods
function getMoleKind() {
	const rnd = Math.floor(Math.random() * 10);
	return (rnd === 2 || rnd === 3) ? rnd : 1;
}

function getMoleMultiplier(moleKind: number) {
	return (moleKind === 1 || moleKind === 2) ? moleKind : -1;
}

function getRandomNumber(min: number, max: number) {
	return Math.round(Math.random() * (max - min) + min);
}

function getRandomTile() {
	const idx = Math.floor(Math.random() * tilesContexts.size);
	const tile = [...tilesContexts][idx];
	if (tile === lastTile && tilesContexts.size > 1) {
		return getRandomTile();
	}
	lastTile = tile;
	return tile;
}

function peep() {
	const lengthSettings = levelsConfig[levels[settings.level]];
	const peepLength = getRandomNumber(lengthSettings.min, lengthSettings.max);
	const tile = getRandomTile();
	$SD.setState(tile, getMoleKind());
	setTimeout(() => {
		$SD.setState(tile, 0);
		if (inProgress) peep();
	}, peepLength);
}

function startGame() {
	ready = false;
	inProgress = true;
	startContexts.forEach(ctx => $SD.setState(ctx, 1));
	timerContexts.forEach(ctx => $SD.setState(ctx, 1));
	scoreContexts.forEach(ctx => $SD.setState(ctx, 1));
	startContexts.forEach(ctx => setStartTitle(ctx));
	score = 0;
	showTop = false;
	scoreContexts.forEach(ctx => setScoreTitle(ctx));
	remainingTime = times[settings.time] === 'endless' ? 10 : times[settings.time] as number;
	timerContexts.forEach(ctx => setTimerTitle(ctx));
	countdownInterval = setInterval(() => {
		remainingTime -= 1;
		if (remainingTime === 0) {
			endGame();
		}
		timerContexts.forEach(ctx => setTimerTitle(ctx));
	}, 1000);
	peep();
}

function endGame() {
	inProgress = false;
	clearInterval(countdownInterval);
	$SD.setState(lastTile, 0);
	startContexts.forEach(ctx => $SD.setState(ctx, 0));
	timerContexts.forEach(ctx => $SD.setState(ctx, 0));
	scoreContexts.forEach(ctx => $SD.setState(ctx, 0));
	startContexts.forEach(ctx => setStartTitle(ctx));
	const currentTopScore = settings.topScores[settings.level][settings.time];
	if (score > currentTopScore) {
		settings.topScores[settings.level][settings.time] = score;
		$SD.setGlobalSettings(settings);
	}
	setTimeout(() => {
		ready = true;
		startContexts.forEach(ctx => setStartTitle(ctx));
		timerContexts.forEach(ctx => setTimerTitle(ctx));
	}, 2500);
}

function setStartTitle(context: string) {
	if (!inProgress) {
		if (ready) {
			$SD.setTitle(context, 'START');
		}
		else {
			$SD.setTitle(context, 'GAME\nOVER');
		}
	}
	else {
		$SD.setTitle(context, 'WHACK!');
	}
}

function setScoreTitle(context: string) {
	if (!showTop) {
		$SD.setTitle(context, `SCORE\n\n${score}`);
	}
	else {
		$SD.setTitle(context, `TOP\nSCORE\n\n${settings.topScores[settings.level][settings.time]}`);
	}
}

function setTimerTitle(context: string) {
	const time = (inProgress || !ready) ? remainingTime : times[settings.time];
	if (time === 'endless') {
		$SD.setTitle(context, `${levels[settings.level].toLocaleUpperCase()}\n\nEndless`);
	}
	else {
		$SD.setTitle(context, `${levels[settings.level].toLocaleUpperCase()}\n\n${formatTime(time as number)}`);
	}
}

function formatTime(seconds: number) {
	const minutes = Math.floor(seconds / 60).toLocaleString(undefined, { minimumIntegerDigits: 2 });
	const secs = (seconds % 60).toLocaleString(undefined, { minimumIntegerDigits: 2 });
	return `${minutes}:${secs}`;
}
// --
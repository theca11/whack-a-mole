// / <reference path="../libs/js/property-inspector.js" />
let globalSettings = {};

// PI start
$PI.onConnected(() => {
	$PI.getGlobalSettings();
});

// Global settings update
$PI.onDidReceiveGlobalSettings(({ payload }) => {
	globalSettings = payload.settings;
});

// Open external configuration window
document.querySelector('#open-external').addEventListener('click', () => {
	window.open('./external.html');
});

// -- Window level functions to use in the external configuration window
window.getGlobalSettings = () => {
	return globalSettings;
};

window.sendCustomSettingsToInspector = (settings) => {
	globalSettings = { ...globalSettings, ...settings };
	$PI.setGlobalSettings(globalSettings);
};
// --

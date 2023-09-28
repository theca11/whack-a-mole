// --- StreamDeck lib types for events ---
type Common = {
	action: string,
	event: string,
	context: string,
	device: string,
}
type Payload<T> = {
	payload: {
		coordinates: { column: number, row: number },
		isInMultiAction: boolean,
		state?: number,
		settings: T
	}
}
type TriggerPayload<T> = Payload<T> & { payload: { userDesiredState?: number } }
type BaseEventData<T> = Common & Payload<T>
type TriggerEventData<T> = Common & TriggerPayload<T>

export type DidReceiveSettingsData<T> = BaseEventData<T>;
export type DidReceiveGlobalSettingsData<T> = {
	event: string,
	payload: { settings: T }
}
export type KeyDownData<T> = TriggerEventData<T>;
export type KeyUpData<T> = TriggerEventData<T>;
export type WillAppearData<T> = BaseEventData<T>;
export type WillDisappearData<T> = BaseEventData<T>;
export type SendToPluginData<T> = {
	action: string,
	event: string,
	context: string,
	payload: T
}
export type SendToPIData<T> = {
	action: string,
	event: string,
	context: string,
	payload: T
}
// ---
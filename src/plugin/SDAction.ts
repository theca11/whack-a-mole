import { KeyDownData, KeyUpData } from './types';

export class SDAction extends Action {
	_pressCache = new Map<string, NodeJS.Timeout>(); // <context, timeoutRef>

	constructor(UUID: string) {
		super(UUID);

		this.onKeyDown((evtData: KeyDownData<unknown>) => {
			const { context } = evtData;

			if (this._pressCache.has(context)) return;

			const timeout = setTimeout(() => {
				this._pressCache.delete(context);
				this.emit(`${this.UUID}.longPress`, evtData);
			}, 300);
			this._pressCache.set(context, timeout);
		});

		this.onKeyUp((evtData: KeyUpData<unknown>) => {
			const { context } = evtData;
			if (!this._pressCache.has(context)) {
				return;
			}
			else {
				clearTimeout(this._pressCache.get(context));
				this._pressCache.delete(context);
				this.emit(`${this.UUID}.singlePress`, evtData);
			}
		});
		// --
	}

	onSinglePress = (callback: (evtData: KeyUpData<unknown>) => void) => this.on(`${this.UUID}.singlePress`, callback);
	onLongPress = (callback: (evtData: KeyDownData<unknown>) => void) => this.on(`${this.UUID}.longPress`, callback);
}
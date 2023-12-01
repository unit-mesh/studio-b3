import { Advice } from "@/components/editor/advice/advice";

type EventHandler = (data: any) => void;

export class AdviceManager {
	private static instance: AdviceManager;

	static getInstance(): AdviceManager {
		if (!AdviceManager.instance) {
			AdviceManager.instance = new AdviceManager();
		}
		return AdviceManager.instance;
	}

	private constructor() {}

	private advices: Record<string, Advice> = {};

	// pub sub
	private handlers: Record<string, EventHandler[]> = {};

	on(event: string, handler: EventHandler) {
		if (!this.handlers[event]) {
			this.handlers[event] = [];
		}
		this.handlers[event].push(handler);
	}

	emit(event: string, data: any) {
		if (this.handlers[event]) {
			this.handlers[event].forEach((handler) => handler(data));
		}
	}

	addAdvice(advice: Advice) {
		this.advices[advice.id] = advice;
		this.emit('add', advice);
	}

	getAdvice(id: string) {
		return this.advices[id];
	}

	updateAdvice(id: string, data: Advice) {
		this.advices[id] = {
			...this.advices[id],
			...data,
		};
	}

	updateAdvices(data: Advice[]) {
		Object.keys(data).forEach((id) => {
			// @ts-ignore
			this.updateAdvice(id, data[id]);
		});
	}

	getAdvices(): Advice[] {
		return Object.values(this.advices);
	}
}
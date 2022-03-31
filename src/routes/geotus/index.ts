import type { RequestHandler } from '@sveltejs/kit';
import * as Api from './_api';
import { createPlayingMachine, type Context } from './_stateMachine';

export const get: RequestHandler = async ({ url }) => {
	const context = createPlayingMachine().context;

	return {
		status: 200,
		body: { svg: await Api.getSVG(url.origin, context.country.code), context }
	};
};

export type PostOutput = {
	context: Context;
	correct: boolean;
	svg: string;
};

const assertIsNotFile = (value: string | null | File): string | null => {
	if (typeof value === 'string') {
		return value;
	}
	if (value === null) {
		return null;
	}
	throw new Error('Unexpected File');
};

const parseFormData = async (request: Request) => {
	const form = await request.formData();

	return {
		context: assertIsNotFile(form.get('context')),
		skip: assertIsNotFile(form.get('skip')),
		answer: assertIsNotFile(form.get('answer'))
	};
};

export const post: RequestHandler = async ({ request, url }) => {
	const { context, skip, answer } = await parseFormData(request);

	if (context === null) {
		throw new Error('No game');
	}

	const state = createPlayingMachine().withContext(JSON.parse(context));

	if (skip !== null) {
		const newState = state.transition('playing', {
			type: 'SKIP',
			answer: Api.getAnswer(state.context.country.code)
		});
		return {
			status: 200,
			body: {
				context: newState.context,
				correct: false,
				svg: await Api.getSVG(url.origin, newState.context.country.code)
			}
		};
	}

	const isCorrect = Api.checkAnswer(answer, state.context.country.code);

	if (isCorrect) {
		const newState = state.transition('playing', {
			type: 'CORRECT',
			answer: Api.getAnswer(state.context.country.code)
		});

		return {
			status: 200,
			body: {
				context: newState.context,
				correct: true,
				svg: await Api.getSVG(url.origin, newState.context.country.code)
			}
		};
	}

	const newState = state.transition('playing', { type: 'FAIL' });

	return {
		status: 200,
		body: {
			context: newState.context,
			correct: false,
			...Api.getDistanceAndDirection(answer, state.context.country.code)
		}
	};
};

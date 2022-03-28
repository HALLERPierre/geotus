import type { RequestHandler } from '@sveltejs/kit';
import * as Api from './_api';
import { createPlayingMachine } from './_stateMachine';

export const get: RequestHandler = async () => {
	console.log(createPlayingMachine().context);
	return {
		status: 200,
		body: { context: createPlayingMachine().context }
	};
};

export const post: RequestHandler = async ({ request }) => {
	const form = await request.formData();
	const context = form.get('context') as string;

	if (context === undefined) {
		throw new Error('No game');
	}

	const state = createPlayingMachine().withContext(JSON.parse(context));

	// const skip = form.get('skip');

	// if (skip !== undefined) {
	// 	const newState = state.transition('playing', { type: 'SKIP' });
	// 	return {
	// 		status: 200,
	// 		body: {
	// 			context: newState.context,
	// 			correct: true
	// 		}
	// 	};
	// }

	const answer = form.get('answer') as string;
	const isCorrect = Api.checkAnswer(answer, state.context.country.code);

	if (isCorrect) {
		const newState = state.transition('playing', { type: 'CORRECT', answer });

		return {
			status: 200,
			body: {
				context: newState.context,
				correct: true
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

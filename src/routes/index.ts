import type { RequestHandler } from '@sveltejs/kit';
import * as Api from './_api';

export const get: RequestHandler = async () => {
	const { svg, code } = await Api.getRandomCountry();

	return { status: 200, body: { svg, code } };
};

export const post: RequestHandler = async ({ request }) => {
	const form = await request.formData();

	const answerCode = form.get('answer') as string;
	const codeCiphered = form.get('code') as string;

	const isCorrect = Api.checkAnswer(answerCode, codeCiphered);

	if (isCorrect) {
		return {
			status: 200,
			body: {
				correct: true
			}
		};
	}

	return {
		status: 200,
		body: {
			correct: false,
			...Api.getDistanceAndDirection(answerCode, codeCiphered)
		}
	};
};

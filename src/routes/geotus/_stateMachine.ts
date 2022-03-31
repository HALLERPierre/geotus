import { createMachine, assign } from 'xstate';
import { getRandomCountry } from './_api';

export type Context = {
	score: number;
	tries: number;
	country: { code: string };
	correct: number;
	previous: Array<{ countryName: string; guesses: number; skip?: boolean }>;
};

export const createPlayingMachine = () =>
	createMachine<Context>({
		id: 'fetch',
		context: {
			score: 0,
			tries: 0,
			country: getRandomCountry(),
			correct: 0,
			previous: []
		},
		initial: 'playing',

		states: {
			playing: {
				on: {
					CORRECT: {
						target: 'playing',
						actions: [
							assign({
								previous: (context, event) => {
									return [
										...context.previous,
										{ countryName: event.answer, guesses: context.tries + 1 }
									];
								}
							}),
							assign({
								score: (context) => {
									return context.score + 100;
								}
							}),
							assign({
								country: (_context) => getRandomCountry()
							}),
							assign({ correct: (context) => context.correct + 1 })
						]
					},
					FAIL: {
						target: 'playing',
						actions: assign({
							tries: (context) => context.tries + 1,
							score: (context) => {
								return context.score - 10;
							}
						})
					},
					SKIP: {
						target: 'playing',
						actions: assign({
							tries: (_context) => 0,
							previous: (context, event) => {
								return [
									...context.previous,
									{ countryName: event.answer, guesses: context.tries, skip: true }
								];
							},
							country: (_context) => getRandomCountry(),
							score: (context) => context.score - 30
						})
					}
				}
			}
		}
	});

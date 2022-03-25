import { countries } from '../data/countries/names';
import * as fs from 'fs';
import path from 'path';
import Crypto from 'crypto-js';
import { fileURLToPath } from 'url';
import { countriesCoords } from '../data/countries/coords';
import * as geolib from 'geolib';

function dirname() {
	return path.dirname(fileURLToPath(import.meta.url));
}

export function getRandomCountry() {
	const country = countries[Math.floor(Math.random() * countries.length)];
	// const country = countries.find((country) => country.code === 'ES');
	const svg = fs
		.readFileSync(
			path.resolve(`${dirname()}/../data/countries/images/${country.code.toLowerCase()}/vector.svg`)
		)
		.toString();
	const countryCiphered = Crypto.AES.encrypt(country.code.toUpperCase(), 'very secret').toString();
	return { svg, code: countryCiphered };
}

export function checkAnswer(answer: string, codeCiphered: string) {
	const code = Crypto.AES.decrypt(codeCiphered, 'very secret').toString(Crypto.enc.Utf8);

	return code.toUpperCase() === answer.toUpperCase();
}

function isValidCountry(country: string): country is keyof typeof countriesCoords {
	return country in countriesCoords;
}

export function getDistanceAndDirection(answerCode: string, codeCiphered: string) {
	const code = Crypto.AES.decrypt(codeCiphered, 'very secret').toString(Crypto.enc.Utf8);

	console.log(code, answerCode);
	if (!isValidCountry(answerCode) || !isValidCountry(code)) {
		throw new Error('Invalid country');
	}

	const coords1 = countriesCoords[code];
	const coords2 = countriesCoords[answerCode];

	console.log({ coords1, coords2 });
	return {
		distance: geolib.getDistance(coords1, coords2) / 1000,
		direction: geolib.getCompassDirection(coords2, coords1)
	};
}

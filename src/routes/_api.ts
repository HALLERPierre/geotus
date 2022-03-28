import { countries } from '../lib/data/countries/names';
import Crypto from 'crypto-js';
import { countriesCoords } from '../lib/data/countries/coords';
import * as geolib from 'geolib';

export function getRandomCountry() {
	const country = countries[Math.floor(Math.random() * countries.length)];
	const countryCiphered = Crypto.AES.encrypt(country.code.toUpperCase(), 'very secret').toString();

	return { code: countryCiphered };
}

export function checkAnswer(answer: string, codeCiphered: string) {
	const code = Crypto.AES.decrypt(codeCiphered, 'very secret').toString(Crypto.enc.Utf8);

	return code.toUpperCase() === answer.toUpperCase();
}

const enc = new TextDecoder('utf-8');

export async function getSVG(origin: string, codeCiphered: string) {
	const code = Crypto.AES.decrypt(codeCiphered, 'very secret').toString(Crypto.enc.Utf8);
	const res = await fetch(`${origin}/images/${code.toLowerCase()}/vector.svg`);
	const svg = await res.arrayBuffer();

	return enc.decode(svg);
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

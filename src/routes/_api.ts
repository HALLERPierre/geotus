import { countries } from '../data/countries/names';
import * as fs from 'fs';
import path from 'path';
import Crypto from 'crypto-js';
import { fileURLToPath } from 'url';
import { countriesCoords } from '../data/countries/coords';

function dirname() {
	return path.dirname(fileURLToPath(import.meta.url));
}

export async function getRandomCountry() {
	const country = countries[Math.floor(Math.random() * countries.length)];
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

// https://stackoverflow.com/a/46737094
function distance(lat1: number, lon1: number, lat2: number, lon2: number) {
	const radlat1 = (Math.PI * lat1) / 180;
	const radlat2 = (Math.PI * lat2) / 180;
	const theta = lon1 - lon2;
	const radtheta = (Math.PI * theta) / 180;
	let dist =
		Math.sin(radlat1) * Math.sin(radlat2) +
		Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist);
	dist = (dist * 180) / Math.PI;
	dist = dist * 60 * 1.1515;

	return Math.floor(dist * 1.609344);
}

// https://stackoverflow.com/a/22740092
function getAtan2(y: number, x: number) {
	return Math.atan2(y, x);
}

function direction(lat1: number, lon1: number, lat2: number, lon2: number) {
	const radians = getAtan2(lon1 - lon2, lat1 - lat2);

	const compassReading = radians * (180 / Math.PI);

	const coordNames = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
	let coordIndex = Math.round(compassReading / 45);
	if (coordIndex < 0) {
		coordIndex = coordIndex + 8;
	}

	return coordNames[coordIndex]; // returns the coordinate value
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

	return {
		distance: distance(coords1.latitude, coords1.longitude, coords2.latitude, coords2.longitude),
		direction: direction(coords1.latitude, coords1.longitude, coords2.latitude, coords2.longitude)
	};
}

import { countries } from './data/countries/names';

export const getCountryNameFromCode = (code: string) => {
	return countries.find((country) => country.code === code).name ?? 'Unknown';
};

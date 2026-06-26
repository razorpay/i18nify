import NAMES_DATA from '#/i18nify-data/names/data.json';
import type { NamesData } from './types';

const namesData = NAMES_DATA as NamesData;

export const getNamesData = (): NamesData => namesData;

export const getNameValidationRules = () =>
  getNamesData().names_information.validation_rules;

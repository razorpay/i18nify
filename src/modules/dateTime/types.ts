export type DateInput = Date | string;
export type Locale = string;

export interface DateTimeFormatOptions extends Intl.DateTimeFormatOptions {}

export interface DateFormatOptions
  extends Omit<Intl.DateTimeFormatOptions, 'timeStyle'> {}

export interface TimeFormatOptions
  extends Omit<Intl.DateTimeFormatOptions, 'dateStyle'> {}

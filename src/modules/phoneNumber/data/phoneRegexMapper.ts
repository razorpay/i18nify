export const phoneRegexMapper: { [key: string]: RegExp } = {
  IN: /^(?:(?:\+|0{0,2})91\s*[-]?\s*|[0]?)?[6789]\d{9}$/,
  MY: /^(?:(?:\+|0{0,2})60\s*[-]?\s*|[0]?)?[1-9]\d{7,9}$/,
};

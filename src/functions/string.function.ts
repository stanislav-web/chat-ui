/**
 * Replace placeholders in text
 * @param {string} sentence
 * @param {object} data
 */
export const replace = (sentence: string, data: object): string => {
  const matches = sentence.match(/<(.*?)>/g);

  if (matches) {
    matches.forEach((placeholder) => {
      const phText = placeholder.substring(1, placeholder.length - 1);
      if (Boolean(data[phText])) {
        sentence = sentence.replace(placeholder, data ? data[phText] : phText);
      }
    });
  }
  return sentence;
};

/**
 * Check if data is null, empty, undefined
 * @param {any} value
 * @return boolean
 */
export const isNullUndefEmptyStr = (value: any): boolean => {
  if (typeof value === 'object' && value !== null) {
    return Object.values(value).every(value => value === null || value === undefined || value === '');
  } else return value === null || value === undefined || value === '';
}

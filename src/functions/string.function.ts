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
 * Counter
 */
export const counter = (function() {
  let count = 0;
  return function() {
    return ++count;
  }
}());

/**
 * Check if data is null, empty, undefined
 * @param {any} obj
 * @return boolean
 */
export const isNullUndefEmptyStr = (obj: any): boolean => Object.values(obj).every(value => value === null || value === undefined || value === '');

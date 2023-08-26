/**
 * Replace placeholders in text
 * @param {string} sentence
 * @param {object} data
 */
export const message = (sentence: string, data: any): string => {
  const matches = sentence.match(/<(.*?)>/g);

  if (matches != null) {
    matches.forEach((placeholder) => {
      const phText = placeholder.substring(1, placeholder.length - 1);
      if (Boolean(data?.[phText])) {
        sentence = sentence.replace(placeholder, data[phText]);
      }
    });
  }
  return sentence;
};

export const getRandomInt = () => {
  return getRandomIntWithRange(0, 100000000);
};

// eslint-disable-next-line max-len
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
export const getRandomIntWithRange = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) - min);
};
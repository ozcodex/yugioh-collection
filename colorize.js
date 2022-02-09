let colors = {
  black: 30,
  red: 31,
  olive: 32,
  gold: 33,
  blue: 34,
  purple: 35,
  aqua: 36,
  silver: 37,
  gray: 90,
  orange: 91,
  green: 92,
  yellow: 93,
  steel: 94,
  violet: 95,
  cyan: 96,
  white: 97,
};
/*
  options_example = {
    color: 'red',
    background: 'white',
    bold: true,
    underline: true,
    strike: true,
    blink: true,
    inverted: false,
  };
*/

module.exports = (content = '', options) => {
  //todo: validate options
  const start = '\033[';
  const end = '\033[0m';
  const flags = [
    0, //normal mode
    colors[options?.color] || 0, //main color
    10 + (colors[options?.background] || -10), //background color
    options?.bold ? 1 : 0,
    options?.underline ? 4 : 0,
    options?.strike ? 5 : 0,
    options?.blink ? 7 : 0,
    options?.inverted ? 9 : 0,
  ];
  return start + flags.sort().join(';') + 'm' + content + end;
};

export const REGEX = {
  EMAIL: /[a-z0-9]+@[a-z]+\.[a-z]{2,4}/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,32})/,
  PHONE: /^(\+?\d{1,4}[-.\s]?)?(\(?\d{1,3}\)?[-.\s]?)?[\d\s.-]{7,14}$/,
  IMG: /\.(png|jpg|webp)$/,
  INTEGER: /^-?\d*$/,
};

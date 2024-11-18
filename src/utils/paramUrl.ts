import { Selection } from '@nextui-org/react';

export const formatQuery = (
  query: Record<string, string | undefined>,
): string => {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value) {
      params.append(key, value);
    }
  });

  return params.toString();
};

/**
 *
 * @param value - It is the period of time from what date to what date
 * @returns - filters[$and][0][createdAt][$gte]=2024-08-27T17:00:00.000Z&
 *            filters[$and][1][createdAt][$lte]=2024-08-31T17:00:00.000Z
 *
 * @example
 * @param - {'createdAt[$gte]': '2024-08-26T17:00:00.000Z',
 *            'createdAt[$lte]': '2024-08-31T17:00:00.000Z', }
 * @returns- filters[$and][0][createdAt][$gte]=2024-08-27T17:00:00.000Z&
 *           filters[$and][1][createdAt][$lte]=2024-08-31T17:00:00.000Z
 */
export const formatFilterIntervalDate = (
  value: Record<string, string>,
): string => {
  const urlParams: string[] = [];

  Object.keys(value).forEach((key) => {
    const match = RegExp(/^([^[]+)\[([^\]]+)\]$/).exec(key);
    const [field, operator] = match ? match.slice(1) : [];

    if (value[key]) {
      urlParams.push(
        `&filters[$and][${urlParams.length}][${field}][${operator}]=${value[key]}`,
      );
    }
  });

  return urlParams.join('&');
};

/**
 * Formats a filter URL for multiple users based on the input values.
 *
 * @param values - An array of usernames to filter by
 * @returns - A formatted URL string with filters for each username
 *
 * @example
 * @param - ['david', 'lionel'];
 * @returns - filters[$and][0][assignees][username][$eq]=david&filters[$and][1][assignees][username][$eq]=lionel
 */
export const formatFilterMultipleUser = (values: string[]) => {
  let url = '';

  if (!values.length) return '';

  values.forEach((value, index) => {
    url += `&filters[$and][${index}][assignees][username][$eq]=${value.trim()}`;
  });

  return url.slice();
};

/**
 * Formats a string of usernames into an array.
 *
 * @param value - A comma-separated string of usernames
 * @returns - An array of usernames
 *
 * @example
 * @param value - 'david,lionel';
 * @returns - ['david', 'lionel']
 */
export const convertStringToArray = (value: string) => value.split(',');

export const formatOptionsSelection = (object: Selection) =>
  Array.from(object).join(', ');

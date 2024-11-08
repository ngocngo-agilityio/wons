/**
 * Toggles body scroll behavior based on the provided state.
 *
 * @param {boolean} state - If `true`, disables scrolling by setting `overflow` to 'hidden';
 *                          if `false`, enables scrolling by setting `overflow` to 'auto'.
 */
export const preventScrollFromState = (state: boolean) =>
  (document.body.style.overflow = `${state ? 'hidden' : 'auto'}`);

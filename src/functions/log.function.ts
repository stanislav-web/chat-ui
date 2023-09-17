/* eslint-disable */

/**
 * GlobalDebug
 * @module functions
 * @param {function} anonymous
 * @return void
 */
export const GlobalDebug = (function () {
  const savedConsole = console;
  /**
   * @param {boolean} debugOn
   * @param {boolean} suppressAll
   */
  return function (debugOn: boolean, suppressAll: boolean = false) {
    const suppress = suppressAll || false;
    if (!debugOn) {
      console = {};
      console.log = function () {};
      if (suppress) {
        console.info = function () {};
        console.debug = function () {};
        console.warn = function () {};
        console.error = function () {};
      } else {
        console.info = savedConsole.info;
        console.debug = savedConsole.debug;
        console.warn = savedConsole.warn;
        console.error = savedConsole.error;
      }
    } else {
      console = savedConsole;
    }
  };
})();

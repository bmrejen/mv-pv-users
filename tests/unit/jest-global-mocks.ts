global["CSS"] = null;

const mock = () => {
  let storage = {};

  return {
    clear: () => storage = {},
    getItem: (key) => key in storage ? storage[key] : null,
    removeItem: (key) => delete storage[key],
    setItem: (key, value) => storage[key] = value || "",
  };
};

Object.defineProperty(window, "localStorage", { value: mock() });
Object.defineProperty(window, "sessionStorage", { value: mock() });
Object.defineProperty(document, "doctype", {
  value: "<!DOCTYPE html>",
});
Object.defineProperty(window, "getComputedStyle", {
  value: () => {
    return {
      appearance: ["-webkit-appearance"],
      display: "none",
    };
  },
});
/**
 * ISSUE: https://github.com/angular/material2/issues/7101
 * Workaround for JSDOM missing transform property
 */
Object.defineProperty(document.body.style, "transform", {
  value: () => {
    return {
      configurable: true,
      enumerable: true,
    };
  },
});

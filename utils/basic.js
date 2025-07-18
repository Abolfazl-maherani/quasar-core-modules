import { parseSync } from "svgson";
import _ from "lodash";
import toPath from "element-to-path";
import { isNumber } from "lodash/lang";

export const concatURL = (baseURL, endpoint) => {
  // Check if the base URL ends with a slash and the endpoint starts with a slash
  const separator =
    baseURL.endsWith("/") || endpoint.startsWith("/") ? "" : "/";

  // Concatenate the base URL and endpoint with the separator
  return baseURL + separator + endpoint;
};
export const concatRouteWithLangPrefix = (route = "") => {
  return String.prototype.concat("/:lang", route);
};

export const generateRouteByName = (
  name,
  params = { path: undefined, pathParams: "", removeModuleName: false }
) => {
  const split = name.split("/");

  let path;

  if (params.path === undefined) {
    if (split[0] === "app" || params.removeModuleName) {
      path = split[2];
    } else {
      path = `${split[0]}/${split[2]}`;
    }
  } else {
    path = params.path;
  }

  if (!["index", "view"].includes(split[3])) {
    path += "/" + split[3];
  }

  if (["view"].includes(split[3])) {
    path += "/" + params.pathParams;
  }

  return {
    name,
    path,
    component: () =>
      import(
        /* @vite-ignore */
        `../../${split[0]}/pages/${split[1]}/${
          split[2]
        }/${capitalizeFirstLetter(split[3])}Page.vue`
      ),
    props: {
      moduleName: split[0],
      roleName: split[1],
      controllerName: split[2],
      actionName: split[3],
    },
  };
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const countSlashes = (inputString) => {
  // Use split to create an array of parts separated by '/'
  // The length of the array minus one gives us the count of slashes
  return inputString.split("/").length - 1;
};

export const rawSvgToSvgFormat = (rawSvg) => {
  const svgStyleAttributes = [
    "stroke",
    "stroke-width",
    "stroke-linecap",
    "stroke-linejoin",
    "fill",
    "fill-rule",
    "opacity",
  ];
  const svgTransformAttributes = ["transform"];
  const jsonToStyle = (obj, attrs) => {
    return Object.entries(_.pick(obj, attrs))
      .map(([k, v]) => `${k}:${v}`)
      .join(";");
  };

  // Get svg string content
  // Parse svg string to object
  let svgObj = parseSync(rawSvg);

  let formatSvgObj = {
    ...svgObj,
    children: [],
  };

  svgObj.children.forEach((item) => {
    if (item.name === "g") {
      formatSvgObj.children.push(
        ...item.children?.map((child) => ({
          ...child,
          attributes: {
            ...(item?.attributes || {}),
            ...(child?.attributes || {}),
          },
        }))
      );
    } else formatSvgObj.children = svgObj.children;
  });

  // Extract viewBox and styles
  const svgViewBox = formatSvgObj.attributes.viewBox;
  const svgStyle = jsonToStyle(formatSvgObj.attributes, svgStyleAttributes);
  // Iterate all child elements to convert svg to quasar svg format
  const svgPath = formatSvgObj.children
    .map((obj) => {
      // Extract styles and transformations
      const styles =
        jsonToStyle(obj.attributes, svgStyleAttributes) || svgStyle;

      const transformations = jsonToStyle(
        obj.attributes,
        svgTransformAttributes
      ).replaceAll("transform:", "");

      // Convert element to path
      const path = toPath(obj)
        .replace(/[^A-Za-z0-9.-]/gm, " ")
        .replace(/\s\s+/g, " ");
      // Join path + styles + transformations with quasar format '@'

      return _.trim([path, styles, transformations].join("@@"), "@");
    })
    .join("&&");

  // Add icon to file

  return _.trim(`${svgPath}|${svgViewBox}`, "|");
};

export const formatCurrency = (value, splitter = ",", symbol = null) => {
  if (symbol) {
    return `${symbol} ${formatCurrency(value, splitter)}`;
  }

  if (!["number", "string"].includes(typeof value)) {
    return value;
  }
  if (
    typeof value === "string" &&
    !/^[0-9]*$/.test(value.replaceAll(splitter, ""))
  )
    return value;
  if (value) {
    // Convert the number to a string to make it easier to manipulate
    const numberString = value.toString().replaceAll(splitter, "");

    let result = "";

    for (let i = numberString.length - 1; i >= 0; i--) {
      if ((i + 1) % 3 === 0 && i !== numberString.length - 1) {
        result += splitter;
      }
      result += numberString[numberString.length - 1 - i];
    }
    return result.split("").join("");
  }

  return 0;
};
export const addSeparator = (number, sep = ",") => {
  if (number < 100) return number;
  if (number && isNumber(number))
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep);
};
export const formatNumber = (number) => {
  if (number < 1000) {
    return number.toString();
  } else if (number >= 1000 && number < 1000000) {
    return (number / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  } else if (number >= 1000000) {
    return (number / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
};
export const acceptOnlyNumberInputText = (evt) => {
  if (evt.which < 48 || evt.which > 57) {
    evt.preventDefault();
  }
};
export const isNumberInputText = (event) => {
  const charCode = event.keyCode;
  const metaKey = event.metaKey || event.ctrlKey;

  // Allow Meta key combinations (e.g., Cmd+C, Cmd+V)
  if (metaKey) {
    return;
  }
  // Allow Backspace, Tab, Enter, Arrow keys, and Delete
  if (
    charCode === 8 || // Backspace
    charCode === 9 || // Tab
    charCode === 13 || // Enter
    charCode === 37 || // Left Arrow
    charCode === 39 || // Right Arrow
    charCode === 46 // Delete
  ) {
    return;
  }

  // Allow number keys (0-9) and numpad number keys (0-9)
  if (
    (charCode < 48 || charCode > 57) && // Number keys
    (charCode < 96 || charCode > 105) // Numpad number keys
  ) {
    event.preventDefault();
  }
};
// Function to clear URL query string without reloading the page
export const clearQueryString = () => {
  if (process.env.CLIENT) {
    // Construct the new URL without the query string
    const url =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname;

    // Use history.replaceState to modify the current URL
    window.history.replaceState({ path: url }, "", url);
  }
};
export const clearHash = () => {
  if (process.env.CLIENT) {
    // Construct the new URL without the query string
    const url =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      window.location.search;

    // Use history.replaceState to modify the current URL
    window.history.replaceState({ path: url }, "", url);
  }
};
export const parseJson = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    console.error("Can`t parse str to json:", str);
  }
};
export const toJson = (obj) => {
  try {
    return JSON.stringify(obj);
  } catch (e) {
    console.error("Can`t convert to json:", obj);
  }
};

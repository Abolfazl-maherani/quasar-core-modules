import { parseSync } from "svgson";
import _ from "lodash";
import toPath from "element-to-path";

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
  ];
  const svgTransformAttributes = ["transform"];
  const jsonToStyle = (obj, attrs) => {
    return Object.entries(_.pick(obj, attrs))
      .map(([k, v]) => `${k}:${v}`)
      .join(";");
  };

  // Get svg string content
  // Parse svg string to object
  const svgObj = parseSync(rawSvg);
  // Extract viewBox and styles
  const svgViewBox = svgObj.attributes.viewBox;
  const svgStyle = jsonToStyle(svgObj.attributes, svgStyleAttributes);
  // Iterate all child elements to convert svg to quasar svg format
  const svgPath = svgObj.children
    .map((obj) => {
      // Extract styles and transformations
      const styles =
        jsonToStyle(obj.attributes, svgStyleAttributes) || svgStyle;
      const transformations = jsonToStyle(
        obj.attributes,
        svgTransformAttributes
      );
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

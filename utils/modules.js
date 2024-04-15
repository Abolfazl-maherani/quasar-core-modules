export const generateInputTypeFromFields = (field, forFilter = false) => {
  switch (field.type) {
    case "string":
      return "input";
    case "integer":
    case "boolean":
      if (field.options?.length && forFilter) return "select";
      else if (field.type === "boolean" && !forFilter) return "checkbox";
      return "input";

    case "datetime":
      return "datetime";
    default:
      return "know";
  }
};

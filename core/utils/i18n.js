export const getMessages = async (localeInModules, moduleConfig) => {
  const messages = {};
  for (const [path, module] of Object.entries(localeInModules)) {
    const localName = path.split("/")[1];

    if (!Object.prototype.hasOwnProperty.call(messages, localName)) {
      messages[localName] = {};
    }

    const mod = await module();

    messages[localName] = {
      [moduleConfig.name]: mod.default,
    };
  }
  return messages;
};

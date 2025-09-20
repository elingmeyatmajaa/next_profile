//load from json file
const languages = require("./languages/id.json");
export default function __(key: string, params = {}) {
  let translation = languages[key] || key;
  for (const [key, value] of Object.entries(params)) {
    translation = translation.replace(`:${key}`, value);
  }
  return translation ?? key;
}

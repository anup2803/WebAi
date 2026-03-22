const extractJson = (raw) => {
  if (!raw) return null;

  try {
    // remove markdown if exists
    let cleaned = raw
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // try direct parse first
    return JSON.parse(cleaned);
  } catch (err) {
    console.log("Direct parse failed");

    try {
      // fallback: extract JSON block
      const match = raw.match(/{[\s\S]*}/);
      if (!match) return null;

      let jsonString = match[0];

      // fix common issues
      jsonString = jsonString
        .replace(/\n/g, "\\n")        // fix line breaks
        .replace(/\r/g, "")
        .replace(/\t/g, " ")
        .replace(/\\(?!["\\/bfnrt])/g, "\\\\"); // fix bad escapes

      return JSON.parse(jsonString);
    } catch (err2) {
      console.log("Fallback parse failed");
      return null;
    }
  }
};

export default extractJson;

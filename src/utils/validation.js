function isBlank(value) {
  return typeof value !== "string" || value.trim() === "";
}

function parseId(id) {
  const parsedId = Number.parseInt(id, 10);

  if (Number.isNaN(parsedId) || parsedId < 1) {
    return null;
  }

  return parsedId;
}

module.exports = {
  isBlank,
  parseId,
};

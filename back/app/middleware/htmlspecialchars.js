const entityMap = {
  "&": "",
  "<": "",
  ">": "",
  '"': "",
  "'": "",
  "/": "",
  "`": "",
  "=": "",
};

function htmlspecialchars(string) {
  return String(string).replace(/[&<>"'`=\/]/g, function (s) {
    return entityMap[s];
  });
}

module.exports = htmlspecialchars;

let generatedHTML = null;

let indexHTMLGenerator = function (metaTagRegistry, scriptRegistry, styleRegistry) {
  let styleIncludes = styleRegistry.modules.map(entry => `    <link rel="${entry.type}" href="${entry.url}" type="text/css" />`).join("    \n");
  let scriptIncludes = scriptRegistry.modules.map(entry => `    <script defer type="${entry.type}" src="${entry.url}"></script>`).join("\n");
  let metaTags = metaTagRegistry.modules.map(entry=>`    ${entry}`).join("\n");
  generatedHTML = generatedHTML || `<!doctype html>
<html lang="en">
  <head>
${metaTags}
${styleIncludes}
${scriptIncludes}
  </head>
  <body>
  </body>
</html>`;
  return generatedHTML;
};

module.exports = indexHTMLGenerator;
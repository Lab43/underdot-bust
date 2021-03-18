const crypto = require('crypto')
    , url = require('url')
;



module.exports = (rule = '**/*.@(css|js)') => ({ registerFileHandler, registerTemplateHelper }) => {

  const hashes = {};

  registerFileHandler(rule, ({ path, file }) => {
    hashes[path] = crypto.createHash('md5').update(file).digest('hex');
    return {path, file};
  });

  registerTemplateHelper('busted', (metadata, requestedPath) => {

    // if the path starts with a slash remove it
    // otherwise, rewrite the path to be relative to the page or template it's being requested from
    path = requestedPath.startsWith('/')
      ? requestedPath.slice(1)
      : url.resolve(metadata.filePath, requestedPath)
    ;

    if (!hashes[path]) throw new Error(`No hash found for ${path}`);
    return `${requestedPath}?h=${hashes[path]}`;

  });

}

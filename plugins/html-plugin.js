const fs = require('fs/promises');
const path = require('path');

const { createLink, createScript, generateHTML } = require('../util');

module.exports = () => {
  return {
    name: 'esbuild:html',
    setup(build) {
      build.onEnd(async (buildResult) => {
        console.log('metafile', buildResult);

        if (buildResult.errors.length) return;
        const { metafile } = buildResult;

        const scripts = [];
        const links = [];
        // 生成scripts和links
        if (metafile) {
          const { outputs } = metafile;
          const assets = Object.keys(outputs);

          assets.forEach((asset) => {
            if (asset.endsWith('.js')) {
              scripts.push(createScript(asset));
            } else if (asset.endsWith('.css')) {
              links.push(createLink(asset));
            }
          });
        }
        console.log('scripts', scripts);
        // 生成模版
        const templateContent = generateHTML(scripts, links);
        console.log(templateContent);
        // 写入磁盘
        const templatePath = path.join(process.cwd(), 'index.html');
        await fs.writeFile(templatePath, templateContent);
      });
    },
  };
};

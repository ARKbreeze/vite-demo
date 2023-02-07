const { log } = require('console');

module.exports = () => ({
  name: 'esbuild:http',
  setup(build) {
    let https = require('https');
    let http = require('http');

    // 1.拦截cdn解析
    build.onResolve(
      // 匹配过滤http开头的模块
      { filter: /^https?:\/\// },
      (args) => {
        return {
          // 保留原路径
          path: args.path,
          // 添加namespace标识
          namespace: 'http-url',
        };
      }
    );

    // 对namespace:http-url的间接依赖进行全部解析 添加前缀

    build.onResolve(
      {
        filter: /.*/,
        namespace: 'http-url',
      },
      (args) => {
        console.log('path', args.path);
        console.log('importer', args.importer);

        return {
          path: new URL(args.path, args.importer).toString(),
          namespace: 'http-url',
        };
      }
    );

    // 2. fetch请求加载cdn资源
    build.onLoad(
      {
        filter: /.*/,
        namespace: 'http-url',
      },
      async (args) => {
        let contents = await new Promise((resolve, reject) => {
          function fetch(url) {
            console.log(`Downloading:${url}`);

            let lib = url.startsWith('https') ? https : http;
            let req = lib
              .get(url, (res) => {
                //响应请求
                const {
                  statusCode,
                  headers: { location },
                } = res;

                if ([301, 302, 307].includes(statusCode)) {
                  // 重定向
                  fetch(new URL(location, url).toString());
                  req.destroy();
                } else if (statusCode === 200) {
                  // 响应成功
                  let chunks = [];
                  // 接收数据
                  res.on('data', (chunk) => chunks.push(chunk));
                  // 结束合并数据并返回
                  res.on('end', () => resolve(Buffer.concat(chunks)));
                } else {
                  // 请求失败
                  reject(new Error(`GET ${url} failed : status ${statusCode}`));
                }
              })
              .on('error', reject);
          }

          fetch(args.path);
        });

        return { contents };
      }
    );

    //
    build.onEnd((args) => {
      console.log('onEnd metafile', args.metafile);
    });
  },
});

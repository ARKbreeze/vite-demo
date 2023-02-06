const { build, buildSync, serve } = require('esbuild');

//异步方法 运行打包
async function runBuild() {
  // 运行build 返回promise
  const result = await build({
    // build 常见配置
    // 工作路径
    absWorkingDir: process.cwd(),
    //入口文件 数组
    entryPoints: ['./src/index.jsx'],
    //打包产物 出口目录
    outdir: 'dist',
    // 是否打包
    bundle: true,
    // 产物格式 esm  commonjs iife
    format: 'esm',
    // 排除的列表  不打包的
    external: [],
    // 自动拆包
    splitting: true,
    // sourcemap
    sourcemap: true,
    // metafile 元信息
    metafile: true,
    // 代码压缩
    minify: true,
    // watch模式 开启源码变化自动打包  但是终端没什么提示
    watch: false,
    // 产物是否写入硬盘
    write: true,
    // 内置一系列的loader
    // base64 binary css dataurl file js(x) ts(x) text
    loader: {
      '.png': 'base64',
    },
  });

  console.log(result);
}

// runBuild();

async function runServeBuild() {
  const server = await serve(
    {
      port: 3000,
      servedir: './dist',
    },
    {
      absWorkingDir: process.cwd(),
      entryPoints: ['./src/index.jsx'],
      bundle: true,
      format: 'esm',
      splitting: true,
      sourcemap: true,
      metafile: true,
      ignoreAnnotations: true,
    }
  );

  console.log('httpServer start at localhost:', server.port);
}

// runServeBuild();

// build 异步的  buildSync同步,如无必要不要同步 本身就是为了速度采用的esbuild 如果你要用同步的 意味着所有操作都会是同步的 自我设限

let envPlugin = {
  name: 'env',
  setup(build) {
    build.onResolve({ filter: /^env$/ }, (args) => ({
      path: args.path,
      namespace: 'env-ns',
    }));

    build.onLoad({ filter: /.*/, namespace: 'env-ns' }, () => ({
      contents: JSON.stringify(process.env),
      loader: 'json',
    }));
  },
};

// require('esbuild')
//   .build({
//     entryPoints: ['src/in.jsx'],
//     bundle: true,
//     outfile: 'out.js',
//     // 应用插件
//     plugins: [envPlugin],
//   })
//   .catch(() => process.exit(1));

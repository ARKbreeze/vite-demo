const { build } = require('esbuild');

// 插件对象
let plugin = {
  name: 'xxx',
  setup(builds) {
    // 钩子的第一个参数  { filter : reg , namespace? : ''  } 正则是go函数实现的 缺少部分js正则的支持
    // 第二个参数是个回调函数  参数跟返回值根据钩子有所不同  () => { }

    // 解析钩子
    builds.onResolve(
      {
        filter: /^env$/,
      },
      (args) => {
        // 模块路径
        console.log('1args.path', args.path);
        // 父模块路径   引入的模块名
        console.log('1args.importer', args.importer);
        // namespace标识
        console.log('1args.namespace', args.namespace);
        // 基准路径
        console.log('1args.resolverDir', args.resolveDir);
        // 导入方式   import  require
        console.log('1args.kind', args.kind);
        // 额外绑定的插件数据
        console.log('1args.pluginData', args.pluginData);

        return {
          // 错误信息
          errors: [],
          // 是否需要external
          external: false,
          //插件名称
          pluginName: 'xxx',
          // suffix  添加路径后缀
          suffix: '?xx',
          // 模块路径
          path: args.path,
          // namespace标识
          namespace: 'env-ns',
          //额外数据
          pluginData: null,
          // 警告信息
          warnings: [],
          // false时 如果模块没有用到 会在产物中删除代码
          sideEffects: false,
          // watch模式下额外需要观察的文件
          watchDirs: [],
          watchFiles: [],
        };
      }
    );
    // 解析内容钩子
    builds.onLoad(
      {
        filter: /.*/,
        namespace: 'env-ns',
      },
      (args) => {
        // 路径
        console.log('args.path', args.path);
        // namespace
        console.log('args.namespace', args.namespace);
        // 后缀
        console.log('args.suffix', args.suffix);
        //额外插件信息
        console.log('args.pluginData', args.pluginData);

        return {
          // 模块的具体信息
          contents: JSON.stringify(process.env),
          // 错误
          errors: [],
          // 指定loader
          loader: 'json',
          //额外的插件信息
          pluginData: null,
          //插件名称
          pluginName: 'xxx',
          //基准路径  --
          resolveDir: './dir',
          // 警告信息
          warnings: [],
          // 仅仅在 Esbuild 开启 watch 模式下生效
          // 告诉 Esbuild 需要额外监听哪些文件/目录的变化
          watchDirs: [],
          watchFiles: [],
        };
      }
    );

    // onstart  开始与结束钩子   通常是构建开始与结束进行相关的操作
    builds.onStart(() => {
      console.log('build start');
    });

    builds.onEnd((buildResult) => {
      if (buildResult.errors.length) return;
      console.log(buildResult.metafile);
    });
  },
};

build({
  absWorkingDir: process.cwd(),
  entryPoints: ['./src/in.jsx'],
  outfile: 'out.js',
  bundle: true,
  metafile: true,
  plugins: [plugin],
}).catch((e) => console.log(e));

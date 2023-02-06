module.exports = () => ({
  name: 'CDN',
  setup(build) {
    build.onStart(() => {});
    build.onEnd((buildResult) => {});

    build.onResolve({}, (args) => {});
    build.onLoad({}, (args) => {});
  },
});

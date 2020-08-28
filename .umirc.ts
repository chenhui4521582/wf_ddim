import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  proxy: {
    '/api': {
      target: 'http://172.16.248.175:8087/',
      changeOrigin: true,
      pathRewrite: { '^/api': 'api' },
    },
  },
});

import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  proxy: {
    '/api': {
      target: 'https://ddimh5.jdd-hub.com',
      changeOrigin: true,
      pathRewrite: { '^/api': 'api' },
    },
  },
});


export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/choc/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/choc"
  },
  {
    "renderMode": 2,
    "route": "/choc/shop"
  },
  {
    "renderMode": 2,
    "route": "/choc/cart"
  },
  {
    "renderMode": 2,
    "route": "/choc/checkout"
  },
  {
    "renderMode": 2,
    "route": "/choc/login"
  },
  {
    "renderMode": 2,
    "route": "/choc/register"
  },
  {
    "renderMode": 2,
    "route": "/choc/profile"
  },
  {
    "renderMode": 2,
    "route": "/choc/forgetpass"
  },
  {
    "renderMode": 2,
    "route": "/choc/orders"
  },
  {
    "renderMode": 2,
    "redirectTo": "/choc/HomeComponent",
    "route": "/choc/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 58970, hash: '47c9410a422ff965b976fad1547ef0becbfe5e42f66f34b9ebd390b42eead828', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1594, hash: 'ca69bfe0cc72a79dac064293f502c4896b5d445601cf4efd15c686f35b8a933a', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'shop/index.html': {size: 98779, hash: '12bccded0e9a412545ec6698d3bcba0325195b9c30304c468eb87c9eb57dd1f0', text: () => import('./assets-chunks/shop_index_html.mjs').then(m => m.default)},
    'checkout/index.html': {size: 252, hash: '016ececc2314cade61ec85e8443950236c81c5ccde2d46197bab2e5a7fcb631d', text: () => import('./assets-chunks/checkout_index_html.mjs').then(m => m.default)},
    'profile/index.html': {size: 252, hash: '016ececc2314cade61ec85e8443950236c81c5ccde2d46197bab2e5a7fcb631d', text: () => import('./assets-chunks/profile_index_html.mjs').then(m => m.default)},
    'index.html': {size: 96287, hash: 'd7fe023650d30803508fe35e7fc101f60d16c8723ff18581ebd8c41f5cc27de2', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'forgetpass/index.html': {size: 84327, hash: 'cdf1f13e7ce91ca76b348bad2dbc92b795f05817b622c84a3c78de14dd9ce109', text: () => import('./assets-chunks/forgetpass_index_html.mjs').then(m => m.default)},
    'orders/index.html': {size: 252, hash: '016ececc2314cade61ec85e8443950236c81c5ccde2d46197bab2e5a7fcb631d', text: () => import('./assets-chunks/orders_index_html.mjs').then(m => m.default)},
    'cart/index.html': {size: 84817, hash: 'd9870ade99950bbe316b7a75040f728f9c4ce31eafe2607f8e382a5dad38a472', text: () => import('./assets-chunks/cart_index_html.mjs').then(m => m.default)},
    'register/index.html': {size: 85236, hash: 'f228f50cba6d543f85ba99516bd55f3a75fd1e8f0a44c58ca3a19dcf4304e752', text: () => import('./assets-chunks/register_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 83070, hash: 'd48d2067f30b63e4960aabd68bc47296bbeea7e73b03808be9efaf22d7ba466c', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'styles-EW4EAC47.css': {size: 113685, hash: '3qxkr70qJrs', text: () => import('./assets-chunks/styles-EW4EAC47_css.mjs').then(m => m.default)}
  },
};

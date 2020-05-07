const { Keystone } = require('@keystonejs/keystone');
const { KnexAdapter } = require('@keystonejs/adapter-knex');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');

const { Text, Password } = require('@keystonejs/fields');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');

console.log('process.env.NODE_ENV: ', process.env.NODE_ENV)
console.log('process.env.INSECURE_COOKIES: ', process.env.INSECURE_COOKIES)

const keystone = new Keystone({
  name: 'Proxy testing',
  adapter: new KnexAdapter({
    knexOptions: {
      client: 'pg',
      connection: process.env.DATABASE_URL || 'postgres://localhost/proxy_testing',
    },
  }),
  secureCookies: process.env.INSECURE_COOKIES ? false : undefined,
  // cookie: {
  //   secure: process.env.INSECURE_COOKIES ? false : undefined
  // }
});

keystone.createList('User', {
  fields: {
    email: { type: Text },
    password: { type: Password },
  },
});

const authStrategy = keystone.createAuthStrategy({
 type: PasswordAuthStrategy,
 list: 'User',
 config: {
   identityField: 'email',
   secretField: 'password',
 },
});

const onHeaders = require('on-headers');
const util = require('util');
const dump = (val) => util.inspect(val, { showHidden: false, depth: null, colors: true });

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new AdminUIApp({
      authStrategy,
      enableDefaultRoute: true,
    }),
  ],
  configureExpress: app => {
    // Add middleware to add a listener that can access the cookie header before the response is sent
    app.use((req, res, next) => {
      onHeaders(res, () => {
        console.log('\nSet-Cookie response header being set as:', dump(res.getHeader('set-cookie')));
      });
      next();
    });

    app.set('trust proxy', true);
  }
};


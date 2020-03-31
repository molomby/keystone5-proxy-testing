const { Keystone } = require('@keystonejs/keystone');
const { KnexAdapter } = require('@keystonejs/adapter-knex');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');

const { Text, Password } = require('@keystonejs/fields');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');

const keystone = new Keystone({
  name: 'Proxy testing',
  adapter: new KnexAdapter({
    knexOptions: {
      client: 'pg',
      connection: process.env.DATABASE_URL || 'postgres://localhost/proxy_testing',
    },
  }),
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
        // Should be an array; let's join it together
        const headerValue = Array.isArray(res.getHeader('set-cookie')) ? res.getHeader('set-cookie').join(' ') : '';
        console.log('Set-Cookie response header being set as...\nSet-Cookie: ', headerValue);
      });
      next();
    });

    app.set('trust proxy', true);
  }
};

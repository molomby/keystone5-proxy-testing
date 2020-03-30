const { Keystone } = require('@keystonejs/keystone');
const { KnexAdapter } = require('@keystonejs/adapter-knex');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { StaticApp } = require('@keystonejs/app-static');

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

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new StaticApp({ path: '/', src: 'public' }),

    new AdminUIApp({
      authStrategy,
      enableDefaultRoute: true,
    }),
  ],
};

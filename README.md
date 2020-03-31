# Keystone 5: Proxy Testing

See [Keystone 5: Secure Cookies and Reverse Proxies](https://gist.github.com/molomby/6fa22c165e0025f0f83d55195f3c6e37#express-trust-proxy-setting)
for the write up this yeilded.

## Setup

### Keystone

Clone and install packages as normal (`yarn`) then either..

```sh
# Start in dev
yarn keystone dev

# Start with NODE_ENV=production
NODE_ENV=production yarn keystone dev
```

### Nginx

You'll need to edit a bunch of the paths here and in `ks5-proxy-testing.conf`.
This wasn't built for portability.

```sh
# Install nginx
brew install nginx

# Symlink in this site's config
ln -s /Users/molomby/projects/keystone/proxy-test/nginx/ks5-proxy-testing.conf /usr/local/etc/nginx/servers
```

If you want to generate fresh TLS assets...

```sh
# Generate certs
# Or just use the included 'ks5proxytest.local' cert
openssl req -x509 -nodes -days 730 -newkey rsa:2048 -sha256 \
  -config /Users/molomby/projects/keystone/proxy-test/nginx/ss-req.conf \
  -keyout /Users/molomby/projects/keystone/proxy-test/nginx/ss-ks5proxytest.local-privkey.pem \
  -out /Users/molomby/projects/keystone/proxy-test/nginx/ss-ks5proxytest.local-cert.pem

# Generate dh prime (not needed)
openssl dhparam -out /usr/local/etc/nginx/dhparam-2048.pem 2048
```

Then to apply changes:

```sh
# Restart the service
brew services restart nginx
```

## Test

curl from localhost:

```sh
curl 'http://localhost:3000/admin/api' -sD - \
--data-binary '{"query":"mutation { authenticate: authenticateUserWithPassword(email: \"john@thinkmill.com.au\", password: \"qweqweqwe\") { item { id } } }"}' \
| egrep -i 'set-cookie'
```

curl from proxy:

```sh
curl 'https://ks5proxytest.local/admin/api' -sD - \
--data-binary '{"query":"mutation { authenticate: authenticateUserWithPassword(email: \"john@thinkmill.com.au\", password: \"qweqweqwe\") { item { id } } }"}' \
--insecure \
| egrep -i 'set-cookie'
```


```sh
brew install nginx

# Install nginx config with...
ln -s /Users/molomby/projects/keystone/proxy-test/nginx/ks5-proxy-testing.conf /usr/local/etc/nginx/servers

# Generate certs...
openssl req -x509 -nodes -days 730 -newkey rsa:2048 -sha256 \
  -config /Users/molomby/projects/keystone/proxy-test/nginx/ss-req.conf \
  -keyout /Users/molomby/projects/keystone/proxy-test/nginx/ss-ks5proxytest.local-privkey.pem \
  -out /Users/molomby/projects/keystone/proxy-test/nginx/ss-ks5proxytest.local-cert.pem

# Generate dh prime
openssl dhparam -out /usr/local/etc/nginx/dhparam-2048.pem 2048
```

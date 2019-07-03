exports.handler = function(event, context, callback) {
  const jwksClient = require('jwks-rsa');

  const client = jwksClient({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10, // Default value
    jwksUri: 'https://dev-c15ae8r6.auth0.com/.well-known/jwks.json',
  });

  // gotten from auth0 jwks.json
  const kid = 'RDE5N0Q1NTEwMEUyQTUyRDY4NzcwMzhENTdERjQ2MjUxNTc3N0IyQQ';

  client.getSigningKey(kid, (err, key) => {
    const signingKey = key.publicKey || key.rsaPublicKey;

    const headerType = 'Authorization: Bearer ';
    const token = event.headers.authorization.slice(headerType.length);

    const decoded = jwt.verify(token, signingKey);

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(
        {
          event,
          context,
          decoded,
        },
        undefined,
        2
      ),
    });
  });
};

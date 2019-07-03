const jwksClient = require('jwks-rsa');
const jwt = require('jsonwebtoken');

exports.handler = async function(event, context, callback) {
  const client = jwksClient({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10, // Default value
    jwksUri: 'https://dev-c15ae8r6.auth0.com/.well-known/jwks.json',
  });

  // gotten from auth0 jwks.json
  const kid = 'RDE5N0Q1NTEwMEUyQTUyRDY4NzcwMzhENTdERjQ2MjUxNTc3N0IyQQ';

  const signingKey = await new Promise((resolve, reject) => {
    client.getSigningKey(kid, (err, key) => {
      if (err) {
        reject(err);
      } else {
        resolve(key.publicKey || key.rsaPublicKey);
      }
    });
  });

  const headerType = 'Bearer ';
  const token = event.headers.authorization.slice(headerType.length);

  try {
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
  } catch (err) {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(err, undefined, 2),
    });
  }
};

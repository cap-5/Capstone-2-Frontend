export const auth0Config = {
  domain:
    process.env.REACT_APP_AUTH0_DOMAIN || "dev-cfd35oecvakbb3kq.us.auth0.com",
  clientId:
    process.env.REACT_APP_AUTH0_CLIENT_ID || "fVH2fH974wnOzz5H8GyAqcdyqYKaN5CI",
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    scope: "openid profile email",
  },
};

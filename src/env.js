const ENV = {
  development: {
    apiUrl: 'http://13.126.190.87:3002/v1/',
  },
  production: {
    apiUrl: 'http://13.126.190.87:3002/v1/',
  },
};

// const environment = (env = Constants.manifest.releaseChannel) => {
//   if (__DEV__) {
//     return ENV.development;
//   } else if (env === 'production') {
//     return ENV.production;
//   }
// };

const environment = () => {
  return ENV.production;
};

export default environment;

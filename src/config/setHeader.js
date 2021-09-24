const setHeader = async (req, res, next) => {
  res.setHeader(
    'Access-Control-Allow-Origin',
    process.env.FE_DEV || process.env.FE_PROD
  );
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
};

export default setHeader
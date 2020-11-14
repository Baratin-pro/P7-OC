const userDecodedTokenId = (req) => {
  return req.user.userId;
};

module.exports = userDecodedTokenId;

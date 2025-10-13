const { Post } = require('../models');

const isUUID = (str) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

const uuidRedirect = async (req, res, next) => {
  const identifier = req.params.identifier;

  if (!isUUID(identifier)) {
    return next();
  }

  try {
    const post = await Post.findOne({
      where: { id: identifier },
      attributes: ['slug']
    });

    if (post) {
      return res.redirect(301, `/post/${post.slug}`);
    }
    next();
  } catch (error) {
    console.error('Error in UUID redirect:', error);
    next();
  }
};

module.exports = uuidRedirect;
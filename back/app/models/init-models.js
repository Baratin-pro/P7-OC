var _comment = require("./comment");
//var _message = require("./message");
var _publication = require("./publication");
var _user = require("./user");
var _user_disliked = require("./user_disliked");
var _user_liked = require("./user_liked");

function initModels(sequelize) {
  var comment = _comment(sequelize, Sequelize);
  //var message = _message(sequelize, Sequelize);
  var publication = _publication(sequelize, Sequelize);
  var user = _user(sequelize, Sequelize);
  var user_disliked = _user_disliked(sequelize, Sequelize);
  var user_liked = _user_liked(sequelize, Sequelize);

  comment.belongsTo(publication, { foreignKey: "idPublications" });
  publication.hasMany(comment, { foreignKey: "publicationsId" });

  comment.belongsTo(user, { foreignKey: "idUsers" });
  user.hasMany(comment, { foreignKey: "usersId" });

  //message.belongsTo(user, { foreignKey: "idUsers" });
  //user.hasMany(message, { foreignKey: "usersId" });

  publication.belongsTo(user, { foreignKey: "idUsers" });
  user.hasMany(publication, { foreignKey: "usersId" });

  user_disliked.belongsTo(publication, { foreignKey: "idPublications" });
  publication.hasMany(user_disliked, { foreignKey: "publicationsId" });

  user_disliked.belongsTo(user, { foreignKey: "idUsers" });
  user.hasMany(user_disliked, { foreignKey: "usersId" });

  user_liked.belongsTo(publication, { foreignKey: "idPublications" });
  publication.hasMany(user_liked, { foreignKey: "publicationsId" });

  user_liked.belongsTo(user, { foreignKey: "idUsers" });
  user.hasMany(user_liked, { foreignKey: "usersId" });

  return {
    comment,
    //message,
    publication,
    user,
    user_disliked,
    user_liked,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

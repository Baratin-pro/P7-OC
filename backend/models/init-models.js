var DataTypes = require("sequelize").DataTypes;
var _comment = require("./comment");
var _composition_groupe = require("./composition_groupe");
var _groupe = require("./groupe");
var _groupe_comment = require("./groupe_comment");
var _groupe_publication = require("./groupe_publication");
var _groupe_user_disliked = require("./groupe_user_disliked");
var _groupe_user_liked = require("./groupe_user_liked");
var _groupemessage = require("./groupemessage");
var _message = require("./message");
var _publication = require("./publication");
var _user = require("./user");
var _user_disliked = require("./user_disliked");
var _user_liked = require("./user_liked");

function initModels(sequelize) {
  var comment = _comment(sequelize, DataTypes);
  var composition_groupe = _composition_groupe(sequelize, DataTypes);
  var groupe = _groupe(sequelize, DataTypes);
  var groupe_comment = _groupe_comment(sequelize, DataTypes);
  var groupe_publication = _groupe_publication(sequelize, DataTypes);
  var groupe_user_disliked = _groupe_user_disliked(sequelize, DataTypes);
  var groupe_user_liked = _groupe_user_liked(sequelize, DataTypes);
  var groupemessage = _groupemessage(sequelize, DataTypes);
  var message = _message(sequelize, DataTypes);
  var publication = _publication(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);
  var user_disliked = _user_disliked(sequelize, DataTypes);
  var user_liked = _user_liked(sequelize, DataTypes);

  comment.belongsTo(publication, { foreignKey: "idPublications"});
  publication.hasMany(comment, { foreignKey: "publicationsId"});
  comment.belongsTo(user, { foreignKey: "idUsers"});
  user.hasMany(comment, { foreignKey: "usersId"});
  composition_groupe.belongsTo(groupe, { foreignKey: "idGroupes"});
  groupe.hasMany(composition_groupe, { foreignKey: "groupesId"});
  composition_groupe.belongsTo(user, { foreignKey: "idUsers"});
  user.hasMany(composition_groupe, { foreignKey: "usersId"});
  groupe_comment.belongsTo(groupe_publication, { foreignKey: "idGroupesPublications"});
  groupe_publication.hasMany(groupe_comment, { foreignKey: "groupesPublicationsId"});
  groupe_comment.belongsTo(user, { foreignKey: "idUsers"});
  user.hasMany(groupe_comment, { foreignKey: "usersId"});
  groupe_publication.belongsTo(groupemessage, { foreignKey: "idGroupesMessages"});
  groupemessage.hasMany(groupe_publication, { foreignKey: "groupesId"});
  groupe_publication.belongsTo(user, { foreignKey: "idUsers"});
  user.hasMany(groupe_publication, { foreignKey: "userId"});
  groupe_user_disliked.belongsTo(groupe_publication, { foreignKey: "idGroupesPublications"});
  groupe_publication.hasMany(groupe_user_disliked, { foreignKey: "groupesPublicationsId"});
  groupe_user_disliked.belongsTo(user, { foreignKey: "idUsers"});
  user.hasMany(groupe_user_disliked, { foreignKey: "usersId"});
  groupe_user_liked.belongsTo(groupe_publication, { foreignKey: "idGroupesPublications"});
  groupe_publication.hasMany(groupe_user_liked, { foreignKey: "groupesPublicationsId"});
  groupe_user_liked.belongsTo(user, { foreignKey: "idUsers"});
  user.hasMany(groupe_user_liked, { foreignKey: "usesrId"});
  groupemessage.belongsTo(groupe, { foreignKey: "idGroupes"});
  groupe.hasMany(groupemessage, { foreignKey: "groupesId"});
  groupemessage.belongsTo(user, { foreignKey: "idUsers"});
  user.hasMany(groupemessage, { foreignKey: "usersId"});
  message.belongsTo(user, { foreignKey: "idUsers"});
  user.hasMany(message, { foreignKey: "usersId"});
  publication.belongsTo(user, { foreignKey: "idUsers"});
  user.hasMany(publication, { foreignKey: "usersId"});
  user_disliked.belongsTo(publication, { foreignKey: "idPublications"});
  publication.hasMany(user_disliked, { foreignKey: "publicationsId"});
  user_disliked.belongsTo(user, { foreignKey: "idUsers"});
  user.hasMany(user_disliked, { foreignKey: "usersId"});
  user_liked.belongsTo(publication, { foreignKey: "idPublications"});
  publication.hasMany(user_liked, { foreignKey: "publicationsId"});
  user_liked.belongsTo(user, { foreignKey: "idUsers"});
  user.hasMany(user_liked, { foreignKey: "usersId"});

  return {
    comment,
    composition_groupe,
    groupe,
    groupe_comment,
    groupe_publication,
    groupe_user_disliked,
    groupe_user_liked,
    groupemessage,
    message,
    publication,
    user,
    user_disliked,
    user_liked,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

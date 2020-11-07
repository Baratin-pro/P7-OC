/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('groupe_user_disliked', {
    usersId: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'idUsers'
      }
    },
    groupesPublicationsId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'groupe_publication',
        key: 'idGroupesPublications'
      }
    }
  }, {
    sequelize,
    tableName: 'groupe_user_disliked',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "usersId" },
          { name: "groupesPublicationsId" },
        ]
      },
      {
        name: "fk_user_disliked_groupe_publication_idx",
        using: "BTREE",
        fields: [
          { name: "groupesPublicationsId" },
        ]
      },
    ]
  });
};

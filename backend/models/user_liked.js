/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_liked', {
    usersId: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'idUsers'
      }
    },
    publicationsId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'publication',
        key: 'idPublications'
      }
    }
  }, {
    sequelize,
    tableName: 'user_liked',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "usersId" },
          { name: "publicationsId" },
        ]
      },
      {
        name: "fk_user_liked_publication_idx",
        using: "BTREE",
        fields: [
          { name: "publicationsId" },
        ]
      },
    ]
  });
};

/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('groupe_comment', {
    idComments: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    usersId: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'user',
        key: 'idUsers'
      }
    },
    groupesPublicationsId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'groupe_publication',
        key: 'idGroupesPublications'
      }
    }
  }, {
    sequelize,
    tableName: 'groupe_comment',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idComments" },
        ]
      },
      {
        name: "fk_comment_user_idx",
        using: "BTREE",
        fields: [
          { name: "usersId" },
        ]
      },
      {
        name: "fk_groupe_comment_groupe_publication_idx",
        using: "BTREE",
        fields: [
          { name: "groupesPublicationsId" },
        ]
      },
    ]
  });
};

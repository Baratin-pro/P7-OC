/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('comment', {
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
    publicationsId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'publication',
        key: 'idPublications'
      }
    },
    usersId: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'user',
        key: 'idUsers'
      }
    }
  }, {
    sequelize,
    tableName: 'comment',
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
        name: "fk_comment_publication_idx",
        using: "BTREE",
        fields: [
          { name: "publicationsId" },
        ]
      },
      {
        name: "fk_comment_user_idx",
        using: "BTREE",
        fields: [
          { name: "usersId" },
        ]
      },
    ]
  });
};

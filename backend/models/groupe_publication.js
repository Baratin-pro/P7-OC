/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('groupe_publication', {
    idGroupesPublications: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    titles: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    descriptions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    publicationsDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    dislikes: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    userId: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'user',
        key: 'idUsers'
      }
    },
    groupesId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'groupemessage',
        key: 'idGroupesMessages'
      }
    }
  }, {
    sequelize,
    tableName: 'groupe_publication',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idGroupesPublications" },
        ]
      },
      {
        name: "ordreDate",
        using: "BTREE",
        fields: [
          { name: "publicationsDate" },
        ]
      },
      {
        name: "fk_groupe_publication_user_idx",
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
      {
        name: "fk_groupe_publication_groupe_message_idx",
        using: "BTREE",
        fields: [
          { name: "groupesId" },
        ]
      },
    ]
  });
};

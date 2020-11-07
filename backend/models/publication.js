/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('publication', {
    idPublications: {
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
    imagesUrl: {
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
    tableName: 'publication',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idPublications" },
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
        name: "fk_publication_user_idx",
        using: "BTREE",
        fields: [
          { name: "usersId" },
        ]
      },
    ]
  });
};

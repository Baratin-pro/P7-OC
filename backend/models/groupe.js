/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('groupe', {
    idGroupes: {
      autoIncrement: true,
      type: DataTypes.SMALLINT,
      allowNull: false,
      primaryKey: true
    },
    titles: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "title_UNIQUE"
    },
    images: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    descriptions: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'groupe',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idGroupes" },
        ]
      },
      {
        name: "title_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "titles" },
        ]
      },
    ]
  });
};

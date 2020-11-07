/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('composition_groupe', {
    usersId: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'idUsers'
      }
    },
    groupesId: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'groupe',
        key: 'idGroupes'
      }
    },
    rolesGroupeUser: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'composition_groupe',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "usersId" },
          { name: "groupesId" },
        ]
      },
      {
        name: "fk_composition_groupe_user_idx",
        using: "BTREE",
        fields: [
          { name: "usersId" },
        ]
      },
      {
        name: "fk_composition_groupe_groupe_idx",
        using: "BTREE",
        fields: [
          { name: "groupesId" },
        ]
      },
    ]
  });
};

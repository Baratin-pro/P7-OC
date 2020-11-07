/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('groupemessage', {
    idGroupesMessages: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    usersId: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'user',
        key: 'idUsers'
      }
    },
    groupesId: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'groupe',
        key: 'idGroupes'
      }
    }
  }, {
    sequelize,
    tableName: 'groupemessage',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idGroupesMessages" },
        ]
      },
      {
        name: "fk_groupe_message_user_idx",
        using: "BTREE",
        fields: [
          { name: "usersId" },
        ]
      },
      {
        name: "fk_groupe_message_groupe_idx",
        using: "BTREE",
        fields: [
          { name: "groupesId" },
        ]
      },
    ]
  });
};

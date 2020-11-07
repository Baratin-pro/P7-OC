/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('message', {
    idMessages: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    messages: {
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
    }
  }, {
    sequelize,
    tableName: 'message',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idMessages" },
        ]
      },
      {
        name: "fk_message_user_idx",
        using: "BTREE",
        fields: [
          { name: "usersId" },
        ]
      },
    ]
  });
};

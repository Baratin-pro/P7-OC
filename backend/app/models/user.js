"use strict";

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "user",
    {
      id: {
        autoIncrement: true,
        type: Sequelize.SMALLINT,
        allowNull: false,
        primaryKey: true,
      },
      lastname: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      firstname: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: "email_UNIQUE",
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      role: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      image: {
        type: Sequelize.STRING(255),
        allowNull: false,
        defaultValue: "http://localhost:3000/images/avatarDefault.jpg",
      },
    },
    {
      sequelize,
      tableName: "user",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "email_UNIQUE",
          unique: true,
          using: "BTREE",
          fields: [{ name: "email" }],
        },
      ],
    }
  );
  return User;
};

"use strict";

module.exports = (sequelize, Sequelize) => {
  const Publication = sequelize.define(
    "publication",
    {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      imageUrl: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      publicationDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      commentCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      like: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      dislike: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      userId: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
      },
    },
    {
      sequelize,
      tableName: "publication",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "ordreDate",
          using: "BTREE",
          fields: [{ name: "publicationDate" }],
        },
        {
          name: "fk_publication_user_idx",
          using: "BTREE",
          fields: [{ name: "userId" }],
        },
      ],
    }
  );
  return Publication;
};

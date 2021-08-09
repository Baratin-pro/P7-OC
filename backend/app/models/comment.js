"use strict";

module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define(
    "comment",
    {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      publicationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "publication",
          key: "id",
        },
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
      tableName: "comment",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "fk_comment_publication_idx",
          using: "BTREE",
          fields: [{ name: "publicationId" }],
        },
        {
          name: "fk_comment_user_idx",
          using: "BTREE",
          fields: [{ name: "userId" }],
        },
      ],
    }
  );
  return Comment;
};

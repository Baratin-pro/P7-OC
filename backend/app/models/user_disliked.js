"use strict";

module.exports = (sequelize, Sequelize) => {
  const UserDisliked = sequelize.define(
    "user_disliked",
    {
      userId: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "user",
          key: "id",
        },
      },
      publicationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "publication",
          key: "id",
        },
      },
    },
    {
      sequelize,
      tableName: "user_disliked",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "userId" }, { name: "publicationId" }],
        },
        {
          name: "fk_user_disliked_publication_idx",
          using: "BTREE",
          fields: [{ name: "publicationId" }],
        },
      ],
    }
  );
  return UserDisliked;
};

module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define(
    "comment",
    {
      idComments: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      comments: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      publicationsId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "publication",
          key: "idPublications",
        },
      },
      usersId: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        references: {
          model: "user",
          key: "idUsers",
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
          fields: [{ name: "idComments" }],
        },
        {
          name: "fk_comment_publication_idx",
          using: "BTREE",
          fields: [{ name: "publicationsId" }],
        },
        {
          name: "fk_comment_user_idx",
          using: "BTREE",
          fields: [{ name: "usersId" }],
        },
      ],
    }
  );
  return Comment;
};

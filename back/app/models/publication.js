module.exports = (sequelize, Sequelize) => {
  const Publication = sequelize.define(
    "publication",
    {
      idPublications: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      titles: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      descriptions: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      imagesUrl: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      publicationsDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      commentCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      likes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      dislikes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
      tableName: "publication",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "idPublications" }],
        },
        {
          name: "ordreDate",
          using: "BTREE",
          fields: [{ name: "publicationsDate" }],
        },
        {
          name: "fk_publication_user_idx",
          using: "BTREE",
          fields: [{ name: "usersId" }],
        },
      ],
    }
  );
  return Publication;
};

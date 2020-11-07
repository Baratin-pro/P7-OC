const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("groupomania", "root", "", {
  host: "localhost",
  dialect: "mysql",
});
sequelize
  .authenticate()
  .then((e) => console.log("Connexion à réussie !"))
  .catch((e) => console.log("Connexion à MySQL échouée ! :", e));

module.exports = (sequelize, DataTypes) => {
  let User = sequelize.define(
    "user",
    {
      idUsers: {
        autoIncrement: true,
        type: DataTypes.SMALLINT,
        allowNull: false,
        primaryKey: true,
      },
      names: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      firstnames: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      emails: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: "email_UNIQUE",
      },
      passwords: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      role: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      image: {
        type: DataTypes.BLOB,
        allowNull: true,
        unique: "image_UNIQUE",
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
          fields: [{ name: "idUsers" }],
        },
        {
          name: "email_UNIQUE",
          unique: true,
          using: "BTREE",
          fields: [{ name: "emails" }],
        },
        {
          name: "image_UNIQUE",
          unique: true,
          using: "BTREE",
          fields: [{ name: "image" }],
        },
      ],
    }
  );
  return User;
};

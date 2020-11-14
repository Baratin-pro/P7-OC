module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "user",
    {
      idUsers: {
        autoIncrement: true,
        type: Sequelize.SMALLINT,
        allowNull: false,
        primaryKey: true,
      },
      names: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      firstnames: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      emails: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: "email_UNIQUE",
      },
      passwords: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      role: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      image: {
        type: Sequelize.BLOB,
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

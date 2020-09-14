const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const bcrypt = require("bcrypt");
const { UserVerification } = require(".");
//const { afterCreate } = require("./BookRating");

class User extends Model {
	checkPassword(loginPw) {
		return bcrypt.compareSync(loginPw, this.password);
	}
}

User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		username: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [4]
			}
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		zipcode: {
			type: DataTypes.STRING(5),
			allowNull: true,
		},
		validated: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
        },
        notify_message:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        notify_new_discussion_comment:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
	},
  	{
	hooks: {
		async beforeCreate(newUserData) {
			newUserData.password = await bcrypt.hash(newUserData.password, 10);
			return newUserData;
		},
		async beforeUpdate(updatedUserData) {
			if (updatedUserData._changed.has('password')) {
				updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
			}

			return updatedUserData;
		}
	},
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "user"
  }
);

module.exports = User;
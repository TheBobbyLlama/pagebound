const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class UserVerification extends Model { }

UserVerification.init(
	{
/*		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},*/
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			references: {
				model: "user",
				key: "id"
			}
		},
		token: {
			type: DataTypes.STRING(16),
			allowNull: false
		}
	},
	{
		sequelize,
		timestamps: true,
		freezeTableName: true,
		underscored: true,
		modelName: "user_verification"
	}
);

module.exports = UserVerification;
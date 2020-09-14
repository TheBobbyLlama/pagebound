const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class DirectMessage extends Model { }

DirectMessage.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		sender_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "user",
				key: "id"
			}
		},
		recipient_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "user",
				key: "id"
			}
		},
		subject: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		message: {
			type: DataTypes.STRING(1024),
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		read: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	},
	{
		sequelize,
		freezeTableName: true,
		underscored: true,
		modelName: "direct_message"
	}
);

module.exports = DirectMessage;
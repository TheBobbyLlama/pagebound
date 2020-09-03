const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Club extends Model { }

Club.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		owner_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "user",
				key: "id"
			}
		},
		name: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false
		},
		book_id: {
			type: DataTypes.STRING
        }
	},
	{
		sequelize,
		timestamps: false,
		freezeTableName: true,
		underscored: true,
		modelName: "club"
	}
);

module.exports = Club;
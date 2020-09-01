const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class ClubMember extends Model {}

ClubMember.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "user",
				key: "id"
			}
		},
		club_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "club",
				key: "id"
			}
		}
	},
	{
		sequelize,
		timestamps: false,
		freezeTableName: true,
		underscored: true,
		modelName: "club_member"
	}
);

module.exports = ClubMember;
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class DiscussionTopic extends Model { }

DiscussionTopic.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		club_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "club",
				key: "id"
			}
		},
		isbn: {
			type: DataTypes.STRING(13),
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		}
	},
	{
		sequelize,
		freezeTableName: true,
		underscored: true,
		modelName: "discussion_topic"
	}
);

module.exports = DiscussionTopic;
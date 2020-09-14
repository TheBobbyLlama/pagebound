const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class DiscussionComment extends Model { }

DiscussionComment.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		discussion_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "discussion_topic",
				key: "id"
			}
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "user",
				key: "id"
			}
		},
		comment_text: {
			type: DataTypes.STRING(1024),
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
		modelName: "discussion_comment"
	}
);

module.exports = DiscussionComment;
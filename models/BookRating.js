const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class BookRating extends Model {}

BookRating.init(
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
		isbn: {
<<<<<<< HEAD
			type: DataTypes.STRING(13),
			allowNull: false,
			validate: {
				notEmpty: true
			}
=======
			type: DataTypes.STRING,
			allowNull: false
>>>>>>> feature/searchbar
		},
		score: {
			type: DataTypes.TINYINT.UNSIGNED,
			allowNull: false,
			validate: {
				isInt: true,
				min: 0,
				max: 5
			}
		},
/*		review_text: {
			type: DataTypes.TEXT,
			allowNull: true,
			validate: {
				notEmpty: true
			}
		}*/
	},
	{
		sequelize,
		timestamps: false,
		freezeTableName: true,
		underscored: true,
		modelName: "book_rating"
	}
);

module.exports = BookRating;
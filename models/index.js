const User = require("./User");
const BookRating = require("./BookRating");
const Club = require("./Club");
const ClubMember = require("./ClubMember");

// User to BookRating - one to many
User.hasMany(BookRating, {
	foreignKey: "user_id"
});

BookRating.belongsTo(User, {
	foreignKey: "user_id",
});

// User to Club - many to many through ClubMember
User.belongsToMany(Club, {
	through: ClubMember,
	as: "clubs",
	foreignKey: "user_id"
});

Club.belongsToMany(User, {
	through: ClubMember,
	as: "clubs",
	foreignKey: "club_id"
});

ClubMember.belongsTo(User, {
	foreignKey: "user_id"
});
  
ClubMember.belongsTo(Club, {
	foreignKey: "club_id"
});
  
User.hasMany(ClubMember, {
	foreignKey: "user_id"
});
  
Club.hasMany(ClubMember, {
	foreignKey: "club_id"
});

module.exports = { User, BookRating, Club, ClubMember };
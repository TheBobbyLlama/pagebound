const User = require("./User");
const BookRating = require("./BookRating");
const Club = require("./Club");
const ClubMember = require("./ClubMember");
const DirectMessage = require("./DirectMessage");
const DiscussionTopic = require("./DiscussionTopic");
const DiscussionComment = require("./DiscussionComment");
const UserVerification = require("./UserVerification");

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
	as: "members",
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

// Owner to Club - one to one
Club.belongsTo(User, {
	as: 'owner',
	foreignKey: "owner_id"
});

User.hasMany(Club, {
	foreignKey: "owner_id"
});

// User to DirectMessage - one to many (sender) & one to many (recipient)
User.hasMany(DirectMessage, {
	foreignKey: "sender_id"
});

DirectMessage.belongsTo(User, {
	foreignKey: "sender_id"
});

User.hasMany(DirectMessage, {
	foreignKey: "recipient_id"
});

DirectMessage.belongsTo(User, {
	foreignKey: "recipient_id"
});

// Club to Discussion - one to many
Club.hasMany(DiscussionTopic, {
	foreignKey: "club_id"
});

DiscussionTopic.belongsTo(Club, {
	foreignKey: "club_id",
});

// Discussion to Comment - one to many
DiscussionTopic.hasMany(DiscussionComment, {
	foreignKey: "discussion_id"
});

DiscussionComment.belongsTo(DiscussionTopic, {
	foreignKey: "discussion_id",
});

// User to Comment - one to many
User.hasMany(DiscussionComment, {
	foreignKey: "user_id"
});

DiscussionComment.belongsTo(User, {
	foreignKey: "user_id",
});

// User to UserVerification - one to one
User.hasOne(UserVerification, {
	foreignKey: "user_id"
});

UserVerification.belongsTo(User, {
	foreignKey: "user_id",
});

module.exports = { User, BookRating, Club, ClubMember, DirectMessage, DiscussionTopic, DiscussionComment, UserVerification };
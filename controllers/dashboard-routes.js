const router = require('express').Router();
const sequelize = require('../config/connection');
const { BookRating, Club, User, DirectMessage, ClubMember, DiscussionTopic, DiscussionComment } = require('../models');
const { format_date } = require('../util/helpers');

router.get('/', (req, res) => {
        User.findOne({
            attributes: ['username', 'zipcode'],
            where: {
                id: req.session.user_id
            },
            include: [
                {
                    model: Club,
                    attributes: ['id', 'name', 'book_id', 'owner_id'],
                    as: 'clubs',
                    include: [
                        {
                            model: User,
                            attributes: ['username'],
                            as: 'owner'
                        },
                        {
                            model: ClubMember,
                            attributes: [
                                //[sequelize.fn('COUNT', sequelize.col('*')), 'member_count']
                                [sequelize.literal(`(
                                    SELECT COUNT(*)
                                    FROM club_member
                                    WHERE club_member.club_id = clubs.id
                                )`), 'member_count']
                            ]
                        },
                       {
                            model: DiscussionTopic,
                            attributes: [ 
                                //[sequelize.fn('COUNT', sequelize.col('title')), 'topic_count'],
                                [sequelize.literal(`(
                                    SELECT COUNT(*)
                                    FROM discussion_topic
                                    WHERE ${'`'}clubs->discussion_topics${'`'}.club_id = clubs.id
                                )`), 'topic_count'],
                                [sequelize.literal(`(
                                    SELECT MAX(created_at)
                                    FROM discussion_comment
                                    WHERE discussion_comment.discussion_id = ${'`'}clubs->discussion_topics${'`'}.id
                                )`), 'last_comment']
                            ],
                        }
                    ],
                },
                {
                    model: BookRating,
                    attributes: ['id', 'user_id', 'book_id', 'score']
                },
                {
                    model: DirectMessage
                }
            ]
        })
            .then(dbUserData => {
                const userData = dbUserData.get({ plain: true });
                // Get our club data in a usable format.
                userData.clubs.forEach((element) => {
                    element.member_count = (element.club_members.length) ? element.club_members[0].member_count : 0;
                    element.topic_count = (element.discussion_topics.length) ? element.discussion_topics[0].topic_count : 0;
                    element.last_comment = (element.discussion_topics.length) ? format_date(element.discussion_topics[0].last_comment) : 'Never';
                });
                console.log(userData);
                console.log(userData.clubs.map(element => element.discussion_topics));
                res.render('dashboard', { userData, loggedIn: true });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
});

module.exports = router;
const router = require('express').Router();
const { User, ClubMember, Club } = require('../../models')
const sequelize = require('../../config/connection');

//get all clubs
router.get('/', (req, res) => {
    Club.findAll()
    .then(dbClubData => res.json(dbClubData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//search club by name
router.get('/', (req, res) => {
    let lookupValue = req.body.query.toLowerCase();
    Club.findAll({
        limit: 20,
        where: {
            username: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + lookupValue + '%')
        },
        include: {
            model: User,
            attributes: ['username'],
            as: 'members'
        } 
    })
    .then(dbClubData => res.json(dbClubData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//get club by id
router.get('/:id', (req, res) => {
    Club.findOne({
        where: {
            id: req.params.id
        },
        include: {
            model: User,
            attributes: ['username'],
            as: 'members'
        } 
    })
    .then(dbClubData => {
        if (!dbClubData) {
        res.status(404).json({ message: 'No club found with this id' });
        return;
        }
        res.json(dbClubData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//create new club
router.post('/', (req, res) => {
    if (req.session) {
        Club.create({
            name: req.body.name,
            isbn: req.body.isbn,
            owner_id: req.session.user_id,
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
        //Automatically make owner a member of the club
        .then(dbClubData => {
            ClubMember.create({
                user_id: req.session.user_id,
                club_id: dbClubData.dataValues.id
            })//Return club data
            .then(dbClubMemberData => {
                Club.findOne({
                    where: {
                        id: dbClubMemberData.dataValues.club_id
                    },
                    include: {
                        model: User,
                        attributes: ['username'],
                        as: "members"
                    } 
                })
                .then(dbClubData => res.json(dbClubData))
                .catch(err => {
                    console.log(err);
                    res.status(500).json(err);
                });
            })
        })
    }
});

//add user to club
router.put('/add', (req, res) => {
    ClubMember.create({
        user_id: req.body.user_id,
        club_id: req.body.club_id
    })
    .then(() => {
        Club.findOne({
            where: {
                id: req.body.club_id
            },
            include: {
                model: User,
                attributes: ['username'],
                as: "members"
            } 
        })
        .then(dbClubData => res.json(dbClubData))
        .catch(err => res.json(err));
    })
});

//change club name/book
router.put('/:id', (req, res) => {
    Club.update(req.body, {
        where: {
            id: req.params.id
        }
    })
    .then(dbClubData => {
        if (!dbClubData[0]) {
        res.status(404).json({ message: 'No club found with this id' });
        return;
        }
        res.json(dbClubData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//delete club
router.delete('/:id', (req, res) => {
    Club.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbClubData => {
        if (!dbClubData) {
            res.status(404).json({ message: 'No club found with this id!' });
            return;
        }
        res.json(dbClubData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;

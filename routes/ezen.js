const express = require('express');
const router = express.Router();
const Alumni = require('../models/alumni');
const Ezen = require('../models/ezen')
const cron = require('node-cron');
const scrape = require('../scrollingEzen');


// get all the companies that are in the database
router.get('/', async (req, res) => {
    try {
        const companies = await Ezen.find().sort({name: 1});
        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ message: 'Error getting all companies with UCD alumnus' });
    }
});

// get the ten latest companies that are added in the database
router.get('/highest-funding', async (req, res) => {
    try {
        const companies = await Ezen.find();

        companies.sort(fundingSort);

        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ message: 'Error getting companies ' +
                'in highest funding order' });
    }
})


// get the companies with alumni
router.get('/companies-with-alumni', async (req, res) => {
    try {
        const companies =
            await Ezen.find({alumnis: {$ne: null}}).exec();
        if (companies.length === 0) {
            return res.status(204).end();
        }
        return res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ message : 'Error getting companies with alumni'})
    }
})


// get the companies that have their hq in California
router.get('/california', async (req, res) => {
    try {
        const companies = await Ezen.find({hq: {$regex: "CA"}}).sort({name: 1})
            .exec();

        if (companies.length === 0) {
            return res.status(204).json({message: "No companies with" +
                    " headquarters" +
                    " in CA"})
        }
        return res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({message: 'Error getting companies in CA'})
    }
})


router.get("/newest-companies", async (req, res) => {
    try {
        const companies = await Ezen.find().sort({foundingDate: -1}).exec();
        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({message: "Error getting newest companies"})
    }
})

router.get("/favorites", async (req, res) => {
    try {
        const favorites = await Ezen.find({favorite: true})
            .sort({name: 1}).exec();
        res.status(200).json(favorites);
    } catch (error) {
        res.status(500).json({message: "Error getting favorite companies"});
    }
})

router.get("/search", async (req, res) => {
    try {
        const { keyword, filters, sort } = req.query;

        let query = {}

        if (keyword) {
            const keywordSearchConditions = [
                {name: {$regex: keyword, $options: "i"}},
                {foundingDate: {$regex: keyword, $options: "i"}},
                {notableInvestors: {$regex: keyword, $options: "i"}},
                {industries: {$regex: keyword, $options: "i"}},
                {hq: {$regex: keyword, $options: "i"}}
            ];

            if (!query.$or) {
                query.$or = [];
            }

            keywordSearchConditions.forEach((condition) => {
                query.$or.push(condition);
            });
        }

        if (filters) {
            const parsedFilters = Array.isArray(filters)
                ? filters
                : JSON.parse(filters);

            if (Array.isArray(parsedFilters)) {
                const filterConditions = parsedFilters.map((filterValue) => {
                    const fields = [
                        "name",
                        "foundingDate",
                        "notableInvestors",
                        "industries",
                        "hq",
                    ];
                    const orConditions = fields.map((field) => ({
                        [field]: { $regex: filterValue, $options: "i" },
                    }));
                    return { $or: orConditions };
                });

                query.$or = query.$or
                    ? [...query.$or, ...filterConditions]
                    : filterConditions;
            }
        }

        let matchFound = await Ezen.find(query).sort({name: 1}).exec();

        if (sort) {
            switch (sort) {
                case 'highest-funding':
                    matchFound = matchFound.sort(fundingSort);
                    break;
                case 'companies-with-alumni':
                    matchFound = matchFound.filter(company => company.alumnis && company.alumnis.length > 0);
                    break;
                case 'california':
                    matchFound = matchFound.filter(company => /CA/.test(company.hq)).sort((a, b) => a.name.localeCompare(b.name));;
                    break;
                case 'newest-companies':
                    matchFound = matchFound.sort((a, b) => new Date(b.foundingDate) - new Date(a.foundingDate));
                    break;
                case 'favorites':
                    matchFound = matchFound.filter(company => company.favorite);
                    break;
            }
        }

        res.status(200).json(matchFound)
    } catch (error) {
        res.status(500).json({ message: "Error executing search request" });
    }
})


// Add new company and information
router.post('/', async (req, res) => {
    try {
        const company = new Ezen({
            name: req.body.name,
            foundingDate: req.body.foundingDate,
            notableInvestors: req.body.notableInvestors,
            hq: req.body.hq,
            totalFunding: req.body.totalFunding,
            fundingRecord: req.body.fundingRecord,
            founders: req.body.founders,
            alumnis: req.body.alumnis,
            bio: req.body.bio,
            ezenLink: req.body.ezenLink,
            industries: req.body.industries,
            favorite: req.body.favorite
        })
        await scrapeAndPost();
        company.save();
        res.status(201).json(company);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// Update company information, common use case should be to update alumni info
// received from LinkedIn
router.put('/', async (req, res) => {
    try {
        const {id} = req.params.id;
        const update = await Ezen.findByIdAndUpdate(id, req.body);
        if (!update) {
            return res.status(404).json({ message: "Not Found"})
        }
        return res.status(200).json(update);
    } catch (error) {
        res.status(500).json({ message: 'Error updating Ezen information.' });
    }
});


// favorite a company
router.put('/favorite', async (req, res) => {
    try {
        let ezen = await Ezen.findOne({ name: req.query.name });

        if (!ezen) {
            return res.status(404).json({ message: `${req.query.name} not found.` });
        }

        ezen.favorite = !ezen.favorite;
        await ezen.save();

        return res.status(200).json({ message: `${req.query.name} is now ${ezen.favorite ? "favorite" : "not favorite"}.` });

    } catch (error) {
        res.status(500).json({message: "Error updating favorite " +
                "status of " + req.query.name + "."});
    }
})


// Delete all equity zen information
router.delete('/', async (req, res) => {
    try {
        await Ezen.deleteMany({favorite: false});
        res.status(200).json({message : "All Equity Zen information deleted" +
                " succesfully."});
    } catch (error) {
        res.status(500).json({ message: 'Error deleting EquityZen information.' });
    }
});


// Delete one specific company
router.delete('/delete-one', async (req, res) => {
    try {

        const ezen = await Ezen.findOneAndDelete({ name: req.query.name });

        if (ezen === null) {
            console.log('Company not found');
            return res.status(404).json({ message: req.query.name + " not found." });
        }

        return res.status(200).json({ message: req.query.name + " deleted successfully." });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting " + req.query.name + " from database.", error: error.message });
    }
});


const findAlumni = async () => {
    try {
        const alumnis = await Alumni.find();
        const ezen = await Ezen.find();

        for (const alumni of alumnis) {
            const matchFound = ezen.find(ezenMatch => ezenMatch.name === alumni.company);

            if (matchFound) {
                matchFound.alumnis.push({ name: alumni.name, position:
                    alumni.job, url: alumni.url});
            }
        }
        console.log("Update completed successfully");
    } catch (error) {
        throw new Error("Error updating alumni list.");
    }
}

const passiveScraping = async() => {
    try {
        const results = await scrape();
        await Ezen.deleteMany({favorite: false });

        for(let result of results) {
            const company = new Ezen({
                name: result.name,
                foundingDate: result.foundingDate,
                notableInvestors: result.notableInvestors,
                hq: result.hq,
                totalFunding: result.totalFunding,
                founders: result.founders,
                alumnis: result.alumnis,
                bio: result.bio,
                ezenLink: result.ezenLink,
                industries: result.industries,
                favorite: result.favorite
            })
            company.save();
        }
    } catch (error) {
        console.error("Error scraping Equity Zen");
    }
}

const scrapeAndPost = async () => {
    try {
        await passiveScraping();
        await findAlumni();
    } catch (error) {
        console.error("Error in scrapeAndPost");
    }
}

const fundingSort = (a, b) => {
    return fundingParse(b.totalFunding) - fundingParse(a.totalFunding);
}
const fundingParse = (funding) => {

    if (funding === "") {
        return 0
    }

    const suffixes = {
        "K": 1000,
        "M": 1000000,
        "B": 1000000000,
        "T": 1000000000000
    }

    let amount = funding.slice(0, funding.length - 1);

    const suffix = funding[funding.length - 1]

    amount = parseFloat(amount);

    return amount*suffixes[suffix];
}

let timezone = 'America/Los_Angeles';
cron.schedule('0 0 * * 1', async () => {
    try {
        await scrapeAndPost();
        console.log('Scraping and posting completed successfully');
    } catch (error) {
        console.error('Error scraping data and posting to database, for' +
            ' cronjob');
    }
}, {
    timezone
});

if (process.env.NODE_ENV !== 'test') {
    cron.schedule('0 0 * * 1', async () => {
        try {
            await scrapeAndPost();
            console.log('Scraping and posting completed successfully');
        } catch (error) {
            console.error('Error scraping data and posting to database:', error.message);
        }
    })
}

module.exports = router;

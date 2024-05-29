const request = require('supertest');
const app = require('../../server');
const Alumni = require('../../models/alumni');
const Ezen = require('../../models/ezen');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const PrevAlumni = require("../../models/prevalumni");

let mongoServer;
let mongoConnection;

describe('EquityZen Routes', () => {
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const dbUri = mongoServer.getUri();
        mongoConnection = await mongoose.connect(dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        await Ezen.deleteMany({});
    });

    afterEach(async () => {
        if (mongoConnection) {
            const collections = await mongoConnection.connection.db.collections();
            for (const collection of collections) {
                await collection.drop();
            }
        }
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    it('should create a new company', async () => {
        const response = await request(app).post('/equity-zen').send({
            name: 'Test Company',
            foundingDate: '2022',
            notableInvestors: 'XYZ Ventures',
            hq: 'San Francisco, CA, US',
            totalFunding: '1.1M',
            founders: [
                {
                    position: "CEO",
                    name: "Ricky Bobby"
                },
                {
                    position: "CFO",
                    name: "Tingus Pingus"
                }
            ],
            alumnis: [
                {
                    name: "Mike Ross",
                    position: "Associate - Specter Litt",
                    url: "www.com.com"
                }
            ],
            bio: "Test Company is a test company for testing purposes.",
            ezenLink: "http://www.equityzen.com/testcompany",
            industries: ["Test1", "Test2"],
            favorite: true
        });

        expect(response.status).toBe(201);
        expect(response.body.name).toBe("Test Company");
        expect(response.body.favorite).toBe(true);
    });

    it('should get all companies', async () => {
        await Ezen.create({
            name: 'Test Company',
            foundingDate: '2022',
            notableInvestors: 'XYZ Ventures',
            hq: 'San Francisco, CA, US',
            totalFunding: '1.1M',
            founders: [
                {
                    position: "CEO",
                    name: "Ricky Bobby"
                },
                {
                    position: "CFO",
                    name: "Tingus Pingus"
                }
            ],
            alumnis: [
                {
                    name: "Mike Ross",
                    position: "Associate - Specter Litt",
                    url: "www.com.com"
                }
            ],
            bio: "Test Company is a test company for testing purposes.",
            ezenLink: "http://www.equityzen.com/testcompany",
            industries: ["Test1", "Test2"],
            favorite: true
        });

        const response = await request(app).get('/equity-zen');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].name).toBe("Test Company");
    })

    it('should get companies in highest order funding', async () => {
        await Ezen.create({
            name: 'Test Company 1',
            foundingDate: '2022',
            notableInvestors: 'XYZ Ventures',
            hq: 'San Francisco, CA, US',
            totalFunding: '2.2M',
            founders: [
                {
                    position: "CEO",
                    name: "Ricky Bobby"
                },
                {
                    position: "CFO",
                    name: "Tingus Pingus"
                }
            ],
            alumnis: [
                {
                    name: "Mike Ross",
                    position: "Associate - Specter Litt",
                    url: "www.com.com"
                }
            ],
            bio: "Test Company is a test company for testing purposes.",
            ezenLink: "http://www.equityzen.com/testcompany",
            industries: ["Test1", "Test2"],
            favorite: true
        });
        await Ezen.create({
            name: 'Test Company 2',
            foundingDate: '2022',
            notableInvestors: 'XYZ Ventures',
            hq: 'San Francisco, CA, US',
            totalFunding: '2.2B',
            founders: [
                {
                    position: "CEO",
                    name: "Ricky Bobby"
                },
                {
                    position: "CFO",
                    name: "Tingus Pingus"
                }
            ],
            alumnis: [
                {
                    name: "Mike Ross",
                    position: "Associate - Specter Litt",
                    url: "www.com.com"
                }
            ],
            bio: "Test Company is a test company for testing purposes.",
            ezenLink: "http://www.equityzen.com/testcompany",
            industries: ["Test1", "Test2"],
            favorite: true
        });

        const response = await request(app).get('/equity-zen/highest-funding')
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
        expect(response.body[0].totalFunding).toBe('2.2B');
        expect(response.body[1].totalFunding).toBe('2.2M');
    });

    it('should get companies with alumni', async () => {
        await Ezen.create({
            name: 'Test Company 1',
            foundingDate: '2022',
            notableInvestors: 'XYZ Ventures',
            hq: 'San Francisco, CA, US',
            totalFunding: '2.2M',
            founders: [
                {
                    position: "CEO",
                    name: "Ricky Bobby"
                },
                {
                    position: "CFO",
                    name: "Tingus Pingus"
                }
            ],
            alumnis: [],
            bio: "Test Company is a test company for testing purposes.",
            ezenLink: "http://www.equityzen.com/testcompany",
            industries: ["Test1", "Test2"],
            favorite: true
        });
        await Ezen.create({
            name: 'Test Company 2',
            foundingDate: '2022',
            notableInvestors: 'XYZ Ventures',
            hq: 'San Francisco, CA, US',
            totalFunding: '2.2B',
            founders: [
                {
                    position: "CEO",
                    name: "Ricky Bobby"
                },
                {
                    position: "CFO",
                    name: "Tingus Pingus"
                }
            ],
            alumnis: [
                {
                    name: "Mike Ross",
                    position: "Associate - Specter Litt",
                    url: "www.com.com"
                }
            ],
            bio: "Test Company is a test company for testing purposes.",
            ezenLink: "http://www.equityzen.com/testcompany",
            industries: ["Test1", "Test2"],
            favorite: true
        });

        const response = await request(app).get('/equity-zen/companies-with-alumni');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].alumnis[0].name).toBe("Mike Ross");
    });

    it('should get companies with headquarters in California', async () => {
        await Ezen.create({
            name: 'Test Company 1',
            foundingDate: '2022',
            notableInvestors: 'XYZ Ventures',
            hq: 'Houston, TX, US',
            totalFunding: '2.2M',
            founders: [
                {
                    position: "CEO",
                    name: "Ricky Bobby"
                },
                {
                    position: "CFO",
                    name: "Tingus Pingus"
                }
            ],
            alumnis: [],
            bio: "Test Company is a test company for testing purposes.",
            ezenLink: "http://www.equityzen.com/testcompany",
            industries: ["Test1", "Test2"],
            favorite: true
        });
        await Ezen.create({
            name: 'Test Company 2',
            foundingDate: '2022',
            notableInvestors: 'XYZ Ventures',
            hq: 'San Francisco, CA, US',
            totalFunding: '2.2B',
            founders: [
                {
                    position: "CEO",
                    name: "Ricky Bobby"
                },
                {
                    position: "CFO",
                    name: "Tingus Pingus"
                }
            ],
            alumnis: [
                {
                    name: "Mike Ross",
                    position: "Associate - Specter Litt",
                    url: "www.com.com"
                }
            ],
            bio: "Test Company is a test company for testing purposes.",
            ezenLink: "http://www.equityzen.com/testcompany",
            industries: ["Test1", "Test2"],
            favorite: true
        });

        const response = await request(app).get('/equity-zen/california');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].hq).toBe("San Francisco, CA, US");
    });

    it('should get companies in order of newest to oldest founding date', async () => {
        await Ezen.create({
            name: 'Test Company 1',
            foundingDate: '2024',
            notableInvestors: 'XYZ Ventures',
            hq: 'San Francisco, CA, US',
            totalFunding: '1.1M',
            founders: [
                {
                    position: "CEO",
                    name: "Ricky Bobby"
                },
                {
                    position: "CFO",
                    name: "Tingus Pingus"
                }
            ],
            alumnis: [
                {
                    name: "Mike Ross",
                    position: "Associate - Specter Litt",
                    url: "www.com.com"
                }
            ],
            bio: "Test Company is a test company for testing purposes.",
            ezenLink: "http://www.equityzen.com/testcompany",
            industries: ["Test1", "Test2"],
            favorite: true
        });
        await Ezen.create({
            name: 'Test Company 2',
            foundingDate: '2023',
            notableInvestors: 'XYZ Ventures',
            hq: 'San Francisco, CA, US',
            totalFunding: '1.1M',
            founders: [
                {
                    position: "CEO",
                    name: "Ricky Bobby"
                },
                {
                    position: "CFO",
                    name: "Tingus Pingus"
                }
            ],
            alumnis: [
                {
                    name: "Mike Ross",
                    position: "Associate - Specter Litt",
                    url: "www.com.com"
                }
            ],
            bio: "Test Company is a test company for testing purposes.",
            ezenLink: "http://www.equityzen.com/testcompany",
            industries: ["Test1", "Test2"],
            favorite: true
        });

        const response = await request(app).get('/equity-zen/newest-companies');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
        expect(response.body[0].foundingDate).toBe('2024')
        expect(response.body[0].foundingDate > response.body[1].foundingDate).toBe(true);
    });

    it('should get companies that have been favorited', async () => {
        await Ezen.create({
            name: 'Test Company 1',
            foundingDate: '2024',
            notableInvestors: 'XYZ Ventures',
            hq: 'San Francisco, CA, US',
            totalFunding: '1.1M',
            founders: [
                {
                    position: "CEO",
                    name: "Ricky Bobby"
                },
                {
                    position: "CFO",
                    name: "Tingus Pingus"
                }
            ],
            alumnis: [
                {
                    name: "Mike Ross",
                    position: "Associate - Specter Litt",
                    url: "www.com.com"
                }
            ],
            bio: "Test Company is a test company for testing purposes.",
            ezenLink: "http://www.equityzen.com/testcompany",
            industries: ["Test1", "Test2"],
            favorite: true
        });
        await Ezen.create({
            name: 'Test Company 2',
            foundingDate: '2023',
            notableInvestors: 'XYZ Ventures',
            hq: 'San Francisco, CA, US',
            totalFunding: '1.1M',
            founders: [
                {
                    position: "CEO",
                    name: "Ricky Bobby"
                },
                {
                    position: "CFO",
                    name: "Tingus Pingus"
                }
            ],
            alumnis: [
                {
                    name: "Mike Ross",
                    position: "Associate - Specter Litt",
                    url: "www.com.com"
                }
            ],
            bio: "Test Company is a test company for testing purposes.",
            ezenLink: "http://www.equityzen.com/testcompany",
            industries: ["Test1", "Test2"],
            favorite: false
        });

        const response = await request(app).get('/equity-zen/favorites');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].favorite).toBe(true);
        expect(response.body[0].name).toBe('Test Company 1');
    });

    it('should get companies based on drop down criteria', async () => {
        await Ezen.create({
            name: 'Test Company 1',
            foundingDate: '2024',
            notableInvestors: 'XYZ Ventures',
            hq: 'San Francisco, CA, US',
            totalFunding: '2.2M',
            founders: [
                {
                    position: "CEO",
                    name: "Ricky Bobby"
                },
                {
                    position: "CFO",
                    name: "Tingus Pingus"
                }
            ],
            alumnis: [
                {
                    name: "Mike Ross",
                    position: "Associate - Specter Litt",
                    url: "www.com.com"
                }
            ],
            bio: "Test Company is a test company for testing purposes.",
            ezenLink: "http://www.equityzen.com/testcompany",
            industries: ["Test1", "Test2"],
            favorite: true
        });
        await Ezen.create({
            name: 'Test Company 2',
            foundingDate: '2023',
            notableInvestors: 'XYZ Ventures',
            hq: 'San Francisco, CA, US',
            totalFunding: '1.1M',
            founders: [
                {
                    position: "CEO",
                    name: "Ricky Bobby"
                },
                {
                    position: "CFO",
                    name: "Tingus Pingus"
                }
            ],
            alumnis: [
                {
                    name: "Mike Ross",
                    position: "Associate - Specter Litt",
                    url: "www.com.com"
                }
            ],
            bio: "Test Company is a test company for testing purposes.",
            ezenLink: "http://www.equityzen.com/testcompany",
            industries: ["Test1", "Test2"],
            favorite: false
        });
        await Ezen.create({
            name: 'Test Company 3',
            foundingDate: '2023',
            notableInvestors: 'XYZ Ventures',
            hq: 'San Francisco, CA, US',
            totalFunding: '3.3M',
            founders: [
                {
                    position: "CEO",
                    name: "Ricky Bobby"
                },
                {
                    position: "CFO",
                    name: "Tingus Pingus"
                }
            ],
            alumnis: [
                {
                    name: "Mike Ross",
                    position: "Associate - Specter Litt",
                    url: "www.com.com"
                }
            ],
            bio: "Test Company is a test company for testing purposes.",
            ezenLink: "http://www.equityzen.com/testcompany",
            industries: ["Test1", "Test2"],
            favorite: false
        });

        const response = await request(app).get('/equity-zen/search?sort=highest-funding');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(3);
        expect(response.body[0].totalFunding).toBe('3.3M');
        expect(response.body[1].totalFunding).toBe('2.2M');
        expect(response.body[2].totalFunding).toBe('1.1M');

        const funding1 = parseFloat(response.body[0].totalFunding.replace('M', ''));
        const funding2 = parseFloat(response.body[1].totalFunding.replace('M', ''));
        const funding3 = parseFloat(response.body[2].totalFunding.replace('M', ''));

        expect(funding1).toBeGreaterThan(funding2);
        expect(funding2).toBeGreaterThan(funding3);
    });

    it('should search companies based on keywords', async () => {
        await Ezen.create({
            name: 'AI Company',
            foundingDate: '2024',
            notableInvestors: 'XYZ Ventures',
            hq: 'San Francisco, CA, US',
            totalFunding: '2.2M',
            founders: [
                {
                    position: "CEO",
                    name: "Ricky Bobby"
                },
                {
                    position: "CFO",
                    name: "Tingus Pingus"
                }
            ],
            alumnis: [
                {
                    name: "Mike Ross",
                    position: "Associate - Specter Litt",
                    url: "www.com.com"
                }
            ],
            bio: "Test Company is a test company for testing purposes.",
            ezenLink: "http://www.equityzen.com/testcompany",
            industries: ["Test1", "Test2"],
            favorite: true
        });
        await Ezen.create({
            name: 'ML AI Company',
            foundingDate: '2023',
            notableInvestors: 'XYZ Ventures',
            hq: 'San Francisco, CA, US',
            totalFunding: '1.1M',
            founders: [
                {
                    position: "CEO",
                    name: "Ricky Bobby"
                },
                {
                    position: "CFO",
                    name: "Tingus Pingus"
                }
            ],
            alumnis: [
                {
                    name: "Mike Ross",
                    position: "Associate - Specter Litt",
                    url: "www.com.com"
                }
            ],
            bio: "Test Company is a test company for testing purposes.",
            ezenLink: "http://www.equityzen.com/testcompany",
            industries: ["Test1", "Test2"],
            favorite: false
        });
        await Ezen.create({
            name: 'ML Company',
            foundingDate: '2023',
            notableInvestors: 'XYZ Ventures',
            hq: 'San Francisco, CA, US',
            totalFunding: '3.3M',
            founders: [
                {
                    position: "CEO",
                    name: "Ricky Bobby"
                },
                {
                    position: "CFO",
                    name: "Tingus Pingus"
                }
            ],
            alumnis: [
                {
                    name: "Mike Ross",
                    position: "Associate - Specter Litt",
                    url: "www.com.com"
                }
            ],
            bio: "Test Company is a test company for testing purposes.",
            ezenLink: "http://www.equityzen.com/testcompany",
            industries: ["Test1", "Test2"],
            favorite: false
        });

        const response = await request(app).get('/equity-zen/search?keyword=AI');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
        expect(response.body[0].name).toBe('AI Company');
        expect(response.body[1].name).toBe('ML AI Company');
    })

    it('should search companies based on keywords and drop down criteria', async () => {
        await Ezen.create({
            name: 'AI Company',
            foundingDate: '2024',
            notableInvestors: 'XYZ Ventures',
            hq: 'San Francisco, CA, US',
            totalFunding: '2.2M',
            founders: [
                {
                    position: "CEO",
                    name: "Ricky Bobby"
                },
                {
                    position: "CFO",
                    name: "Tingus Pingus"
                }
            ],
            alumnis: [
                {
                    name: "Mike Ross",
                    position: "Associate - Specter Litt",
                    url: "www.com.com"
                }
            ],
            bio: "Test Company is a test company for testing purposes.",
            ezenLink: "http://www.equityzen.com/testcompany",
            industries: ["Test1", "Test2"],
            favorite: true
        });
        await Ezen.create({
            name: 'ML AI Company',
            foundingDate: '2023',
            notableInvestors: 'XYZ Ventures',
            hq: 'San Francisco, CA, US',
            totalFunding: '1.1M',
            founders: [
                {
                    position: "CEO",
                    name: "Ricky Bobby"
                },
                {
                    position: "CFO",
                    name: "Tingus Pingus"
                }
            ],
            alumnis: [
                {
                    name: "Mike Ross",
                    position: "Associate - Specter Litt",
                    url: "www.com.com"
                }
            ],
            bio: "Test Company is a test company for testing purposes.",
            ezenLink: "http://www.equityzen.com/testcompany",
            industries: ["Test1", "Test2"],
            favorite: false
        });
        await Ezen.create({
            name: 'ML Company',
            foundingDate: '2023',
            notableInvestors: 'XYZ Ventures',
            hq: 'San Francisco, CA, US',
            totalFunding: '3.3M',
            founders: [
                {
                    position: "CEO",
                    name: "Ricky Bobby"
                },
                {
                    position: "CFO",
                    name: "Tingus Pingus"
                }
            ],
            alumnis: [
                {
                    name: "Mike Ross",
                    position: "Associate - Specter Litt",
                    url: "www.com.com"
                }
            ],
            bio: "Test Company is a test company for testing purposes.",
            ezenLink: "http://www.equityzen.com/testcompany",
            industries: ["Test1", "Test2"],
            favorite: false
        });

        const response = await request(app).get('/equity-zen/search?keyword=AI&sort=favorites');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].name).toBe('AI Company');
        expect(response.body[0].favorite).toBe(true);
    })

    it('should update an existing company to change one of the fields', async() => {
        await Ezen.create({
            name: 'AICompany',
            foundingDate: '2024',
            notableInvestors: 'XYZ Ventures',
            hq: 'San Francisco, CA, US',
            totalFunding: '2.2M',
            founders: [
                {
                    position: "CEO",
                    name: "Ricky Bobby"
                },
                {
                    position: "CFO",
                    name: "Tingus Pingus"
                }
            ],
            alumnis: [
                {
                    name: "Mike Ross",
                    position: "Associate - Specter Litt",
                    url: "www.com.com"
                }
            ],
            bio: "Test Company is a test company for testing purposes.",
            ezenLink: "http://www.equityzen.com/testcompany",
            industries: ["Test1", "Test2"],
            favorite: true
        });

        let response = await request(app).get("/equity-zen");
        expect(response.body[0].name).toBe("AICompany");

        await request(app).put("/equity-zen?name=AICompany").send(
            {name: "Updated Company"}
        );

        response = await request(app).get("/equity-zen");

        expect(response.status).toBe(200);
        expect(response.body[0].name).toBe("Updated Company");
    })

    it('should favorite an existing company', async() => {
        await Ezen.create({
            name: 'AICompany',
            foundingDate: '2024',
            notableInvestors: 'XYZ Ventures',
            hq: 'San Francisco, CA, US',
            totalFunding: '2.2M',
            founders: [
                {
                    position: "CEO",
                    name: "Ricky Bobby"
                },
                {
                    position: "CFO",
                    name: "Tingus Pingus"
                }
            ],
            alumnis: [
                {
                    name: "Mike Ross",
                    position: "Associate - Specter Litt",
                    url: "www.com.com"
                }
            ],
            bio: "Test Company is a test company for testing purposes.",
            ezenLink: "http://www.equityzen.com/testcompany",
            industries: ["Test1", "Test2"],
            favorite: false
        });

        let response = await request(app).get("/equity-zen");
        expect(response.body[0].favorite).toBe(false);

        await request(app).put("/equity-zen/favorite?name=AICompany");

        response = await request(app).get("/equity-zen");

        expect(response.status).toBe(200);
        expect(response.body[0].favorite).toBe(true);
    });

    it('should delete all non favorite companies in the database', async () => {
        await Ezen.create({
            name: 'AI Company',
            foundingDate: '2024',
            notableInvestors: 'XYZ Ventures',
            hq: 'San Francisco, CA, US',
            totalFunding: '2.2M',
            founders: [
                {
                    position: "CEO",
                    name: "Ricky Bobby"
                },
                {
                    position: "CFO",
                    name: "Tingus Pingus"
                }
            ],
            alumnis: [
                {
                    name: "Mike Ross",
                    position: "Associate - Specter Litt",
                    url: "www.com.com"
                }
            ],
            bio: "Test Company is a test company for testing purposes.",
            ezenLink: "http://www.equityzen.com/testcompany",
            industries: ["Test1", "Test2"],
            favorite: true
        });
        await Ezen.create({
            name: 'ML AI Company',
            foundingDate: '2023',
            notableInvestors: 'XYZ Ventures',
            hq: 'San Francisco, CA, US',
            totalFunding: '1.1M',
            founders: [
                {
                    position: "CEO",
                    name: "Ricky Bobby"
                },
                {
                    position: "CFO",
                    name: "Tingus Pingus"
                }
            ],
            alumnis: [
                {
                    name: "Mike Ross",
                    position: "Associate - Specter Litt",
                    url: "www.com.com"
                }
            ],
            bio: "Test Company is a test company for testing purposes.",
            ezenLink: "http://www.equityzen.com/testcompany",
            industries: ["Test1", "Test2"],
            favorite: false
        });
        await Ezen.create({
            name: 'ML Company',
            foundingDate: '2023',
            notableInvestors: 'XYZ Ventures',
            hq: 'San Francisco, CA, US',
            totalFunding: '3.3M',
            founders: [
                {
                    position: "CEO",
                    name: "Ricky Bobby"
                },
                {
                    position: "CFO",
                    name: "Tingus Pingus"
                }
            ],
            alumnis: [
                {
                    name: "Mike Ross",
                    position: "Associate - Specter Litt",
                    url: "www.com.com"
                }
            ],
            bio: "Test Company is a test company for testing purposes.",
            ezenLink: "http://www.equityzen.com/testcompany",
            industries: ["Test1", "Test2"],
            favorite: false
        });

        let response = await request(app).get('/equity-zen/');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(3);

        await request(app).delete('/equity-zen/')

        response = await request(app).get('/equity-zen/')
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1)
        expect(response.body[0].name).toBe("AI Company");
    });

    it('should delete one company by name', async () => {
        await Ezen.create({
            name: 'AICompany',
            foundingDate: '2024',
            notableInvestors: 'XYZ Ventures',
            hq: 'San Francisco, CA, US',
            totalFunding: '2.2M',
            founders: [
                {
                    position: "CEO",
                    name: "Ricky Bobby"
                },
                {
                    position: "CFO",
                    name: "Tingus Pingus"
                }
            ],
            alumnis: [
                {
                    name: "Mike Ross",
                    position: "Associate - Specter Litt",
                    url: "www.com.com"
                }
            ],
            bio: "Test Company is a test company for testing purposes.",
            ezenLink: "http://www.equityzen.com/testcompany",
            industries: ["Test1", "Test2"],
            favorite: false
        });

        let response = await request(app).get("/equity-zen");
        expect(response.body[0].name).toBe('AICompany');

        await request(app).delete("/equity-zen/delete-one?name=AICompany");

        response = await request(app).get("/equity-zen");

        expect(response.body.length).toBe(0);
    })
})
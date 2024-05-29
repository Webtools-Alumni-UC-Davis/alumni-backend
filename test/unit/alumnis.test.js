const request = require('supertest');
const app = require('../../server');
const Alumni = require('../../models/alumni');
const PrevAlumni = require('../../models/prevalumni');
const Subscriber = require('../../models/subscribers');
const Ezen = require('../../models/ezen');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let mongoConnection;

describe('Alumni Routes', () => {
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const dbUri = mongoServer.getUri();
        mongoConnection = await mongoose.connect(dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        await Alumni.deleteMany({});
        await PrevAlumni.deleteMany({});
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

    it('should create a new alumni', async () => {
        const response = await request(app).post('/alumnis').send({
            url: 'john-doe',
            name: 'John Doe',
            location: 'San Francisco, CA',
            job: 'Software Engineer',
            company: 'Google',
            graduationYear: 2020,
            major: 'Computer Science',
            otherEducation: 'MSc in Artificial Intelligence',
            otherJobs: ['Intern at Facebook', 'TA at Stanford University'],
            html: '<p>Profile description from LinkedIn</p>',
            errorParsing: false
        });
        expect(response.status).toBe(201);
        expect(response.body.name).toBe('John Doe');
        expect(response.body.job).toBe('Software Engineer');
    });

    it('should get all alumni with pagination', async () => {
        for (let i = 0; i < 15; i++) {
        await Alumni.create({
            url: `john-doe-${i}`,
            name: `John Doe ${i}`,
            location: 'San Francisco, CA',
            job: 'Software Engineer',
            company: 'Google',
            graduationYear: 2020,
            major: 'Computer Science',
            otherEducation: 'MSc in Artificial Intelligence',
            otherJobs: ['Intern at Facebook', 'TA at Stanford University'],
            html: '<p>Profile description from LinkedIn</p>',
            errorParsing: false
        });
        }

        const response = await request(app).get('/alumnis?page=1');
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(10);
        expect(response.body.pagination.total_pages).toBe(2);
    });

    it('should get all alumni', async () => {
        await Alumni.create({
            url: 'john-doe',
            name: 'John Doe',
            location: 'San Francisco, CA',
            job: 'Software Engineer',
            company: 'Google',
            graduationYear: 2020,
            major: 'Computer Science',
            otherEducation: 'MSc in Artificial Intelligence',
            otherJobs: ['Intern at Facebook', 'TA at Stanford University'],
            html: '<p>Profile description from LinkedIn</p>',
            errorParsing: false
        });
        const response = await request(app).get('/alumnis/allalumni');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].name).toBe('John Doe');
    });

    it('should get one specific alumni by URL', async () => {
        await Alumni.create({
            url: 'john-doe',
            name: 'John Doe',
            location: 'San Francisco, CA',
            job: 'Software Engineer',
            company: 'Google',
            graduationYear: 2020,
            major: 'Computer Science',
            otherEducation: 'MSc in Artificial Intelligence',
            otherJobs: ['Intern at Facebook', 'TA at Stanford University'],
            html: '<p>Profile description from LinkedIn</p>',
            errorParsing: false
        });
        const response = await request(app).get('/alumnis/specificalumni?url=john-doe');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].name).toBe('John Doe');
    });

    it('should update alumni information', async () => {
        await Alumni.create({
            url: 'john-doe',
            name: 'John Doe',
            location: 'San Francisco, CA',
            job: 'Software Engineer',
            company: 'Google',
            graduationYear: 2020,
            major: 'Computer Science',
            otherEducation: 'MSc in Artificial Intelligence',
            otherJobs: ['Intern at Facebook', 'TA at Stanford University'],
            html: '<p>Profile description from LinkedIn</p>',
            errorParsing: false
        });

        const response = await request(app).put('/alumnis/update').send({
            url: 'john-doe',
            name: 'Jonathan Doe',
            location: 'Mountain View, CA',
            job: 'Senior Software Engineer',
            company: 'Google',
            graduationYear: 2020,
            major: 'Computer Science',
            otherEducation: 'PhD in Computer Science',
            otherJobs: ['Intern at Facebook', 'TA at Stanford University', 'Researcher at MIT'],
            html: '<p>Updated profile description from LinkedIn</p>',
            errorParsing: true
        });
        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Jonathan Doe');
        expect(response.body.location).toBe('Mountain View, CA');
        expect(response.body.job).toBe('Senior Software Engineer');
        expect(response.body.company).toBe('Google');
        expect(response.body.graduationYear).toBe(2020);
        expect(response.body.major).toBe('Computer Science');
        expect(response.body.otherEducation).toBe('PhD in Computer Science');
        expect(response.body.otherJobs).toEqual(['Intern at Facebook', 'TA at Stanford University', 'Researcher at MIT']);
        expect(response.body.html).toBe('<p>Updated profile description from LinkedIn</p>');
        expect(response.body.errorParsing).toBe(true);
    });

    it('should get the count of all alumni', async () => {
        for (let i = 0; i < 15; i++) {
            await Alumni.create({
                url: `Alumni-${i}`,
                name: `Alumni ${i}`,
                location: 'San Francisco, CA',
                job: 'Software Engineer',
                company: 'Google',
                graduationYear: 2020 - i,
                major: 'Computer Science',
                otherEducation: 'MSc in Artificial Intelligence',
                otherJobs: ['Intern at Facebook', 'TA at Stanford University'],
                html: '<p>Profile description from LinkedIn</p>',
                errorParsing: false
            });
        }
    
        const response = await request(app).get('/alumnis/count');
        expect(response.status).toBe(200);
        expect(response.body.count).toBe(15);
    });
    
    it('should get the count of current year alumni', async () => {
        const currentYear = new Date().getFullYear();
        for (let i = 0; i < 5; i++) {
            await Alumni.create({
                url: `Alumni-${i}`,
                name: `Alumni ${i}`,
                location: 'San Francisco, CA',
                job: 'Software Engineer',
                company: 'Google',
                graduationYear: currentYear,
                major: 'Computer Science',
                otherEducation: 'MSc in Artificial Intelligence',
                otherJobs: ['Intern at Facebook', 'TA at Stanford University'],
                html: '<p>Profile description from LinkedIn</p>',
                errorParsing: false
            });
        }
        for (let i = 0; i < 15; i++) {
            await Alumni.create({
                url: `Alumni-${i}`,
                name: `Alumni ${i}`,
                location: 'San Francisco, CA',
                job: 'Software Engineer',
                company: 'Google',
                graduationYear: 2020 - i,
                major: 'Computer Science',
                otherEducation: 'MSc in Artificial Intelligence',
                otherJobs: ['Intern at Facebook', 'TA at Stanford University'],
                html: '<p>Profile description from LinkedIn</p>',
                errorParsing: false
            });
        }
    
        const response = await request(app).get('/alumnis/count/current');
        expect(response.status).toBe(200);
        expect(response.body.count).toBe(5);
    });

    it('should get all unique company names', async () => {
        await Alumni.create({
            url: 'john-doe',
            name: 'John Doe',
            location: 'San Francisco, CA',
            job: 'Software Engineer',
            company: 'Google',
            graduationYear: 2020,
            major: 'Computer Science',
            otherEducation: 'MSc in Artificial Intelligence',
            otherJobs: ['Intern at Facebook', 'TA at Stanford University'],
            html: '<p>Profile description from LinkedIn</p>',
            errorParsing: false
            });
        await Alumni.create({
            url: 'jane-smith',
            name: 'Jane Smith',
            location: 'New York, NY',
            job: 'Product Manager',
            company: 'Facebook',
            graduationYear: 2019,
            major: 'Business Administration',
            otherEducation: 'MBA',
            otherJobs: ['Intern at Amazon', 'Consultant at McKinsey'],
            html: '<p>Profile description from LinkedIn</p>',
            errorParsing: false
        });
        const response = await request(app).get('/alumnis/getAllCompanies');
        expect(response.status).toBe(200);
        expect(response.body).toContain('Google');
        expect(response.body).toContain('Facebook');
        });

    it('should search alumni based on keyword', async () => {
        await Alumni.create({
            url: 'john-doe',
            name: 'John Doe',
            location: 'San Francisco, CA',
            job: 'Software Engineer',
            company: 'Google',
            graduationYear: 2020,
            major: 'Computer Science',
            otherEducation: 'MSc in Artificial Intelligence',
            otherJobs: ['Intern at Facebook', 'TA at Stanford University'],
            html: '<p>Profile description from LinkedIn</p>',
            errorParsing: false
        });

        const response = await request(app).get('/alumnis/search?keyword=John');
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0].name).toBe('John Doe');
    });

    it('should search alumni based on keyword and graduation year', async () => {
        await Alumni.create({
            url: 'john-doe',
            name: 'John Doe',
            location: 'San Francisco, CA',
            job: 'Software Engineer',
            company: 'Google',
            graduationYear: 2020,
            major: 'Computer Science',
            otherEducation: 'MSc in Artificial Intelligence',
            otherJobs: ['Intern at Facebook', 'TA at Stanford University'],
            html: '<p>Profile description from LinkedIn</p>',
            errorParsing: false
        });
    
        const response = await request(app).get('/alumnis/search?keyword=John&graduationYear=2020');
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0].name).toBe('John Doe');
    });
    
    it('should search alumni based on keyword and pagination', async () => {
        await Alumni.create([
            {
                url: 'john-doe',
                name: 'John Doe',
                location: 'San Francisco, CA',
                job: 'Software Engineer',
                company: 'Google',
                graduationYear: 2020,
                major: 'Computer Science',
                otherEducation: 'MSc in Artificial Intelligence',
                otherJobs: ['Intern at Facebook', 'TA at Stanford University'],
                html: '<p>Profile description from LinkedIn</p>',
                errorParsing: false
            },
            {
                url: 'jane-smith',
                name: 'Jane Smith',
                location: 'New York, NY',
                job: 'Data Scientist',
                company: 'Microsoft',
                graduationYear: 2019,
                major: 'Computer Science',
                otherEducation: 'PhD in Machine Learning',
                otherJobs: ['Intern at Google', 'Researcher at MIT'],
                html: '<p>Profile description from LinkedIn</p>',
                errorParsing: false
            }
        ]);
    
        const response = await request(app).get('/alumnis/search?keyword=John&page=1');
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0].name).toBe('John Doe');
    });

    it('should search alumni based on keyword, graduation year, and pagination', async () => {
        await Alumni.create([
            {
                url: 'john-doe',
                name: 'John Doe',
                location: 'San Francisco, CA',
                job: 'Software Engineer',
                company: 'Google',
                graduationYear: 2020,
                major: 'Computer Science',
                otherEducation: 'MSc in Artificial Intelligence',
                otherJobs: ['Intern at Facebook', 'TA at Stanford University'],
                html: '<p>Profile description from LinkedIn</p>',
                errorParsing: false
            },
            {
                url: 'jane-smith',
                name: 'Jane Smith',
                location: 'New York, NY',
                job: 'Data Scientist',
                company: 'Microsoft',
                graduationYear: 2019,
                major: 'Computer Science',
                otherEducation: 'PhD in Machine Learning',
                otherJobs: ['Intern at Google', 'Researcher at MIT'],
                html: '<p>Profile description from LinkedIn</p>',
                errorParsing: false
            }
        ]);
    
        const response = await request(app).get('/alumnis/search?keyword=John&graduationYear=2020&page=1');
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0].name).toBe('John Doe');
    });
    
    it('should get top 5 companies', async () => {
        for (let i = 0; i < 10; i++) {
        const companyName = `Company ${i}`;
        await Alumni.create({
            url: `john-doe-${i}`,
            name: `John Doe ${i}`,
            location: 'San Francisco, CA',
            job: 'Software Engineer',
            company: companyName,
            graduationYear: 2020,
            major: 'Computer Science',
            otherEducation: 'MSc in Artificial Intelligence',
            otherJobs: ['Intern at Facebook', 'TA at Stanford University'],
            html: '<p>Profile description from LinkedIn</p>',
            errorParsing: false
        });
        }

        const response = await request(app).get('/alumnis/top-5-companies');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(5);
    });

    it('should get top 5 locations', async () => {
        const locations = ['New York, NY', 'San Francisco, CA', 'Los Angeles, CA', 'Chicago, IL', 'Boston, MA', 'San Diego, CA'];
        for (let i = 0; i < locations.length; i++) {
            await Alumni.create({
            url: `alumni-${i}`,
            name: `Alumni ${i}`,
            location: locations[i],
            job: 'Software Engineer',
            company: 'Google',
            graduationYear: 2020,
            major: 'Computer Science',
            otherEducation: 'MSc in Artificial Intelligence',
            otherJobs: ['Intern at Facebook', 'TA at Stanford University'],
            html: '<p>Profile description from LinkedIn</p>',
            errorParsing: false
            });
        }

        const response = await request(app).get('/alumnis/top-5-locations');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(5);
        });

    it('should get top 5 jobs', async () => {
        const jobs = ['Software Engineer', 'Product Manager', 'Data Scientist', 'Software Developer', 'Business Analyst', 'Electrical Engineer'];
        for (let i = 0; i < jobs.length; i++) {
            await Alumni.create({
                url: `alumni-${i}`,
                name: `Alumni ${i}`,
                location: 'San Francisco, CA',
                job: jobs[i],
                company: 'Google',
                graduationYear: 2020,
                major: 'Computer Science',
                otherEducation: 'MSc in Artificial Intelligence',
                otherJobs: ['Intern at Facebook', 'TA at Stanford University'],
                html: '<p>Profile description from LinkedIn</p>',
                errorParsing: false
            });
        }

        const response = await request(app).get('/alumnis/top-5-jobs');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(5);
        });

    it('should delete all alumni information', async () => {
        await Alumni.create({
            url: 'john-doe',
            name: 'John Doe',
            location: 'San Francisco, CA',
            job: 'Software Engineer',
            company: 'Google',
            graduationYear: 2020,
            major: 'Computer Science',
            otherEducation: 'MSc in Artificial Intelligence',
            otherJobs: ['Intern at Facebook', 'TA at Stanford University'],
            html: '<p>Profile description from LinkedIn</p>',
            errorParsing: false
        });
            const response = await request(app).delete('/alumnis');
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('All alumni information deleted successfully.');
        });
}); 


describe('Comparison of Alumni Data', () => {
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const dbUri = mongoServer.getUri();
        mongoConnection = await mongoose.connect(dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        await Alumni.deleteMany({});
        await PrevAlumni.deleteMany({});
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

    it('should identify no changes', async () => {
        const alumniData = {
            name: 'John Doe',
            location: 'San Francisco, CA',
            job: 'Software Engineer',
            company: 'Google',
            graduationYear: 2020,
            major: 'Computer Science',
            url: 'john-doe',
            errorParsing: false
        };
        await Alumni.create(alumniData);
        await PrevAlumni.create(alumniData);

        const response = await request(app).get('/compare');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('should identify changes in position', async () => {
        const currentAlumni = {
            name: 'John Doe',
            location: 'San Francisco, CA',
            job: 'Senior Software Engineer',
            company: 'Google',
            graduationYear: 2020,
            major: 'Computer Science',
            url: 'john-doe',
            errorParsing: false
        };
        const previousAlumni = {
            name: 'John Doe',
            location: 'San Francisco, CA',
            job: 'Software Engineer',
            company: 'Google',
            graduationYear: 2020,
            major: 'Computer Science',
            url: 'john-doe',
            errorParsing: false
        };
        await Alumni.create(currentAlumni);
        await PrevAlumni.create(previousAlumni);

        const response = await request(app).get('/compare');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            'John Doe has changed position from Software Engineer to Senior Software Engineer at Google.'
        ]);
    });

    it('should identify changes in company', async () => {
        const currentAlumni = {
            name: 'John Doe',
            location: 'San Francisco, CA',
            job: 'Software Engineer',
            company: 'Apple',
            graduationYear: 2020,
            major: 'Computer Science',
            url: 'john-doe',
            errorParsing: false
        };
        const previousAlumni = {
            name: 'John Doe',
            location: 'San Francisco, CA',
            job: 'Software Engineer',
            company: 'Google',
            graduationYear: 2020,
            major: 'Computer Science',
            url: 'john-doe',
            errorParsing: false
        };
        await Alumni.create(currentAlumni);
        await PrevAlumni.create(previousAlumni);

        const response = await request(app).get('/compare');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            'John Doe moved companies from Google to Apple.'
        ]);
    });

    it('should identify changes in location', async () => {
        const currentAlumni = {
            name: 'John Doe',
            location: 'New York, NY',
            job: 'Software Engineer',
            company: 'Google',
            graduationYear: 2020,
            major: 'Computer Science',
            url: 'john-doe',
            errorParsing: false
        };
        const previousAlumni = {
            name: 'John Doe',
            location: 'San Francisco, CA',
            job: 'Software Engineer',
            company: 'Google',
            graduationYear: 2020,
            major: 'Computer Science',
            url: 'john-doe',
            errorParsing: false
        };
        await Alumni.create(currentAlumni);
        await PrevAlumni.create(previousAlumni);

        const response = await request(app).get('/compare');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            'John Doe changed location from San Francisco, CA to New York, NY.'
        ]);
    });

    it('should identify starting a new job', async () => {
        const currentAlumni = {
            name: 'John Doe',
            location: 'San Jose, CA',
            job: 'Senior Software Engineer',
            company: 'Nvidia',
            graduationYear: 2020,
            major: 'Computer Science',
            url: 'john-doe',
            errorParsing: false
        };
        const previousAlumni = {
            name: 'John Doe',
            location: 'San Jose, CA',
            job: 'Software Engineer',
            company: 'Google',
            graduationYear: 2020,
            major: 'Computer Science',
            url: 'john-doe',
            errorParsing: false
        };
        await Alumni.create(currentAlumni);
        await PrevAlumni.create(previousAlumni);

        const response = await request(app).get('/compare');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            'John Doe moved companies from Google to Nvidia.',
            'John Doe has started a new job at Nvidia as a Senior Software Engineer.'
        ]);
    });
    it('should identify multiple changes and movements', async () => {
        const currentAlumni = [
            {
                name: 'John Doe',
                location: 'San Francisco, CA',
                job: 'Senior Software Engineer',
                company: 'Google',
                graduationYear: 2020,
                major: 'Computer Science',
                url: 'john-doe',
                errorParsing: false
            },
            {
                name: 'Jane Smith',
                location: 'New York, NY',
                job: 'Software Engineer',
                company: 'Microsoft',
                graduationYear: 2018,
                major: 'Electrical Engineering',
                url: 'jane-smith',
                errorParsing: false
            }
        ];
    
        const previousAlumni = [
            {
                name: 'John Doe',
                location: 'San Francisco, CA',
                job: 'Software Engineer',
                company: 'Google',
                graduationYear: 2020,
                major: 'Computer Science',
                url: 'john-doe',
                errorParsing: false
            },
            {
                name: 'Jane Smith',
                location: 'Los Angeles, CA',
                job: 'Systems Analyst',
                company: 'Apple',
                graduationYear: 2018,
                major: 'Electrical Engineering',
                url: 'jane-smith',
                errorParsing: false
            }
        ];
    
        await Alumni.insertMany(currentAlumni);
        await PrevAlumni.insertMany(previousAlumni);
    
        const response = await request(app).get('/compare');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            'John Doe has changed position from Software Engineer to Senior Software Engineer at Google.',
            'Jane Smith moved companies from Apple to Microsoft.',
            'Jane Smith changed location from Los Angeles, CA to New York, NY.',
            'Jane Smith has started a new job at Microsoft as a Software Engineer.'
        ]);
    });    
});

describe('Previous Alumni Routes', () => {
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const dbUri = mongoServer.getUri();
        mongoConnection = await mongoose.connect(dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        await Alumni.deleteMany({});
        await PrevAlumni.deleteMany({});
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

    it('should get all previous alumni', async () => {
        const alumniData = [
            {
                url: 'john-doe',
                name: 'John Doe',
                location: 'San Francisco, CA',
                job: 'Software Engineer',
                company: 'Google',
                graduationYear: 2020,
                major: 'Computer Science',
                errorParsing: false
            },
            {
                url: 'jane-smith',
                name: 'Jane Smith',
                location: 'New York, NY',
                job: 'Product Manager',
                company: 'Microsoft',
                graduationYear: 2019,
                major: 'Business Administration',
                errorParsing: false
            }
        ];
        await PrevAlumni.insertMany(alumniData);

        const response = await request(app).get('/prevalumnis');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
    });

    it('should delete all previous alumni', async () => {
        const alumniData = [
            {
                url: 'john-doe',
                name: 'John Doe',
                location: 'San Francisco, CA',
                job: 'Software Engineer',
                company: 'Google',
                graduationYear: 2020,
                major: 'Computer Science',
                errorParsing: false
            },
            {
                url: 'jane-smith',
                name: 'Jane Smith',
                location: 'New York, NY',
                job: 'Product Manager',
                company: 'Microsoft',
                graduationYear: 2019,
                major: 'Business Administration',
                errorParsing: false
            }
        ];
        await PrevAlumni.insertMany(alumniData);

        const response = await request(app).delete('/prevalumnis');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('All alumni information deleted successfully.');
        const allAlumni = await PrevAlumni.find();
        expect(allAlumni.length).toBe(0);
    });

    it('should handle errors when getting previous alumni', async () => {
        jest.spyOn(PrevAlumni, 'find').mockImplementationOnce(() => {
            throw new Error('Mock error while fetching previous alumni');
        });

        const response = await request(app).get('/prevalumnis');
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Error getting all alumni information.');
    });

    it('should handle errors when deleting previous alumni', async () => {
        jest.spyOn(PrevAlumni, 'deleteMany').mockImplementationOnce(() => {
            throw new Error('Mock error while deleting previous alumni');
        });

        const response = await request(app).delete('/prevalumnis');
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Error deleting all alumni information.');
    });
});

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

describe('Subscriber Routes', () => {
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const dbUri = mongoServer.getUri();
        await mongoose.connect(dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterEach(async () => {
        const collections = await mongoose.connection.db.collections();
        for (const collection of collections) {
            await collection.drop();
        }
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    it('should check subscription status', async () => {
        const subscriberData = {
            email: 'test@example.com',
            name: 'Test User',
            subscribed: true,
        };
        await Subscriber.create(subscriberData);

        const response = await request(app).get('/emails/check-subscription?email=test@example.com');
        expect(response.status).toBe(200);
        expect(response.body.subscribed).toBe(true);
    });

    it('should handle error when checking subscription status without email', async () => {
        const response = await request(app).get('/emails/check-subscription');
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Email is required');
    });

    it('should subscribe to email notifications', async () => {
        const subscriberData = {
            email: 'subscribe@example.com',
            name: 'Subscribe User',
        };

        const response = await request(app).post('/emails/subscribe').send(subscriberData);
        expect(response.status).toBe(200);

        const subscriber = await Subscriber.findOne({ email: 'subscribe@example.com' });
        expect(subscriber).not.toBeNull();
        expect(subscriber.subscribed).toBe(true);
    });

    it('should unsubscribe from email notifications', async () => {
        const subscriberData = {
            email: 'unsubscribe@example.com',
            name: 'Unsubscribe User',
            subscribed: true,
        };
        await Subscriber.create(subscriberData);

        const response = await request(app).post('/emails/unsubscribe').send({ email: 'unsubscribe@example.com' });
        expect(response.status).toBe(200);

        const subscriber = await Subscriber.findOne({ email: 'unsubscribe@example.com' });
        expect(subscriber).not.toBeNull();
        expect(subscriber.subscribed).toBe(false);
    });

    it('should handle errors when subscribing to email notifications', async () => {
        jest.spyOn(Subscriber.prototype, 'save').mockImplementationOnce(() => {
            throw new Error('Mock error while subscribing');
        });

        const subscriberData = {
            email: 'error@example.com',
            name: 'Error User',
        };

        const response = await request(app).post('/emails/subscribe').send(subscriberData);
        expect(response.status).toBe(500);
    });

    it('should handle errors when unsubscribing from email notifications', async () => {
        jest.spyOn(Subscriber, 'findOne').mockImplementationOnce(() => {
            throw new Error('Mock error while unsubscribing');
        });

        const response = await request(app).post('/emails/unsubscribe').send({ email: 'error@example.com' });
        expect(response.status).toBe(500);
    });
});
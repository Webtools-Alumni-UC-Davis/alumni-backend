## **Getting Started with Testing**

This guide will provide you with all the necessary information to get
started with testing both the backend and frontend of the application.
Here, we will introduce the technologies and libraries used, explain how
to set them up, and provide some basic usage examples to help you get
started quickly.

### **Technologies and Libraries**

#### **Backend**

-   **Jest**: Jest is a JavaScript testing framework with a focus on
    simplicity. It works with projects using Babel, TypeScript, Node.js,
    React, Angular, Vue.js, and more. Jest is used to create unit tests
    that focus on individual pieces of code, such as functions or
    classes, ensuring they work as expected. It is also used for
    integration tests, which check if different parts of the application
    work together as intended.

-   **Supertest**: Supertest provides a high-level abstraction for
    testing HTTP, while still allowing you to drop down to the
    lower-level API provided by superagent. This is crucial for testing
    API endpoints to ensure they return the expected results, handle
    errors correctly, and work seamlessly with other parts of the
    application. Supertest makes it easier to simulate HTTP requests and
    verify the responses in your tests.

-   **\@shelf/jest-mongodb**: A Jest preset that simplifies the setup
    and use of an in-memory MongoDB server during tests, ensuring
    database isolation.

-   **mongodb-memory-server**: An in-memory MongoDB server for testing,
    which allows you to run a fully isolated instance of MongoDB for
    each test suite.

### **Backend Setup**

**Install Jest and Supertest**

```
npm install \--save-dev jest supertest \@shelf/jest-mongodb
mongodb-memory-server
```

**Configure Jest**\
**In your package.json, add the following configuration**:

```
{

\"scripts\": {

\"test\": \"jest\"

},

\"jest\": {

\"preset\": \"@shelf/jest-mongodb\",

\"testEnvironment\": \"node\"

}

}
```

**Create a Test File**\
**Create a file named example.test.js in your tests folder:**

```
    const request = require(\'supertest\');

    const mongoose = require(\'mongoose\');

    const { MongoMemoryServer } = require(\'mongodb-memory-server\');

    const app = require(\'../app\'); // your express app

    let mongoServer;
```

```
    beforeAll(async () =\> {

        mongoServer = await MongoMemoryServer.create();

        const dbUri = mongoServer.getUri();

        await mongoose.connect(dbUri, {

        useNewUrlParser: true,

        useUnifiedTopology: true,

        });

    });
```

```
    afterEach(async () =\> {

        const collections = await mongoose.connection.db.collections();

        for (const collection of collections) {

        await collection.drop();

        }

    });

    afterAll(async () =\> {

        await mongoose.disconnect();

        await mongoServer.stop();

    });
```

```
    describe(\'GET /\', () =\> {

        it(\'responds with json\', async () =\> {

        const response = await request(app).get(\'/\');

        expect(response.status).toBe(200);

        expect(response.body.message).toBe(\'Hello World\');

        });

    });
```
```
// Ensure the server shuts down after tests complete

    setTimeout(() =\> {

            server.close(() =\> {

            process.exit(0);

        });

    }, 60000);
```

**Run Tests**

`npm run test`

## **Understanding the Tests**

#### **Backend Tests with Jest and Supertest**

**Describe Block**: This groups together several related tests. In our
example, we are testing the root route (/).

**It Block**: This defines a single test. Each it block contains a test
case with an expected outcome.

**Request**: Supertest\'s request function initiates an HTTP request to
our Express app.

**Expect**: Jest\'s expect function asserts that the response meets the
specified conditions.

**beforeAll / afterEach**: Functions that run before all tests or after
each test, respectively, to set up or tear down any necessary state.

### **Tips for Writing Tests**

-   **Keep Tests Simple**: Each test should focus on one piece of
    functionality.

-   **Use Descriptive Names**: Name your test cases and test blocks
    clearly to describe what they are testing.

-   **Mock External Dependencies**: Use Jest\'s mocking capabilities to
    mock external services or modules.

-   **Run Tests Frequently**: Run your tests often to catch issues early
    in the development process.

# **Test Cases and Results with Jest**

## **Overview**

The provided test files cover various components and functionalities of
a web application built with React. These tests are written using Jest
as the testing framework and React Testing Library for rendering and
interacting with the React components. The tests cover different aspects
of the application, including:

-   Alumni Routes: Testing the API endpoints related to alumni data
    management.

-   Comparison of Alumni Data: Testing the functionality to compare the
    current alumni data with the previous data and identify changes.

-   Previous Alumni Routes: Testing the API endpoints related to
    managing previous alumni data.

-   Directory Components: Testing various components used in the alumni
    directory, such as the header, search form, alumni list, and
    pagination.

-   Export Components: Testing components related to exporting alumni
    data as a CSV file.

-   Dashboard Components: Testing components that display various
    statistics and visualizations related to alumni data.

-   Layout and Navigation: Testing the layout and navigation components
    of the application.

-   Recommendations Components: Testing components that suggest
    companies based on alumni data.

-   Settings Components: Testing components related to user settings and
    subscription management.

## **Known Issues and Limitations**

While the provided tests cover a wide range of scenarios, there are some
known issues and limitations to consider:

1.  **Mocking External Dependencies**: Some tests rely on mocking
    external dependencies, such as the fetch function for making API
    calls. While this approach allows for testing without relying on
    actual API responses, it may not accurately reflect the behavior of
    the real API or handle edge cases that could occur in production.

2.  **Snapshot Testing**: The tests do not include snapshot testing,
    which can be useful for ensuring that components render correctly
    and catching unintended changes in their structure or output.

3.  **Test Coverage**: While the tests cover many components and
    functionalities, there may be areas of the application that are not
    thoroughly tested or have missing test cases.

4.  **Integration Testing**: The tests focus primarily on unit testing
    individual components or functions. While this is valuable, it may
    not catch issues that arise from the integration of multiple
    components or modules working together.

5.  **End-to-End Testing**: The tests do not include end-to-end testing,
    which simulates user interactions with the application from start to
    finish and can catch issues that may not be apparent in isolated
    unit tests.

## **How It Works**

The tests in these files are written using Jest. Jest is a JavaScript testing framework developed by Facebook.

Here\'s a high-level overview of how the tests work:

1.  **Setup**: Before running the tests, Jest sets up the testing
    environment by mocking any external dependencies or APIs that the
    components rely on. This is done using Jest\'s mocking capabilities
    and the global.fetch mock.

2.  **Cleanup**: After each test case, Jest cleans up the testing
    environment by removing any rendered components or mocked data to
    ensure a clean slate for the next test case.

## **What to Expect and Make Test Cases**

When writing test cases with Jest, you should
expect the following:

1.  **Isolated Component Testing**: Test cases should focus on testing
    individual components in isolation, ensuring they render correctly
    and behave as expected based on various inputs and user
    interactions.

Here are some examples of test cases you could write using Jest:

-   Test that a component renders correctly with different props or
    state.

-   Test that user interactions (e.g., clicking a button, submitting a
    form) trigger the expected behavior or state changes.

-   Test that asynchronous operations (e.g., API calls, data fetching)
    are handled correctly and that components update as expected when
    data is loaded.

-   Test that error states or edge cases are handled gracefully by the
    components.

-   Test that accessibility requirements are met (e.g., proper labeling,
    keyboard navigation).

-   Test that components are correctly unmounted and any side effects
    are cleaned up.

# **Alumni Routes**

## **should create a new alumni**

This test case verifies that a new alumni can be created successfully
through the API endpoint /alumnis.

**Test Scenario:**

-   The test sends a POST request to the /alumnis endpoint with a
    payload containing alumni data such as name, location, job, company,
    graduation year, major, and other relevant information.

-   It expects the response to have a status code of 201 (Created).

-   It asserts that the response body contains the correct name and job
    properties for the created alumni.

**Expected Behavior:**

-   A new alumni document should be created in the database with the
    provided data.

-   The API should respond with a 201 status code and the created alumni
    data in the response body.

**Possible Issues:**

-   If the API endpoint is not functioning correctly or the payload is
    invalid, the test may fail.

-   If the database connection or operations fail, the test may also
    fail.

## **should get all alumni with pagination**

This test case verifies that the API endpoint for retrieving all alumni
data with pagination works correctly.

**Test Scenario:**

-   The test creates 15 dummy alumni documents in the database before
    running the test.

-   It sends a GET request to the /alumnis endpoint with the page=1
    query parameter.

-   It expects the response to have a status code of 200 (OK).

-   It asserts that the response body contains an array of 10 alumni
    data (the default page size).

-   It asserts that the response body includes pagination information,
    specifically the total_pages property, which should be 2 for the 15
    alumni documents.

**Expected Behavior:**

-   The API should retrieve the alumni data from the database and
    paginate the results based on the requested page number.

-   The response should contain the alumni data for the requested page
    and the total number of pages.

**Possible Issues:**

-   If the API endpoint or pagination logic is not functioning
    correctly, the test may fail.

-   If the database operations fail or the dummy data creation fails,
    the test may also fail.

## **should get all alumni**

This test case verifies that the API endpoint for retrieving all alumni
data without pagination works correctly.

**Test Scenario:**

-   The test creates a single dummy alumni document in the database
    before running the test.

-   It sends a GET request to the /alumnis/allalumni endpoint.

-   It expects the response to have a status code of 200 (OK).

-   It asserts that the response body is an array with a length of 1.

-   It asserts that the response body contains the correct alumni name.

**Expected Behavior:**

-   The API should retrieve all alumni data from the database without
    pagination.

-   The response should contain an array with all the alumni documents.

**Possible Issues:**

-   If the API endpoint or the database operations fail, the test may
    fail.

-   If the dummy data creation fails, the test may also fail.

## **should get one specific alumni by URL**

This test case verifies that the API endpoint for retrieving a specific
alumni by their URL works correctly.

**Test Scenario:**

-   The test creates a single dummy alumni document in the database
    before running the test.

-   It sends a GET request to the /alumnis/specificalumni endpoint with
    the url query parameter set to the URL of the created alumni.

-   It expects the response to have a status code of 200 (OK).

-   It asserts that the response body is an array with a length of 1.

-   It asserts that the response body contains the correct alumni name.

**Expected Behavior:**

-   The API should retrieve the specific alumni data from the database
    based on the provided URL.

-   The response should contain an array with the matching alumni
    document.

**Possible Issues:**

-   If the API endpoint or the database operations fail, the test may
    fail.

-   If the dummy data creation fails or the provided URL is invalid, the
    test may also fail.

## **should update alumni information**

This test case verifies that the API endpoint for updating alumni
information works correctly.

**Test Scenario:**

-   The test creates a single dummy alumni document in the database
    before running the test.

-   It sends a PUT request to the /alumnis/update endpoint with a
    payload containing updated alumni data, such as name, location, job,
    company, other education, and other jobs.

-   It expects the response to have a status code of 200 (OK).

-   It asserts that the response body contains the updated alumni data,
    including the new name, location, job, company, other education,
    other jobs, and error parsing flag.

**Expected Behavior:**

-   The API should update the existing alumni document in the database
    with the provided data.

-   The response should contain the updated alumni data.

**Possible Issues:**

-   If the API endpoint or the database operations fail, the test may
    fail.

-   If the dummy data creation fails or the provided payload is invalid,
    the test may also fail.

## **should get the count of all alumni**

This test case verifies that the API endpoint for retrieving the count
of all alumni works correctly.

**Test Scenario:**

-   The test creates 15 dummy alumni documents in the database before
    running the test.

-   It sends a GET request to the /alumnis/count endpoint.

-   It expects the response to have a status code of 200 (OK).

-   It asserts that the response body contains a count property with the
    value of 15.

**Expected Behavior:**

-   The API should retrieve the count of all alumni documents from the
    database.

-   The response should contain the total count of alumni.

**Possible Issues:**

-   If the API endpoint or the database operations fail, the test may
    fail.

-   If the dummy data creation fails, the test may also fail.

## **should get the count of current year alumni**

This test case verifies that the API endpoint for retrieving the count
of alumni from the current year works correctly.

**Test Scenario:**

-   The test creates 5 dummy alumni documents with the current year as
    the graduation year, and 15 dummy alumni documents with graduation
    years in the past.

-   It sends a GET request to the /alumnis/count/current endpoint.

-   It expects the response to have a status code of 200 (OK).

-   It asserts that the response body contains a count property with the
    value of 5.

**Expected Behavior:**

-   The API should retrieve the count of alumni documents from the
    current year based on the graduation year.

-   The response should contain the count of current year alumni.

**Possible Issues:**

-   If the API endpoint or the database operations fail, the test may
    fail.

-   If the dummy data creation fails or the current year calculation is
    incorrect, the test may also fail.

## **should get all unique company names**

This test case verifies that the API endpoint for retrieving all unique
company names works correctly.

**Test Scenario:**

-   The test creates two dummy alumni documents with different company
    names in the database before running the test.

-   It sends a GET request to the /alumnis/getAllCompanies endpoint.

-   It expects the response to have a status code of 200 (OK).

-   It asserts that the response body contains the two company names
    created in the dummy data.

**Expected Behavior:**

-   The API should retrieve all unique company names from the alumni
    documents in the database.

-   The response should contain an array with the unique company names.

**Possible Issues:**

-   If the API endpoint or the database operations fail, the test may
    fail.

-   If the dummy data creation fails or the company names are not
    unique, the test may also fail.

## **should search alumni based on keyword**

This test case verifies that the API endpoint for searching alumni based
on a keyword works correctly.

**Test Scenario:**

-   The test creates a single dummy alumni document in the database
    before running the test.

-   It sends a GET request to the /alumnis/search endpoint with the
    keyword query parameter set to a part of the alumni\'s name.

-   It expects the response to have a status code of 200 (OK).

-   It asserts that the response body contains a data property, which is
    an array with a length of 1.

-   It asserts that the response body contains the correct alumni name.

**Expected Behavior:**

-   The API should search for alumni documents in the database based on
    the provided keyword.

-   The response should contain an array of alumni documents that match
    the keyword search.

**Possible Issues:**

-   If the API endpoint or the database operations fail, the test may
    fail.

-   If the dummy data creation fails or the provided keyword is invalid,
    the test may also fail.

## **should search alumni based on keyword and graduation year**

**Test Scenario:**

-   The test creates a single dummy alumni document in the database
    before running the test.

-   It sends a GET request to the /alumnis/search endpoint with the
    keyword and graduationYear query parameters set to a part of the
    alumni\'s name and the graduation year, respectively.

-   It expects the response to have a status code of 200 (OK).

-   It asserts that the response body contains a data property, which is
    an array with a length of 1.

-   It asserts that the response body contains the correct alumni name.

**Expected Behavior:**

-   The API should search for alumni documents in the database based on
    the provided keyword and graduation year.

-   The response should contain an array of alumni documents that match
    both the keyword search and the graduation year.

**Possible Issues:**

-   If the API endpoint or the database operations fail, the test may
    fail.

-   If the dummy data creation fails or the provided keyword or
    graduation year is invalid, the test may also fail.

## **should search alumni based on keyword and pagination**

This test case verifies that the API endpoint for searching alumni based
on a keyword and pagination works correctly.

**Test Scenario:**

-   The test creates two dummy alumni documents in the database before
    running the test.

-   It sends a GET request to the /alumnis/search endpoint with the
    keyword query parameter set to a part of one of the alumni\'s names,
    and the page query parameter set to 1.

-   It expects the response to have a status code of 200 (OK).

-   It asserts that the response body contains a data property, which is
    an array with a length of 1.

-   It asserts that the response body contains the correct alumni name.

**Expected Behavior:**

-   The API should search for alumni documents in the database based on
    the provided keyword and apply pagination to the results.

-   The response should contain an array of alumni documents that match
    the keyword search, with the results paginated based on the
    requested page number.

**Possible Issues:**

-   If the API endpoint or the database operations fail, the test may
    fail.

-   If the dummy data creation fails or the provided keyword or page
    number is invalid, the test may also fail.

## **should search alumni based on keyword, graduation year, and pagination**

This test case verifies that the API endpoint for searching alumni based
on a keyword, graduation year, and pagination works correctly.

**Test Scenario:**

-   The test creates two dummy alumni documents in the database before
    running the test.

-   It sends a GET request to the /alumnis/search endpoint with the
    keyword, graduationYear, and page query parameters set to a part of
    one of the alumni\'s names, the graduation year, and page number 1,
    respectively.

-   It expects the response to have a status code of 200 (OK).

-   It asserts that the response body contains a data property, which is
    an array with a length of 1.

-   It asserts that the response body contains the correct alumni name.

**Expected Behavior:**

-   The API should search for alumni documents in the database based on
    the provided keyword, graduation year, and apply pagination to the
    results.

-   The response should contain an array of alumni documents that match
    the keyword search, graduation year, and with the results paginated
    based on the requested page number.

**Possible Issues:**

-   If the API endpoint or the database operations fail, the test may
    fail.

-   If the dummy data creation fails or the provided keyword, graduation
    year, or page number is invalid, the test may also fail.

## **should get top 5 companies**

This test case verifies that the API endpoint for retrieving the top 5
companies based on the number of alumni works correctly.

**Test Scenario:**

-   The test creates 10 dummy alumni documents in the database before
    running the test, with each alumni associated with a different
    company name.

-   It sends a GET request to the /alumnis/top-5-companies endpoint.

-   It expects the response to have a status code of 200 (OK).

-   It asserts that the response body is an array with a length of 5,
    containing the top 5 company names based on the number of alumni
    associated with each company.

**Expected Behavior:**

-   The API should retrieve the top 5 company names from the alumni
    documents in the database, based on the count of alumni associated
    with each company.

-   The response should contain an array with the top 5 company names.

**Possible Issues:**

-   If the API endpoint or the database operations fail, the test may
    fail.

-   If the dummy data creation fails or the logic for calculating the
    top companies is incorrect, the test may also fail.

## **should get top 5 locations**

This test case verifies that the API endpoint for retrieving the top 5
locations based on the number of alumni works correctly.

**Test Scenario:**

-   The test creates dummy alumni documents in the database before
    running the test, with each alumni associated with a different
    location.

-   It sends a GET request to the /alumnis/top-5-locations endpoint.

-   It expects the response to have a status code of 200 (OK).

-   It asserts that the response body is an array with a length of 5,
    containing the top 5 locations based on the number of alumni
    associated with each location.

**Expected Behavior:**

-   The API should retrieve the top 5 locations from the alumni
    documents in the database, based on the count of alumni associated
    with each location.

-   The response should contain an array with the top 5 locations.

**Possible Issues:**

-   If the API endpoint or the database operations fail, the test may
    fail.

-   If the dummy data creation fails or the logic for calculating the
    top locations is incorrect, the test may also fail.

## **should get top 5 jobs**

This test case verifies that the API endpoint for retrieving the top 5
jobs based on the number of alumni works correctly.

**Test Scenario:**

-   The test creates dummy alumni documents in the database before
    running the test, with each alumni associated with a different job
    title.

-   It sends a GET request to the /alumnis/top-5-jobs endpoint.

-   It expects the response to have a status code of 200 (OK).

-   It asserts that the response body is an array with a length of 5,
    containing the top 5 job titles based on the number of alumni
    associated with each job.

**Expected Behavior:**

-   The API should retrieve the top 5 job titles from the alumni
    documents in the database, based on the count of alumni associated
    with each job.

-   The response should contain an array with the top 5 job titles.

**Possible Issues:**

-   If the API endpoint or the database operations fail, the test may
    fail.

-   If the dummy data creation fails or the logic for calculating the
    top jobs is incorrect, the test may also fail.

## **should delete all alumni information**

This test case verifies that the API endpoint for deleting all alumni
information works correctly.

**Test Scenario:**

-   The test creates a single dummy alumni document in the database
    before running the test.

-   It sends a DELETE request to the /alumnis endpoint.

-   It expects the response to have a status code of 200 (OK).

-   It asserts that the response body contains a message property with
    the value \"All alumni information deleted successfully.\"

**Expected Behavior:**

-   The API should delete all alumni documents from the database.

-   The response should confirm that the deletion was successful.

**Possible Issues:**

-   If the API endpoint or the database operations fail, the test may
    fail.

-   If the dummy data creation fails, the test may also fail.

# **Comparison of Alumni Data**

## **should identify no changes**

This test case verifies that the comparison functionality correctly
identifies when there are no changes between the current alumni data and
the previous alumni data.

**Test Scenario:**

-   The test creates a single dummy alumni document in both the Alumni
    and PrevAlumni collections before running the test, with the same
    data in both collections.

-   It sends a GET request to the /compare endpoint.

-   It expects the response to have a status code of 200 (OK).

-   It asserts that the response body is an empty array, indicating no
    changes were detected.

**Expected Behavior:**

-   The comparison functionality should compare the current alumni data
    with the previous alumni data and identify that there are no
    changes.

-   The response should be an empty array since no changes were
    detected.

**Possible Issues:**

-   If the dummy data creation or database operations fail, the test may
    fail.

-   If the comparison logic is incorrect, the test may fail to correctly
    identify the absence of changes.

## **should identify changes in position**

**Test Scenario:**

-   The test creates a single dummy alumni document in both the Alumni
    and PrevAlumni collections, with the jobproperty having different
    values in each collection (e.g., \"Software Engineer\" in PrevAlumni
    and \"Senior Software Engineer\" in Alumni).

-   It sends a GET request to the /compare endpoint.

-   It expects the response to have a status code of 200 (OK).

-   It asserts that the response body is an array with a single string
    element, indicating the change in position for the alumni.

**Expected Behavior:**

-   The comparison functionality should compare the current alumni data
    with the previous alumni data and identify the change in the
    alumni\'s position or job title.

-   The response should be an array containing a string that describes
    the identified change in position.

**Possible Issues:**

-   If the dummy data creation or database operations fail, the test may
    fail.

-   If the comparison logic is incorrect or fails to properly handle job
    title changes, the test may fail.

## **should identify changes in company**

This test case verifies that the comparison functionality correctly
identifies changes in an alumni\'s company between the current and
previous alumni data.

**Test Scenario:**

-   The test creates a single dummy alumni document in both the Alumni
    and PrevAlumni collections, with the company property having
    different values in each collection (e.g., \"Google\" in PrevAlumni
    and \"Apple\" in Alumni).

-   It sends a GET request to the /compare endpoint.

-   It expects the response to have a status code of 200 (OK).

-   It asserts that the response body is an array with a single string
    element, indicating the change in the alumni\'s company.

**Expected Behavior:**

-   The comparison functionality should compare the current alumni data
    with the previous alumni data and identify the change in the
    alumni\'s company.

-   The response should be an array containing a string that describes
    the identified change in company.

**Possible Issues:**

-   If the dummy data creation or database operations fail, the test may
    fail.

-   If the comparison logic is incorrect or fails to properly handle
    company changes, the test may fail.

## **should identify changes in location**

This test case verifies that the comparison functionality correctly
identifies changes in an alumni\'s location between the current and
previous alumni data.

**Test Scenario:**

-   The test creates a single dummy alumni document in both the Alumni
    and PrevAlumni collections, with the location property having
    different values in each collection (e.g., \"San Francisco, CA\" in
    PrevAlumni and \"New York, NY\" in Alumni).

-   It sends a GET request to the /compare endpoint.

-   It expects the response to have a status code of 200 (OK).

-   It asserts that the response body is an array with a single string
    element, indicating the change in the alumni\'s location.

**Expected Behavior:**

-   The comparison functionality should compare the current alumni data
    with the previous alumni data and identify the change in the
    alumni\'s location.

-   The response should be an array containing a string that describes
    the identified change in location.

**Possible Issues:**

-   If the dummy data creation or database operations fail, the test may
    fail.

-   If the comparison logic is incorrect or fails to properly handle
    location changes, the test may fail.

## **should identify starting a new job**

This test case verifies that the comparison functionality correctly
identifies when an alumni has started a new job, based on changes in the
job title, company, and potentially location between the current and
previous alumni data.

**Test Scenario:**

-   The test creates a single dummy alumni document in both the Alumni
    and PrevAlumni collections, with the job, company, and location
    properties having different values in each collection (e.g.,
    \"Software Engineer\" at \"Google\" in \"San Francisco, CA\" in
    PrevAlumni, and \"Senior Software Engineer\" at \"Nvidia\" in \"San
    Jose, CA\" in Alumni).

-   It sends a GET request to the /compare endpoint.

-   It expects the response to have a status code of 200 (OK).

-   It asserts that the response body is an array with two string
    elements, indicating the change in company and the start of a new
    job with the new position and company.

**Expected Behavior:**

-   The comparison functionality should compare the current alumni data
    with the previous alumni data and identify that the alumni has
    started a new job based on the changes in job title, company, and
    potentially location.

-   The response should be an array containing two strings: one
    describing the change in company, and another describing the start
    of a new job with the new position and company.

**Possible Issues:**

-   If the dummy data creation or database operations fail, the test may
    fail.

-   If the comparison logic is incorrect or fails to properly identify
    and describe the start of a new job based on the changes, the test
    may fail.

## **should identify multiple changes and movements**

This test case verifies that the comparison functionality correctly
identifies multiple changes and movements for multiple alumni between
the current and previous alumni data.

**Test Scenario:**

-   The test creates two dummy alumni documents in both the Alumni and
    PrevAlumni collections, with various properties (e.g., job, company,
    location) having different values in each collection for each
    alumni.

-   It sends a GET request to the /compare endpoint.

-   It expects the response to have a status code of 200 (OK).

-   It asserts that the response body is an array with multiple string
    elements, each describing a different change or movement identified
    for each alumni.

**Expected Behavior:**

-   The comparison functionality should compare the current alumni data
    with the previous alumni data and identify all changes and movements
    for each alumni, including changes in position, company, and
    location.

-   The response should be an array containing multiple strings, each
    describing a different identified change or movement for each
    alumni.

**Possible Issues:**

-   If the dummy data creation or database operations fail, the test may
    fail.

-   If the comparison logic is incorrect or fails to properly identify
    and describe multiple changes and movements for multiple alumni, the
    test may fail.

# **Previous Alumni Routes**

## **should get all previous alumni**

This test case verifies that the API endpoint for retrieving all
previous alumni data works correctly.

**Test Scenario:**

-   The test creates two dummy alumni documents in the PrevAlumni
    collection before running the test.

-   It sends a GET request to the /prevalumnis endpoint.

-   It expects the response to have a status code of 200 (OK).

-   It asserts that the response body is an array with a length of 2,
    containing the two dummy alumni documents.

**Expected Behavior:**

-   The API should retrieve all previous alumni documents from the
    PrevAlumni collection.

-   The response should contain an array with all the previous alumni
    documents.

**Possible Issues:**

-   If the API endpoint or the database operations fail, the test may
    fail.

-   If the dummy data creation fails, the test may also fail.

## **should delete all previous alumni**

This test case verifies that the API endpoint for deleting all previous
alumni data works correctly.

**Test Scenario:**

-   The test creates two dummy alumni documents in the PrevAlumni
    collection before running the test.

-   It sends a DELETE request to the /prevalumnis endpoint.

-   It expects the response to have a status code of 200 (OK).

-   It asserts that the response body contains a message property with
    the value \"All alumni information deleted successfully.\"

-   It verifies that the PrevAlumni collection is now empty.

**Expected Behavior:**

-   The API should delete all previous alumni documents from the
    PrevAlumni collection.

-   The response should confirm that the deletion was successful.

-   The PrevAlumni collection should be empty after the deletion.

**Possible Issues:**

-   If the API endpoint or the database operations fail, the test may
    fail.

-   If the dummy data creation fails, the test may also fail.

## **should handle errors when getting previous alumni**

This test case verifies that the API endpoint for retrieving previous
alumni data handles errors correctly.

**Test Scenario:**

-   The test mocks the PrevAlumni.find() method to throw an error using
    Jest\'s mocking capabilities.

-   It sends a GET request to the /prevalumnis endpoint.

-   It expects the response to have a status code of 500 (Internal
    Server Error).

-   It asserts that the response body contains a message property with
    the value \"Error getting all alumni information.\"

**Expected Behavior:**

-   If an error occurs while retrieving previous alumni data from the
    database, the API should handle the error gracefully and return an
    appropriate error response.

-   The response should have a 500 status code and include an error
    message indicating that there was an issue getting the alumni
    information.

**Possible Issues:**

-   If the error mocking or Jest mocking setup is incorrect, the test
    may fail.

-   If the error handling logic in the API is incorrect or incomplete,
    the test may fail to validate the expected behavior.

## **should handle errors when deleting previous alumni**

This test case verifies that the API endpoint for deleting previous
alumni data handles errors correctly.

**Test Scenario:**

-   The test mocks the PrevAlumni.deleteMany() method to throw an error
    using Jest\'s mocking capabilities.

-   It sends a DELETE request to the /prevalumnis endpoint.

-   It expects the response to have a status code of 500 (Internal
    Server Error).

-   It asserts that the response body contains a message property with
    the value \"Error deleting all alumni information.\"

**Expected Behavior:**

-   If an error occurs while deleting previous alumni data from the
    database, the API should handle the error gracefully and return an
    appropriate error response.

-   The response should have a 500 status code and include an error
    message indicating that there was an issue deleting the alumni
    information.

**Possible Issues:**

-   If the error mocking or Jest mocking setup is incorrect, the test
    may fail.

-   If the error handling logic in the API is incorrect or incomplete,
    the test may fail to validate the expected behavior.

# **Subscriber Routes**

## **should check subscription status**

This test case verifies that the API endpoint for checking 
the subscription status of an email works correctly.

**Test Scenario:**

-   The test creates a dummy subscriber document in the 
    Subscriber collection before running the test.

-   It sends a GET request to the /emails/check-subscription?email=test@example.com endpoint.

-   It expects the response to have a status code of 200 (OK).

-   It asserts that the response body contains a subscribed property with the value true.

**Expected Behavior:**

-   The API should retrieve the subscription status of the given 
    email from the Subscriber collection.

-   The response should indicate whether the email is subscribed or not.

**Possible Issues:**

-   If the API endpoint or the database operations fail, the test may 
    fail.

-   If the dummy data creation fails, the test may also fail.

## **should handle error when checking subscription status without email**

This test case verifies that the API endpoint for checking the subscription
status handles errors correctly when no email is provided.

**Test Scenario:**

-   It sends a GET request to the /emails/check-subscription endpoint 
    without an email query parameter.

-   It expects the response to have a status code of 400 (Bad Request).

-   It asserts that the response body contains an error property with the value Email is required.

**Expected Behavior:**

-   The API should validate the presence of the email query parameter.

-   The response should indicate that the email is required if it is not provided.

**Possible Issues:**

-   If the validation logic is incorrect or incomplete, the test may fail.

## **should subscribe to email notifications**

This test case verifies that the API endpoint for subscribing to 
email notifications works correctly.

**Test Scenario:**

-   It sends a POST request to the /emails/subscribe endpoint 
    with subscriber data.

-  It expects the response to have a status code of 200 (OK).

-  It verifies that the subscriber document is created 
   in the Subscriber collection with subscribed set to true.

**Expected Behavior:**

- The API should create a new subscriber document in the Subscriber collection.

- The response should confirm that the subscription was successful.

**Possible Issues:**

- If the API endpoint or the database operations fail, the test may fail.

- If the data provided is invalid or incomplete, the test may also fail.

## **should unsubscribe from email notifications**

This test case verifies that the API endpoint for unsubscribing from email notifications works correctly.

**Test Scenario:**

- The test creates a dummy subscriber document in the Subscriber collection with subscribed set to true before running the test.

- It sends a POST request to the /emails/unsubscribe endpoint with the email of the subscriber.

- It expects the response to have a status code of 200 (OK).

-It verifies that the subscribed property of the subscriber document is set to false.

**Expected Behavior:**

- The API should update the subscriber document in the Subscriber collection to set subscribed to false.

- The response should confirm that the unsubscription was successful.

**Possible Issues:**

- If the API endpoint or the database operations fail, the test may fail.

- If the dummy data creation fails, the test may also fail.

## **should handle errors when subscribing to email notifications**

This test case verifies that the API endpoint for subscribing to email notifications handles errors correctly.

**Test Scenario:**

- The test mocks the save method of the Subscriber model to throw an error using Jest's mocking capabilities.

- It sends a POST request to the /emails/subscribe endpoint with subscriber data.

- It expects the response to have a status code of 500 (Internal Server Error).

- It asserts that the response body contains an error message.

**Expected Behavior:**

- If an error occurs while saving the subscriber data to the database, the API should handle the error gracefully and return an appropriate error response.

- The response should have a 500 status code and include an error message indicating that there was an issue with the subscription.

**Possible Issues:**

- If the error mocking or Jest mocking setup is incorrect, the test may fail.

- If the error handling logic in the API is incorrect or incomplete, the test may fail to validate the expected behavior.

## **should handle errors when unsubscribing from email notifications**

This test case verifies that the API endpoint for unsubscribing from email notifications handles errors correctly.

**Test Scenario:**

- The test mocks the findOne method of the Subscriber model to throw an error using Jest's mocking capabilities.

- It sends a POST request to the /emails/unsubscribe endpoint with the email of the subscriber.

- It expects the response to have a status code of 500 (Internal Server Error).

- It asserts that the response body contains an error message.

**Expected Behavior:**

- If an error occurs while updating the subscriber data in the database, the API should handle the error gracefully and return an appropriate error response.

- The response should have a 500 status code and include an error message indicating that there was an issue with the unsubscription.

**Possible Issues:**

- If the error mocking or Jest mocking setup is incorrect, the test may fail.

- If the error handling logic in the API is incorrect or incomplete, the test may fail to validate the expected behavior.
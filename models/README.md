# **Introduction**

Our API allows developers to integrate with our platform and access a wide range of functionalities that mainly include data management, data retrieval, and etc.

**Frontend:** [**https://webtools.engr.ucdavis.edu**](https://webtools.engr.ucdavis.edu/)

**Backend:** [**https://webtools-api.engr.ucdavis.edu**](https://webtools-api.engr.ucdavis.edu/)

## **Schemas**

In our database, we utilize various schemas to structure and manage our data effectively. Below is information about all of our schemas, providing an understanding of how we handle our APIs. Our schemas can be found within the backend repository under the models folder if developers want to view this in a JSON format.

### **Table Definitions**

#### **Alumni and Previous Alumni Schema**

These schemas are designed to store information about the current scraped and previous scraped alumni data. This includes their public information found on LinkedIn, personal and professional details, educational background, and additional information like their HTML and error parsing if we’re unable to scrape properly.

- **name**: The name of the alumni. (Required)
- **location**: The current location of the alumni. (Required)
- **job**: The job title of the alumni. (Required)
- **company**: The company where the alumni are employed. (Required)
- **graduationYear**: The year the alumni graduated. (Required)
- **major**: The major field of study of the alumni. (Required)
- **otherEducation**: Any other educational qualifications of the alumni.
- **otherJobs**: A list of other jobs held by the alumni.
- **url**: A URL to the alumni’s profile or related page. (Required)
- **html**: HTML content related to the alumni if the user fails to parse the profile.
- **errorParsing**: A boolean indicating if there was an error parsing the alumni data. (Required)

#### **Ezen Company Schema**

This schema stores information about companies listed on the EquityZen site, including company details, funding records, founders, notable investors, and alumni associated with the company from our alumni database.

- **name**: The name of the company. (Required)
- **foundingDate**: The founding date of the company.
- **notableInvestors**: Notable investors in the company.
- **hq**: The headquarters location of the company.
- **totalFunding**: The total funding received by the company.
- **founders**: A list of the founders, each with their position and name.
- **alumnis**: A list of alumni associated with the company, each with their name, position, and URL.
- **bio**: A biography of the company. (Required)
- **ezenLink**: A URL link to the company's profile on the EquityZen platform. (Required)
- **industries**: A list of the industries that the company aligns themselves with.
- **favorite**: A boolean value indicating whether a company is favorited by the client or not. 

#### **Subscribers Schema**

The subscribers schema stores information about individuals using the site and determines whether they are subscribed for any updates/newsletter on the changes from newly scraped data. This includes their email, name, and subscription status.

- **email**: The subscriber’s email address. (Unique and required)
- **name**: The name of the subscriber. (Required)
- **subscribed**: A boolean indicating if the subscriber is currently subscribed. Defaults to true.

### **Relationships and Constraints**

#### **Relationships**

1. **Alumni and Previous Alumni**: There is a one-to-one relationship between an Alumni record and its corresponding Previous Alumni record, indicating the current and past information of the same individual.
2. **EzenCompany and Alumni**: A many-to-many relationship exists between EzenCompany and Alumni, indicating which alumni are associated with which companies. This relationship is implemented via a join table that connects alumni to the companies they are associated with.
3. **Subscribers**: Subscribers do not have direct relationships with other entities but interact with the alumni and company data via the application, receiving updates about changes.

#### **Constraints**

1. **Primary Keys**: Each schema has a primary key that uniquely identifies each record.
    - **Alumni**: alumniId (or equivalent unique identifier)
    - **Previous Alumni**: previousAlumniId
    - **EzenCompany**: companyId
    - **Subscribers**: email
2. **Foreign Keys**: Relationships are enforced using foreign keys.
    - **Alumni**: previousAlumniId references PreviousAlumni.previousAlumniId
    - **EzenCompany-Alumni Join Table**: companyId references EzenCompany.companyId, alumniId references Alumni.alumniId
3. **Unique Constraints**: Ensuring that certain fields have unique values.
    - **Subscribers**: email field must be unique.
    - **EzenCompany**: name and ezenLink fields should be unique to prevent duplicates.
4. **Required Fields**: Some fields must always have a value.
    - **Alumni**: name, location, job, company, graduationYear, major, url, errorParsing
    - **EzenCompany**: name, bio, ezenLink
    - **Subscribers**: email, name

## **Status Codes**

HTTP response codes are used to indicate general classes of success and error.

### **Success Code**

| **HTTP Status Code** | **Description** |
| --- | --- |
| 200 | Successfully process requests. |
| 201 | Successfully created user object. |

### **Error Codes**

| **HTTP Status Code** | **code** | **code** |
| --- | --- | --- |
| 400 | invalid_json | The request body could not be decoded as JSON |
|     | invalid_request_url | This request URL is not valid |
|     | invalid_request | This request is not supported |
| 401 | unauthorized | The bearer token is not valid |
| 500 | server_error | The server has encountered an unexpected condition that prevents it from fulfilling the request made by the client |

###

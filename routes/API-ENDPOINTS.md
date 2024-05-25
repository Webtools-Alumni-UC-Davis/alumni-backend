## **Introduction**

We’ll be going into detail on every endpoint that is related to all the endpoints from Alumnis, CompareAlumnis, Ezen, PrevAlumni, Send Emails including the endpoint itself, description, parameters, example usage with an example response and example error response.

## **Alumnis(Alumnus)**

The “alumnis” endpoint will handle information recently scraped from LinkedIn. From here, it’ll display information about companies, jobs, locations, alumni information including a search feature, along with a create/update/delete feature.

### **Pagination**

With this, you’ll be able to navigate between 10 alumnus per page.

| **HTTP Method** | GET |
| --- | --- |
| **Endpoint** | <https://webtools-api.engr.ucdavis.edu/alumnis> |
| **Description** | Retrieves a paginated list of all alumni information from the database |
| **Parameters** | \`page\` (optional) : the page number to retrieve. Defaults to 1 if not provided |


| **Example Usage** | GET "<https://webtools-api.engr.ucdavis.edu/alumnis?page=1>" |
| --- | --- |
| **Example Response** | {<br><br>"data": \[<br><br>{<br><br>"name": "John Doe",<br><br>"location": "New York",<br><br>"job": "Software Engineer",<br><br>"company": "Tech Corp",<br><br>"graduationYear": 2019,<br><br>"major": "Computer Science",<br><br>"otherEducation": "Master's in Data Science",<br><br>"otherJobs": \["Data Analyst", "Research Assistant"\],<br><br>"url": "<http://linkedin.com/in/johndoe>",<br><br>"html": "&lt;div&gt;LinkedIn Profile&lt;/div&gt;",<br><br>"errorParsing": false<br><br>},<br><br>{<br><br>"name": "Jane Smith",<br><br>"location": "San Francisco",<br><br>"job": "Product Manager",<br><br>"company": "Startup Inc",<br><br>"graduationYear": 2018,<br><br>"major": "Business Administration",<br><br>"otherEducation": null,<br><br>"otherJobs": \[\],<br><br>"url": "<http://linkedin.com/in/janesmith>",<br><br>"html": null,<br><br>"errorParsing": false<br><br>}<br><br>\],<br><br>"pagination": {<br><br>"total_pages": 10,<br><br>"current_page": 1,<br><br>"total_count": 100<br><br>}<br><br>} |
| **Example Error Response** | "message": "Error gettingl alumni information." |

### **getAllAlumni**

| **HTTP Method** | GET |
| --- | --- |
| **Endpoint** | <https://webtools-api.engr.ucdavis.edu/alumnis/getAllAlumni> |
| **Description** | Retrieves all alumni information from the database. |
| **Parameters** | none |

| **Example Usage** | GET "&lt;<https://webtools-api.engr.ucdavis.edu/alumnis/getAllAlumni/>&gt;" |
| --- | --- |
| **Example Response** | \[<br><br>{<br><br>"name": "John Doe",<br><br>"location": "New York",<br><br>"job": "Software Engineer",<br><br>"company": "Tech Corp",<br><br>"graduationYear": 2019,<br><br>"major": "Computer Science",<br><br>"otherEducation": "Master's in Data Science",<br><br>"otherJobs": \["Data Analyst", "Research Assistant"\],<br><br>"url": "<http://linkedin.com/in/johndoe>",<br><br>"html": "&lt;div&gt;LinkedIn Profile&lt;/div&gt;",<br><br>"errorParsing": false<br><br>},<br><br>{<br><br>"name": "Jane Smith",<br><br>"location": "San Francisco",<br><br>"job": "Product Manager",<br><br>"company": "Startup Inc",<br><br>"graduationYear": 2018,<br><br>"major": "Business Administration",<br><br>"otherEducation": null,<br><br>"otherJobs": \[\],<br><br>"url": "<http://linkedin.com/in/janesmith>",<br><br>"html": null,<br><br>"errorParsing": false<br><br>}<br><br>\] |
| **Example Error Response** | "message": "Error getting all alumni information." |


### **specificalumni**

| **HTTP Method** | GET |
| --- | --- |
| **Endpoint** | <https://webtools-api.engr.ucdavis.edu/alumnis/specificalumni> |
| **Description** | Retrieves information for a specific alumnus based on the provided URL |
| **Parameters** | \`url\` (required) : the linkedin URL of the specific alumnus to retrieve information for. |
|  |  |

| **Example Usage** | GET "<https://webtools-api.engr.ucdavis.edu/alumnis/specificalumni?url=http://linkedin.com/in/johndoe>" |
| --- | --- |
| **Example Response** | \[<br><br>{<br><br>"name": "John Doe",<br><br>"location": "New York",<br><br>"job": "Software Engineer",<br><br>"company": "Tech Corp",<br><br>"graduationYear": 2019,<br><br>"major": "Computer Science",<br><br>"otherEducation": "Master's in Data Science",<br><br>"otherJobs": \["Data Analyst", "Research Assistant"\],<br><br>"url": "<http://linkedin.com/in/johndoe>",<br><br>"html": "&lt;div&gt;LinkedIn Profile&lt;/div&gt;",<br><br>"errorParsing": false<br><br>}<br><br>\] |
| **Example Error Response** | "message": "Error getting alumni information." |

### **updateAlumni**

| **HTTP Method** | PUT |
| --- | --- |
| **Endpoint** | <https://webtools-api.engr.ucdavis.edu/alumnis/update> |
| **Description** | Updates information for a specific alumnus based on the provided URL |
| **Parameters** | Request Body: A JSON object containing the updated fields and values for the alumnus. |
|  |  |

| **Example Usage** | PUT "<https://webtools-api.engr.ucdavis.edu/alumnis/update>"<br><br>Content-Type: application/json<br><br>{<br><br>"url": "<http://linkedin.com/in/johndoe>",<br><br>"job": "Senior Software Engineer",<br><br>"company": "Tech Innovators Inc",<br><br>"otherEducation": "PhD in Computer Science"<br><br>} |
| --- | --- |
| **Example Response** | {<br><br>"name": "John Doe",<br><br>"location": "New York",<br><br>"job": "Senior Software Engineer",<br><br>"company": "Tech Innovators Inc",<br><br>"graduationYear": 2019,<br><br>"major": "Computer Science",<br><br>"otherEducation": "PhD in Computer Science",<br><br>"otherJobs": \["Data Analyst", "Research Assistant"\],<br><br>"url": "<http://linkedin.com/in/johndoe>",<br><br>"html": "&lt;div&gt;LinkedIn Profile&lt;/div&gt;",<br><br>"errorParsing": false<br><br>} |
| **Example Error Response** | "message": "Error updating alumni information." |

### **getCountofAlumni**

| **HTTP Method** | GET |
| --- | --- |
| **Endpoint** | <https://webtools-api.engr.ucdavis.edu/alumnis/count> |
| **Description** | Retrieves the total count of all alumni records in the database. |
| **Parameters** | none |
|  |  |

| **Example Usage** | GET "<https://webtools-api.engr.ucdavis.edu/alumnis/count>" |
| --- | --- |
| **Example Response** | {<br><br>"count": 1000<br><br>} |
| **Example Error Response** | "message": "Error getting the count of all alumni." |

### **getCurrentCountofAlumni**

| **HTTP Method** | GET |
| --- | --- |
| **Endpoint** | <https://webtools-api.engr.ucdavis.edu/alumnis/count/current> |
| **Description** | Retrieves the count of alumni who graduated in the current year. |
| **Parameters** | none |
|  |  |

| **Example Usage** | GET "<https://webtools-api.engr.ucdavis.edu/alumnis/count/current>" |
| --- | --- |
| **Example Response** | {<br><br>"count": 10<br><br>} |
| **Example Error Response** | "message": "Error getting the count of current alumni for year 2024." |

### **getAllCompanies**

| **HTTP Method** | GET |
| --- | --- |
| **Endpoint** | <https://webtools-api.engr.ucdavis.edu/alumnis/getAllCompanies> |
| **Description** | Retrieves unique company names of all alumni. |
| **Parameters** | none |
| | |

| **Example Usage** | GET "<https://webtools-api.engr.ucdavis.edu/alumnis/getAllCompanies>" |
| --- | --- |
| **Example Response** | \[<br><br>"Tech Corp",<br><br>"Startup Inc",<br><br>"ABC Solutions",<br><br>"XYZ Corporation"<br><br>\] |
| **Example Error Response** | "message": "Error retrieving unique company names." |

### **Search**

| **HTTP Method** | GET |
| --- | --- |
| **Endpoint** | <https://webtools-api.engr.ucdavis.edu/alumnis/search> |
| **Description** | Retrieves alumni information based on keyword search, graduation year, and filters. |
| **Parameters** | \`keyword\` (optional): Keyword to search for alumni (string)<br><br>\`graduationYear\` (optional) : Graduation year of alumni (number)<br><br>\`filters\` (optional): Additional filters for refining search results (array or JSON string)<br><br>\`page\` (optional): Page number for pagination (number) |
| | |

| **Example Usage** | GET "<https://webtools-api.engr.ucdavis.edu/alumnis/search?keyword=software&graduationYear=2019&filters=\["New> York"\]&page=1" |
| --- | --- |
| **Example Response** | {<br><br>"data": \[<br><br>{<br><br>"name": "John Doe",<br><br>"location": "New York",<br><br>"job": "Software Engineer",<br><br>"company": "Tech Corp",<br><br>"graduationYear": 2019,<br><br>"major": "Computer Science",<br><br>"otherEducation": "Master's in Data Science",<br><br>"otherJobs": \["Data Analyst", "Research Assistant"\],<br><br>"url": "<http://linkedin.com/in/johndoe>",<br><br>"html": "&lt;div&gt;LinkedIn Profile&lt;/div&gt;",<br><br>"errorParsing": false<br><br>},<br><br>{<br><br>"name": "Jane Smith",<br><br>"location": "San Francisco",<br><br>"job": "Product Manager",<br><br>"company": "Startup Inc",<br><br>"graduationYear": 2018,<br><br>"major": "Business Administration",<br><br>"otherEducation": null,<br><br>"otherJobs": \[\],<br><br>"url": "<http://linkedin.com/in/janesmith>",<br><br>"html": null,<br><br>"errorParsing": false<br><br>}<br><br>\],<br><br>"pagination": {<br><br>"total_pages": 2,<br><br>"current_page": 1,<br><br>"total_count": 15<br><br>}<br><br>} |
| **Example Error Response** | "message": "Error searching alumni information." |

### **Top 5 Companies**

| **HTTP Method** | GET |
| --- | --- |
| **Endpoint** | <https://webtools-api.engr.ucdavis.edu/alumnis/top-5-companies> |
| **Description** | Retrieves information about the top 5 companies based on alumni count. |
| **Parameters** | none |
|  | |

| **Example Usage** | GET "<https://webtools-api.engr.ucdavis.edu/alumnis/top-5-companies>" |
| --- | --- |
| **Example Response** | \[<br><br>{ "\_id": "Tech Corp", "count": 120 },<br><br>{ "\_id": "Startup Inc", "count": 90 },<br><br>{ "\_id": "Software Solutions", "count": 85 },<br><br>{ "\_id": "Data Systems", "count": 75 },<br><br>{ "\_id": "Innovative Tech", "count": 70 }<br><br>\] |
| **Example Error Response** | "message": "Error retrieving top 5 companies." |

### **Top 5 Locations**

| **HTTP Method** | GET |
| --- | --- |
| **Endpoint** | <https://webtools-api.engr.ucdavis.edu/alumnis/top-5-locations> |
| **Description** | Retrieves information about the top 5 locations based on alumni count. |
| **Parameters** | none |
| | |

| **Example Usage** | GET "<https://webtools-api.engr.ucdavis.edu/alumnis/top-5-locations>" |
| --- | --- |
| **Example Response** | \[<br><br>{ "\_id": "New York", "count": 80 },<br><br>{ "\_id": "San Francisco", "count": 75 },<br><br>{ "\_id": "Los Angeles", "count": 65 },<br><br>{ "\_id": "Seattle", "count": 55 },<br><br>{ "\_id": "Chicago", "count": 50 }<br><br>\] |
| **Example Error Response** | "message": "Error retrieving top 5 locations." |

### **Top 5 Jobs**

| **HTTP Method** | GET |
| --- | --- |
| **Endpoint** | <https://webtools-api.engr.ucdavis.edu/alumnis/top-5-jobs> |
| **Description** | Retrieves information about the top 5 job titles based on alumni count. |
| **Parameters** | none |
| | |

| **Example Usage** | GET "<https://webtools-api.engr.ucdavis.edu/alumnis/top-5-jobs>" |
| --- | --- |
| **Example Response** | \[<br><br>{ "\_id": "Software Engineer", "count": 150 },<br><br>{ "\_id": "Product Manager", "count": 120 },<br><br>{ "\_id": "Data Analyst", "count": 100 },<br><br>{ "\_id": "Research Scientist", "count": 90 },<br><br>{ "\_id": "Marketing Manager", "count": 85 }<br><br>\] |
| **Example Error Response** | "message": "Error retrieving top 5 jobs." |

### **postAlumni**

| **HTTP Method** | POST |
| --- | --- |
| **Endpoint** | <https://webtools-api.engr.ucdavis.edu/alumnis/> |
| **Description** | Creates new alumni information in the database |
| **Parameters** | url: URL of the alumni's LinkedIn profile<br><br>name: Name of the alumni<br><br>location: Location of the alumni<br><br>job: Job title of the alumni<br><br>company: Company where the alumni works<br><br>graduationYear: Year of graduation<br><br>major: Major of the alumni<br><br>otherEducation: Additional education of the alumni<br><br>otherJobs: Other job titles the alumni held (optional)<br><br>html: HTML content of the alumni's LinkedIn profile (optional)<br><br>errorParsing: Flag indicating if there was an error parsing the data |
| |  |

| **Example Usage** | POST "<https://webtools-api.engr.ucdavis.edu/alumnis/>"<br><br>Content-Type: application/json<br><br>{<br><br>"url": "<http://linkedin.com/in/johndoe>",<br><br>"name": "John Doe",<br><br>"location": "New York",<br><br>"job": "Software Engineer",<br><br>"company": "Tech Corp",<br><br>"graduationYear": 2019,<br><br>"major": "Computer Science",<br><br>"otherEducation": "Master's in Data Science",<br><br>"errorParsing": false<br><br>} |
| --- | --- |
| **Example Response** | {<br><br>"\_id": "614a866e24d091234567890a",<br><br>"url": "<http://linkedin.com/in/johndoe>",<br><br>"name": "John Doe",<br><br>"location": "New York",<br><br>"job": "Software Engineer",<br><br>"company": "Tech Corp",<br><br>"graduationYear": 2019,<br><br>"major": "Computer Science",<br><br>"otherEducation": "Master's in Data Science",<br><br>"otherJobs": \[\],<br><br>"html": "",<br><br>"errorParsing": false,<br><br>"\__v": 0<br><br>} |
| **Example Error Response** | "message": "Error creating alumni information." |

### **deleteAll**

| **HTTP Method** | DELETE |
| --- | --- |
| **Endpoint** | <https://webtools-api.engr.ucdavis.edu/alumnis/> |
| **Description** | Deletes all alumni information from the database. |
| **Parameters** | none |
| | |

| **Example Usage** | DELETE "<https://webtools-api.engr.ucdavis.edu/alumnis/>" |
| --- | --- |
| **Example Response** | { "message": "All alumni information deleted successfully." } |
| **Example Error Response** | "message": "Error deleting alumni information." |

## **Compare Alumni**

The “compare” endpoint will handle returning back a json statements of any changes from the two databases.

### **compare**

| **HTTP Method** | GET |
| --- | --- |
| **Endpoint** | <https://webtools-api.engr.ucdavis.edu/compare> |
| **Description** | Compares the current alumni data with previous alumni data to identify changes such as job changes, company changes, and location changes. |
| **Parameters** | none |
| |  |

| **Example Usage** | GET "&lt;<https://webtools-api.engr.ucdavis.edu/compare>&gt;" |
| --- | --- |
| **Example Response** | \[<br><br>"John Doe moved companies from Tech Corp to New Company.",<br><br>"Jane Smith changed location from San Francisco to Los Angeles.",<br><br>"Jane Smith has changed position from Product Manager to Marketing Manager at Startup Inc.",<br><br>"Alice Johnson has started a new job at Tech Corp as a Software Engineer."<br><br>\] |
| **Example Error Response** | "message": "Error getting both datasets and comparing changes." |

## **Subscription**

The “emails” endpoint will handle checking if the users are subscribed in our database and will also handle subscribing and unsubscribing our users.

### **Check-subscription**

| **HTTP Method** | GET |
| --- | --- |
| **Endpoint** | <https://webtools-api.engr.ucdavis.edu/emails/check-subscription> |
| **Description** | Checks the subscription status of a given email address. |
| **Parameters** | \`email\` (required): The email address to check subscription status for. |
| |  |

| **Example Usage** | GET "<https://webtools-api.engr.ucdavis.edu/emails/check-subscription?email=user@example.com>" |
| --- | --- |
| **Example Response** | { "subscribed": true } |
| **Example Error Response** | "message": "Email is required." |

### **Subscribe**

| **HTTP Method** | POST |
| --- | --- |
| **Endpoint** | <https://webtools-api.engr.ucdavis.edu/subscribe> |
| **Description** | Subscribed an email address to receive monthly updates |
| **Parameters** | \`email\` (required): The email address to subscribe<br><br>\`name\` (required): The name of the subscriber |
| | |

| **Example Usage** | POST <https://webtools-api.engr.ucdavis.edu/emails/subscribe><br><br>Content-Type: application/json<br><br>{<br><br>"email": "<user@example.com>",<br><br>"name": "John Doe"<br><br>} |
| --- | --- |
| **Example Response** | Status Code: 200<br><br>Response Body: (None) |
| **Example Error Response** | Status Code: 500<br><br>Response Body:<br><br>{ "error": "Error subscribing to email notifications" } |

### **Unsubscribe**

| **HTTP Method** | POST |
| --- | --- |
| **Endpoint** | <https://webtools-api.engr.ucdavis.edu/unsubscribe> |
| **Description** | Unsubscribes an email address to receive monthly updates |
| **Parameters** | \`email\` (required): The email address to subscribe |
| |  |

| **Example Usage** | POST <https://webtools-api.engr.ucdavis.edu/emails/unsubscribe><br><br>Content-Type: application/json<br><br>{<br><br>"email": "<user@example.com>"<br><br>} |
| --- | --- |
| **Example Response** | Status Code: 200<br><br>Response Body: (None) |
| **Example Error Response** | Status Code: 500<br><br>Response Body:<br><br>{ "error": "Error unsubscribing from email notifications" } |

## **Previous Alumni**

The “prevalumnis” endpoint will handle information recently scraped from LinkedIn. From here, it’ll display information along with deleting and adding new information.

### **getAllPreviousAlumni**

| **HTTP Method** | GET |
| --- | --- |
| **Endpoint** | <https://webtools-api.engr.ucdavis.edu/prevalumnis/> |
| **Description** | Retrieves all previous alumni information from the database. |
| **Parameters** | none |
|  | |

| **Example Usage** | GET "&lt;<https://webtools-api.engr.ucdavis.edu/prevalumni/>&gt;" |
| --- | --- |
| **Example Response** | \[<br><br>{<br><br>"name": "John Doe",<br><br>"location": "New York",<br><br>"job": "Software Engineer",<br><br>"company": "Tech Corp",<br><br>"graduationYear": 2019,<br><br>"major": "Computer Science",<br><br>"otherEducation": "Master's in Data Science",<br><br>"otherJobs": \["Data Analyst", "Research Assistant"\],<br><br>"url": "<http://linkedin.com/in/johndoe>",<br><br>"html": "&lt;div&gt;LinkedIn Profile&lt;/div&gt;",<br><br>"errorParsing": false<br><br>},<br><br>{<br><br>"name": "Jane Smith",<br><br>"location": "San Francisco",<br><br>"job": "Product Manager",<br><br>"company": "Startup Inc",<br><br>"graduationYear": 2018,<br><br>"major": "Business Administration",<br><br>"otherEducation": null,<br><br>"otherJobs": \[\],<br><br>"url": "<http://linkedin.com/in/janesmith>",<br><br>"html": null,<br><br>"errorParsing": false<br><br>}<br><br>\] |
| **Example Error Response** | "message": "Error getting all alumni information." |

### **addNewAlumni**

| **HTTP Method** | POST |
| --- | --- |
| **Endpoint** | <https://webtools-api.engr.ucdavis.edu/prevalumnis/> |
| **Description** | Adds new alumni information to the database |
| **Parameters** | url: URL of the alumni's LinkedIn profile<br><br>name: Name of the alumni<br><br>location: Location of the alumni<br><br>job: Job title of the alumni<br><br>company: Company where the alumni works<br><br>graduationYear: Year of graduation<br><br>major: Major of the alumni<br><br>otherEducation: Additional education of the alumni<br><br>otherJobs: Other job titles the alumni held (optional)<br><br>html: HTML content of the alumni's LinkedIn profile (optional)<br><br>errorParsing: Flag indicating if there was an error parsing the data |
|  |  |

| **Example Usage** | POST "<https://webtools-api.engr.ucdavis.edu/prevalumnis/>"<br><br>Content-Type: application/json<br><br>{<br><br>"url": "<http://linkedin.com/in/johndoe>",<br><br>"name": "John Doe",<br><br>"location": "New York",<br><br>"job": "Software Engineer",<br><br>"company": "Tech Corp",<br><br>"graduationYear": 2019,<br><br>"major": "Computer Science",<br><br>"otherEducation": "Master's in Data Science",<br><br>"errorParsing": false<br><br>} |
| --- | --- |
| **Example Response** | {<br><br>"\_id": "614a866e24d091234567890a",<br><br>"url": "<http://linkedin.com/in/johndoe>",<br><br>"name": "John Doe",<br><br>"location": "New York",<br><br>"job": "Software Engineer",<br><br>"company": "Tech Corp",<br><br>"graduationYear": 2019,<br><br>"major": "Computer Science",<br><br>"otherEducation": "Master's in Data Science",<br><br>"otherJobs": \[\],<br><br>"html": "",<br><br>"errorParsing": false,<br><br>"\__v": 0<br><br>} |
| **Example Error Response** | "message": "Error creating alumni information." |

### **deleteAll**

| **HTTP Method** | DELETE |
| --- | --- |
| **Endpoint** | <https://webtools-api.engr.ucdavis.edu/prevalumnis/> |
| **Description** | Deletes all alumni information from the database. |
| **Parameters** | none |
|  | |

| **Example Usage** | DELETE "&lt;<https://webtools-api.engr.ucdavis.edu/prevalumnis/>&gt;" |
| --- | --- |
| **Example Response** | { "message": "All alumni information deleted successfully." } |
| **Example Error Response** | "message": "Error deleting all alumni information." |
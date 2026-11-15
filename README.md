# DMoney API Testing with Postman & Newman

Integration testing of the DMoney mobile-financial-service API (User + Transaction APIs) with a Postman collection (30 test cases, positive + negative, all with assertions) and an HTML Newman report.

**Batch 20 - Assignment on API Testing (Integration testing with Postman)**

## Links

| What | Link |
| --- | --- |
| Postman collection (test cases) | <PASTE_POSTMAN_COLLECTION_LINK> - file: [`Collection/DMoney_API_Collection.postman_collection.json`](Collection/DMoney_API_Collection.postman_collection.json) |
| Published API documentation | <PASTE_POSTMAN_DOCUMENTATION_LINK> - offline copy: [`docs/API_DOCUMENTATION.md`](docs/API_DOCUMENTATION.md) |
| User API (Swagger) | http://localhost:5000/api-docs/user |
| Transaction API (Swagger) | http://localhost:5000/api-docs/transaction |

## Scenario covered

1. Admin creates **2 Customers, 1 Agent and 1 Merchant** (`POST /user/create`)
2. Admin **activates** all four users (`PATCH /user/update/:id` with `{"status":"active"}`)
3. **SYSTEM** (`system@dmoney.com` / `1234`) deposits **5000 tk** to the Agent
4. Agent deposits **2000 tk** to Customer 1 - asserts the **deposit commission** (2.5% = 50 tk)
5. Customer 1 sends **1000 tk** to Customer 2 - asserts the **service fee** (flat 5 tk)
6. Customer 2 cashes out **500 tk** from the Agent - asserts the **service fee** (1%, min 5 tk = 5 tk)
7. Customer 2 pays **400 tk** to the Merchant (fee asserted too) and the final balance is verified (90 tk)

Expected money trail for Customer 2: +1000 - (500 + 5) - (400 + 5) = **90 tk**.

## Test cases (30)

| ID | Test case | Type | Endpoint | Expected result |
| --- | --- | --- | --- | --- |
| TC01 | Admin login | Positive | `POST /user/login` | 200 OK and a JWT token. |
| TC02 | System login | Positive | `POST /user/login` | 200 OK and a JWT token. |
| TC03 | Login with wrong password | Negative | `POST /user/login` | 401 Unauthorized, no token in the response. |
| TC04 | Create Customer 1 | Positive | `POST /user/create` | 201 Created; response contains the created user (e-mail and role match). |
| TC05 | Create Customer 2 | Positive | `POST /user/create` | 201 Created; response contains the created user (e-mail and role match). |
| TC06 | Create Agent | Positive | `POST /user/create` | 201 Created; response contains the created user (e-mail and role match). |
| TC07 | Create Merchant | Positive | `POST /user/create` | 201 Created; response contains the created user (e-mail and role match). |
| TC08 | Create duplicate user (same e-mail & phone) | Negative | `POST /user/create` | Duplicate rejected (208 per API docs; 400/409 also accepted) with a message about the existing account. |
| TC09 | Create user without Authorization token | Negative | `POST /user/create` | 401 Unauthorized. |
| TC10 | Create user with invalid phone number | Negative | `POST /user/create` | 400 Bad Request (validation error). |
| TC11 | Activate Customer 1 | Positive | `PATCH /user/update/:id` | 200 OK; user status becomes active. |
| TC12 | Activate Customer 2 | Positive | `PATCH /user/update/:id` | 200 OK; user status becomes active. |
| TC13 | Activate Agent | Positive | `PATCH /user/update/:id` | 200 OK; user status becomes active. |
| TC14 | Activate Merchant | Positive | `PATCH /user/update/:id` | 200 OK; user status becomes active. |
| TC15 | Login as Agent | Positive | `POST /user/login` | 200 OK, JWT stored (directly, or after OTP verification). |
| TC16 | Login as Customer 1 | Positive | `POST /user/login` | 200 OK, JWT stored (directly, or after OTP verification). |
| TC17 | Login as Customer 2 | Positive | `POST /user/login` | 200 OK, JWT stored (directly, or after OTP verification). |
| TC18 | SYSTEM deposits 5000 tk to Agent | Positive | `POST /transaction/deposit` | 201 Created with trnxId. |
| TC19 | SYSTEM deposit below minimum amount (5 tk) | Negative | `POST /transaction/deposit` | 400 Bad Request. |
| TC20 | Agent deposits 2000 tk to Customer 1 (assert commission) | Positive | `POST /transaction/deposit` | 201 Created and `commission` = 50. |
| TC21 | Agent deposit above maximum (10001 tk) | Negative | `POST /transaction/deposit` | 400 Bad Request (or 208 soft-failure) - money must NOT be moved. |
| TC22 | Deposit without Authorization token | Negative | `POST /transaction/deposit` | 401 Unauthorized. |
| TC23 | Customer 1 sends 1000 tk to Customer 2 (assert service fee) | Positive | `POST /transaction/sendmoney` | 201 Created and `fee` = 5. |
| TC24 | Send money to the same account | Negative | `POST /transaction/sendmoney` | 400 Bad Request. |
| TC25 | Send money with insufficient balance | Negative | `POST /transaction/sendmoney` | 208 (soft failure) or 400 - insufficient balance, no transaction id. |
| TC26 | Cash-out below minimum amount (5 tk) | Negative | `POST /transaction/withdraw` | 400 Bad Request. |
| TC27 | Customer 2 cashes out 500 tk from Agent (assert service fee) | Positive | `POST /transaction/withdraw` | 201 Created and `fee` = 5. |
| TC28 | Customer 2 pays 400 tk to Merchant | Positive | `POST /transaction/payment` | 201 Created, trnxId returned and `fee` = 5. |
| TC29 | Payment with insufficient balance | Negative | `POST /transaction/payment` | 208 (soft failure) or 400 - insufficient balance, no transaction id. |
| TC30 | Verify Customer 2 final balance | Positive | `GET /transaction/balance/:account` | 200 OK and balance = 90. |

Every request has assertions for status code, response body fields and response time. Dynamic data (e-mail, phone, NID) is generated in pre-request scripts, so the collection can be re-run without clearing the database. Tokens and IDs are passed between requests with collection variables, so **run the collection top-to-bottom**.

## Project structure

```
.
├── Collection/
│   ├── DMoney_API_Collection.postman_collection.json
│   └── DMoney_Local.postman_environment.json
├── docs/API_DOCUMENTATION.md      # offline API documentation
├── screenshots/                   # Newman report screenshot used below
├── run.js                         # runs Newman + HTML report
├── package.json
├── .env.example                   # copy to .env (git-ignored)
└── .gitignore                     # node_modules, Reports, .env
```

## How to run

Prerequisites: Node.js 18+ and the DMoney API running on `http://localhost:5000`.

```bash
git clone <this-repo-url>
cd dmoney-api-testing
npm install
cp .env.example .env     # optional - only needed to override defaults
npm test                 # runs the collection with Newman, writes Reports/newman-report.html
```

Or in Postman: import both files from `Collection/`, select the **DMoney Local** environment and run the collection with the Collection Runner.

### Environment variables

| Variable | Default | Notes |
| --- | --- | --- |
| `baseUrl` | `http://localhost:5000` | API base URL |
| `partnerKey` | `ROADTOSDET` | sent as `X-AUTH-SECRET-KEY` |
| `adminEmail` / `adminPassword` | `admin@roadtocareer.net` / `1234` | admin account |
| `systemEmail` / `systemPassword` | `system@dmoney.com` / `1234` | SYSTEM account |
| `userPassword` | `1234` | password given to the created users |

### Login notes

Admin and SYSTEM receive a JWT directly. For Agent/Customers the login requests (TC15-TC17) work with both server variants: if the API returns a token directly it is used; if it answers `otpRequired`, the script reads the OTP through the Admin search API (`GET /user/search/email/:email`) and calls `POST /user/verify-otp` automatically.

## Newman report

![Newman report](screenshots/newman-report.png)

> The HTML report is generated into `Reports/` (git-ignored). Screenshot of the latest run is stored in `screenshots/`.

## API documentation

Published Postman documentation: <PASTE_POSTMAN_DOCUMENTATION_LINK>

Offline version: [`docs/API_DOCUMENTATION.md`](docs/API_DOCUMENTATION.md)

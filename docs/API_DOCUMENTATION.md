# DMoney API - Test Documentation

Generated from the Postman collection. Base URL: `{{baseUrl}}` (default `http://localhost:5000`).

Protected requests need `Authorization: Bearer <JWT>` and `X-AUTH-SECRET-KEY: {{partnerKey}}`.


## 01 Authentication

### TC01 - Admin login

- **Type:** Positive
- **Endpoint:** `POST /user/login`
- **Headers:** `Content-Type: application/json`
- **Description:** Login as Admin. The returned JWT is stored in `admin_token` and used for user creation / activation.
- **Expected:** 200 OK and a JWT token.

```json
{
  "email": "{{adminEmail}}",
  "password": "{{adminPassword}}"
}
```

### TC02 - System login

- **Type:** Positive
- **Endpoint:** `POST /user/login`
- **Headers:** `Content-Type: application/json`
- **Description:** Login with the SYSTEM account (system@dmoney.com / 1234). The JWT is stored in `system_token` and is used to fund the Agent.
- **Expected:** 200 OK and a JWT token.

```json
{
  "email": "{{systemEmail}}",
  "password": "{{systemPassword}}"
}
```

### TC03 - Login with wrong password

- **Type:** Negative
- **Endpoint:** `POST /user/login`
- **Headers:** `Content-Type: application/json`
- **Description:** Login with a valid e-mail but an incorrect password.
- **Expected:** 401 Unauthorized, no token in the response.

```json
{
  "email": "{{adminEmail}}",
  "password": "wrong-password-999"
}
```


## 02 Create Users

### TC04 - Create Customer 1

- **Type:** Positive
- **Endpoint:** `POST /user/create`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer {{admin_token}}`, `X-AUTH-SECRET-KEY: {{partnerKey}}`
- **Description:** Admin creates a Customer (Customer 1 - receives the agent deposit and sends money) using POST /user/create. A new user is created with status `pending`.
- **Expected:** 201 Created; response contains the created user (e-mail and role match).

```json
{
  "name": "{{customer1_name}}",
  "email": "{{customer1_email}}",
  "password": "{{userPassword}}",
  "phone_number": "{{customer1_phone}}",
  "nid": "{{customer1_nid}}",
  "role": "Customer"
}
```

### TC05 - Create Customer 2

- **Type:** Positive
- **Endpoint:** `POST /user/create`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer {{admin_token}}`, `X-AUTH-SECRET-KEY: {{partnerKey}}`
- **Description:** Admin creates a Customer (Customer 2 - receives money, cashes out and pays the merchant) using POST /user/create. A new user is created with status `pending`.
- **Expected:** 201 Created; response contains the created user (e-mail and role match).

```json
{
  "name": "{{customer2_name}}",
  "email": "{{customer2_email}}",
  "password": "{{userPassword}}",
  "phone_number": "{{customer2_phone}}",
  "nid": "{{customer2_nid}}",
  "role": "Customer"
}
```

### TC06 - Create Agent

- **Type:** Positive
- **Endpoint:** `POST /user/create`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer {{admin_token}}`, `X-AUTH-SECRET-KEY: {{partnerKey}}`
- **Description:** Admin creates a Agent using POST /user/create. A new user is created with status `pending`.
- **Expected:** 201 Created; response contains the created user (e-mail and role match).

```json
{
  "name": "{{agent_name}}",
  "email": "{{agent_email}}",
  "password": "{{userPassword}}",
  "phone_number": "{{agent_phone}}",
  "nid": "{{agent_nid}}",
  "role": "Agent"
}
```

### TC07 - Create Merchant

- **Type:** Positive
- **Endpoint:** `POST /user/create`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer {{admin_token}}`, `X-AUTH-SECRET-KEY: {{partnerKey}}`
- **Description:** Admin creates a Merchant using POST /user/create. A new user is created with status `pending`.
- **Expected:** 201 Created; response contains the created user (e-mail and role match).

```json
{
  "name": "{{merchant_name}}",
  "email": "{{merchant_email}}",
  "password": "{{userPassword}}",
  "phone_number": "{{merchant_phone}}",
  "nid": "{{merchant_nid}}",
  "role": "Merchant"
}
```

### TC08 - Create duplicate user (same e-mail & phone)

- **Type:** Negative
- **Endpoint:** `POST /user/create`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer {{admin_token}}`, `X-AUTH-SECRET-KEY: {{partnerKey}}`
- **Description:** Re-submit the exact payload used for Customer 1.
- **Expected:** Duplicate rejected (208 per API docs; 400/409 also accepted) with a message about the existing account.

```json
{
  "name": "{{customer1_name}}",
  "email": "{{customer1_email}}",
  "password": "{{userPassword}}",
  "phone_number": "{{customer1_phone}}",
  "nid": "{{customer1_nid}}",
  "role": "Customer"
}
```

### TC09 - Create user without Authorization token

- **Type:** Negative
- **Endpoint:** `POST /user/create`
- **Headers:** `Content-Type: application/json`, `X-AUTH-SECRET-KEY: {{partnerKey}}`
- **Description:** Call the protected create endpoint without a Bearer token.
- **Expected:** 401 Unauthorized.

```json
{
  "name": "QA No Auth",
  "email": "{{noauth_email}}",
  "password": "{{userPassword}}",
  "phone_number": "01700000000",
  "nid": "1234567890",
  "role": "Customer"
}
```

### TC10 - Create user with invalid phone number

- **Type:** Negative
- **Endpoint:** `POST /user/create`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer {{admin_token}}`, `X-AUTH-SECRET-KEY: {{partnerKey}}`
- **Description:** Phone number must be exactly 11 digits; send a 5-digit number.
- **Expected:** 400 Bad Request (validation error).

```json
{
  "name": "QA Invalid Phone",
  "email": "{{invalid_email}}",
  "password": "{{userPassword}}",
  "phone_number": "12345",
  "nid": "1234567890",
  "role": "Customer"
}
```


## 03 Activate Users

### TC11 - Activate Customer 1

- **Type:** Positive
- **Endpoint:** `PATCH /user/update/{{customer1_id}}`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer {{admin_token}}`, `X-AUTH-SECRET-KEY: {{partnerKey}}`
- **Description:** Admin activates the Customer 1 via PATCH /user/update/:id with `{"status":"active"}`.
- **Expected:** 200 OK; user status becomes active.

```json
{
  "status": "active"
}
```

### TC12 - Activate Customer 2

- **Type:** Positive
- **Endpoint:** `PATCH /user/update/{{customer2_id}}`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer {{admin_token}}`, `X-AUTH-SECRET-KEY: {{partnerKey}}`
- **Description:** Admin activates the Customer 2 via PATCH /user/update/:id with `{"status":"active"}`.
- **Expected:** 200 OK; user status becomes active.

```json
{
  "status": "active"
}
```

### TC13 - Activate Agent

- **Type:** Positive
- **Endpoint:** `PATCH /user/update/{{agent_id}}`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer {{admin_token}}`, `X-AUTH-SECRET-KEY: {{partnerKey}}`
- **Description:** Admin activates the Agent via PATCH /user/update/:id with `{"status":"active"}`.
- **Expected:** 200 OK; user status becomes active.

```json
{
  "status": "active"
}
```

### TC14 - Activate Merchant

- **Type:** Positive
- **Endpoint:** `PATCH /user/update/{{merchant_id}}`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer {{admin_token}}`, `X-AUTH-SECRET-KEY: {{partnerKey}}`
- **Description:** Admin activates the Merchant via PATCH /user/update/:id with `{"status":"active"}`.
- **Expected:** 200 OK; user status becomes active.

```json
{
  "status": "active"
}
```


## 04 User Login

### TC15 - Login as Agent

- **Type:** Positive
- **Endpoint:** `POST /user/login`
- **Headers:** `Content-Type: application/json`
- **Description:** Login as the Agent. If the server uses the e-mail OTP flow, the script reads the OTP through the Admin search API and calls /user/verify-otp automatically. The JWT is stored in `agent_token`.
- **Expected:** 200 OK, JWT stored (directly, or after OTP verification).

```json
{
  "email": "{{agent_email}}",
  "password": "{{userPassword}}"
}
```

### TC16 - Login as Customer 1

- **Type:** Positive
- **Endpoint:** `POST /user/login`
- **Headers:** `Content-Type: application/json`
- **Description:** Login as the Customer 1. If the server uses the e-mail OTP flow, the script reads the OTP through the Admin search API and calls /user/verify-otp automatically. The JWT is stored in `customer1_token`.
- **Expected:** 200 OK, JWT stored (directly, or after OTP verification).

```json
{
  "email": "{{customer1_email}}",
  "password": "{{userPassword}}"
}
```

### TC17 - Login as Customer 2

- **Type:** Positive
- **Endpoint:** `POST /user/login`
- **Headers:** `Content-Type: application/json`
- **Description:** Login as the Customer 2. If the server uses the e-mail OTP flow, the script reads the OTP through the Admin search API and calls /user/verify-otp automatically. The JWT is stored in `customer2_token`.
- **Expected:** 200 OK, JWT stored (directly, or after OTP verification).

```json
{
  "email": "{{customer2_email}}",
  "password": "{{userPassword}}"
}
```


## 05 Transactions

### TC18 - SYSTEM deposits 5000 tk to Agent

- **Type:** Positive
- **Endpoint:** `POST /transaction/deposit`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer {{system_token}}`, `X-AUTH-SECRET-KEY: {{partnerKey}}`
- **Description:** SYSTEM account funds the Agent with 5000 tk.
- **Expected:** 201 Created with trnxId.

```json
{
  "from_account": "{{systemAccount}}",
  "to_account": "{{agent_phone}}",
  "amount": 5000
}
```

### TC19 - SYSTEM deposit below minimum amount (5 tk)

- **Type:** Negative
- **Endpoint:** `POST /transaction/deposit`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer {{system_token}}`, `X-AUTH-SECRET-KEY: {{partnerKey}}`
- **Description:** Minimum transaction amount is 10 tk.
- **Expected:** 400 Bad Request.

```json
{
  "from_account": "{{systemAccount}}",
  "to_account": "{{agent_phone}}",
  "amount": 5
}
```

### TC20 - Agent deposits 2000 tk to Customer 1 (assert commission)

- **Type:** Positive
- **Endpoint:** `POST /transaction/deposit`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer {{agent_token}}`, `X-AUTH-SECRET-KEY: {{partnerKey}}`
- **Description:** Agent cash-in to Customer 1. Deposit commission = 2.5% of the amount (2000 x 2.5% = 50 tk).
- **Expected:** 201 Created and `commission` = 50.

```json
{
  "from_account": "{{agent_phone}}",
  "to_account": "{{customer1_phone}}",
  "amount": 2000
}
```

### TC21 - Agent deposit above maximum (10001 tk)

- **Type:** Negative
- **Endpoint:** `POST /transaction/deposit`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer {{agent_token}}`, `X-AUTH-SECRET-KEY: {{partnerKey}}`
- **Description:** Maximum deposit per transaction is 10,000 tk.
- **Expected:** 400 Bad Request (or 208 soft-failure) - money must NOT be moved.

```json
{
  "from_account": "{{agent_phone}}",
  "to_account": "{{customer1_phone}}",
  "amount": 10001
}
```

### TC22 - Deposit without Authorization token

- **Type:** Negative
- **Endpoint:** `POST /transaction/deposit`
- **Headers:** `Content-Type: application/json`, `X-AUTH-SECRET-KEY: {{partnerKey}}`
- **Description:** Transaction endpoints require a JWT.
- **Expected:** 401 Unauthorized.

```json
{
  "from_account": "{{agent_phone}}",
  "to_account": "{{customer1_phone}}",
  "amount": 100
}
```

### TC23 - Customer 1 sends 1000 tk to Customer 2 (assert service fee)

- **Type:** Positive
- **Endpoint:** `POST /transaction/sendmoney`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer {{customer1_token}}`, `X-AUTH-SECRET-KEY: {{partnerKey}}`
- **Description:** Send money has a flat service fee of 5 tk.
- **Expected:** 201 Created and `fee` = 5.

```json
{
  "from_account": "{{customer1_phone}}",
  "to_account": "{{customer2_phone}}",
  "amount": 1000
}
```

### TC24 - Send money to the same account

- **Type:** Negative
- **Endpoint:** `POST /transaction/sendmoney`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer {{customer1_token}}`, `X-AUTH-SECRET-KEY: {{partnerKey}}`
- **Description:** from_account and to_account must be different.
- **Expected:** 400 Bad Request.

```json
{
  "from_account": "{{customer1_phone}}",
  "to_account": "{{customer1_phone}}",
  "amount": 100
}
```

### TC25 - Send money with insufficient balance

- **Type:** Negative
- **Endpoint:** `POST /transaction/sendmoney`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer {{customer1_token}}`, `X-AUTH-SECRET-KEY: {{partnerKey}}`
- **Description:** Customer 1 only has ~995 tk left (2000 - 1000 - 5 fee).
- **Expected:** 208 (soft failure) or 400 - insufficient balance, no transaction id.

```json
{
  "from_account": "{{customer1_phone}}",
  "to_account": "{{customer2_phone}}",
  "amount": 3000
}
```

### TC26 - Cash-out below minimum amount (5 tk)

- **Type:** Negative
- **Endpoint:** `POST /transaction/withdraw`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer {{customer2_token}}`, `X-AUTH-SECRET-KEY: {{partnerKey}}`
- **Description:** Minimum transaction amount is 10 tk.
- **Expected:** 400 Bad Request.

```json
{
  "from_account": "{{customer2_phone}}",
  "to_account": "{{agent_phone}}",
  "amount": 5
}
```

### TC27 - Customer 2 cashes out 500 tk from Agent (assert service fee)

- **Type:** Positive
- **Endpoint:** `POST /transaction/withdraw`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer {{customer2_token}}`, `X-AUTH-SECRET-KEY: {{partnerKey}}`
- **Description:** Withdraw (cash-out) fee = 1% of the amount, minimum 5 tk -> max(5, 500 x 1%) = 5 tk.
- **Expected:** 201 Created and `fee` = 5.

```json
{
  "from_account": "{{customer2_phone}}",
  "to_account": "{{agent_phone}}",
  "amount": 500
}
```

### TC28 - Customer 2 pays 400 tk to Merchant

- **Type:** Positive
- **Endpoint:** `POST /transaction/payment`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer {{customer2_token}}`, `X-AUTH-SECRET-KEY: {{partnerKey}}`
- **Description:** Payment fee = 1% of the amount, minimum 5 tk -> max(5, 400 x 1%) = 5 tk.
- **Expected:** 201 Created, trnxId returned and `fee` = 5.

```json
{
  "from_account": "{{customer2_phone}}",
  "to_account": "{{merchant_phone}}",
  "amount": 400
}
```

### TC29 - Payment with insufficient balance

- **Type:** Negative
- **Endpoint:** `POST /transaction/payment`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer {{customer2_token}}`, `X-AUTH-SECRET-KEY: {{partnerKey}}`
- **Description:** Customer 2 has ~90 tk left after cash-out and payment.
- **Expected:** 208 (soft failure) or 400 - insufficient balance, no transaction id.

```json
{
  "from_account": "{{customer2_phone}}",
  "to_account": "{{merchant_phone}}",
  "amount": 1000
}
```

### TC30 - Verify Customer 2 final balance

- **Type:** Positive
- **Endpoint:** `GET /transaction/balance/{{customer2_phone}}`
- **Headers:** `Authorization: Bearer {{customer2_token}}`, `X-AUTH-SECRET-KEY: {{partnerKey}}`
- **Description:** Customer 2: +1000 (received) - 500 - 5 (cash-out + fee) - 400 - 5 (payment + fee) = 90 tk.
- **Expected:** 200 OK and balance = 90.


# JustVerified

This repository contains a Verifiable Credentials Management API built with NestJS. It allows users to generate and verify verifiable credentials (VCs) using social accounts (GitHub, Twitter, Discord, Telegram), email verification, and integrates with the Ethereum Name Service (ENS). The API supports generating VCs, verifying VCs, and managing records on ENS names.

## Features

- **Verifiable Credentials Generation**: Generate verifiable credentials using social accounts (GitHub, Twitter, Discord, Telegram) and email verification.
- **ENS Integration**: Manage ENS subdomain records, append VCs to ENS records, and verify records.
- **Authentication**: Authenticate users using Ethereum addresses and ENS domains.
- **Credential Verification**: Verify the validity of VCs and ensure they are issued by trusted issuers.
- **Social Account Verification**: Integrate with social platforms for account verification.
- **Email Verification**: Send OTPs to verify email addresses.

## Architecture

The application is built using the NestJS framework, following a modular architecture. Key components include:

- **Controllers**: Handle incoming HTTP requests and return responses.
- **Services**: Contain business logic and interact with external services or databases.
- **Resolvers**: Resolve data for VCs, including social accounts and email.
- **Agents**: Use [Veramo](https://veramo.io/) to create and verify verifiable credentials.
- **Mappers**: Map data between different formats and layers.
- **Filters**: Handle exceptions and errors.

## Prerequisites


## Getting Started

### Installation

1. Clone the repository:

```bash
git clone https://github.com/JustaName-id/JustVerified.git
cd JustVerified
```

2. Install the dependencies:

```bash
yarn
```

### Environment Variables

Create a .env file in the root directory and set the environment variables similar to the .env.example file.

### Running the Application

Start the application in development mode:

```bash
nx serve vc-api
```

The application will be available at http://localhost:3000/verifications/v1.

## API Documentation

### Authentication

#### Get Nonce

**Endpoint**: `GET /auth/nonce`

**Description**: Generates a nonce for signing in.

**Response**:

```json
"1234567890abcdef"
```
#### Sign In

**Endpoint**: `POST /auth/signin`

**Description**: Authenticates a user by verifying their Ethereum signature.

**Request Body**:

```json
{
  "message": "<Signed_Nonce_Message>",
  "signature": "<Ethereum_Signature>"
}
```

**Response**:

```json
{
  "ens": "user.yourdomain.eth",
  "address": "0xYourEthereumAddress",
  "chainId": 1
}
```

#### Get Current Session
**Endpoint**: `GET /auth/current`

**Description**: Retrieves the current authenticated session.

**Response**:

```json
{
  "ens": "user.yourdomain.eth",
  "address": "0xYourEthereumAddress",
  "chainId": 1
}
```

#### Sign out

**Endpoint**: `POST /auth/signout`

**Description**: Signs out the current user.

**Response**:

```json
{
  "message": "You have been signed out"
}
```

### Credentials 

#### Get Social Auth URL

**Endpoint**: `GET /credentials/social/:authName`

**Description**: Generates an authentication URL for social platforms.

**Parameters:

- `authName`: The name of the social platform (e.g., `github`, `twitter`, `discord`, `telegram`).

**Response**:

Streamed response with the authentication URL.

#### Social Callback

**Endpoint**: `GET /credentials/social/:authName/callback`

**Description**: Callback endpoint for social authentication.

**Parameters:
- `authName`: The name of the social platform (e.g., `github`, `twitter`, `discord`, `telegram`).

**Query Parameters:**
- `code`: The authorization code from the social platform.
- `state`: Encrypted state containing user information.

**Response**:
HTML response indicating success or failure.

#### Generate Email OTP

**Endpoint**: `POST /credentials/email`

**Description**: Sends an OTP to the specified email address for verification.

**Query Parameters:**
- `email`: The email address to verify.

**Response**:
```json
{
  "state": "<Encrypted_State>"
}
```

#### Resend Email OTP

**Endpoint**: `POST /credentials/email/resend`

**Description**: Resends the OTP to the email address.

**Request Body**:
```json
{
  "state": "<Encrypted_State>"
}
```

**Response**:
HTTP 200 OK

#### Verify Email OTP

**Endpoint**: `POST /credentials/email/verify`

**Description**: Verifies the OTP provided by the user.

**Request Body**:
```json
{
  "state": "<Encrypted_State>",
  "otp": "<User_Entered_OTP>"
}
```

**Response**:

```json
{
  "dataKey": "email_yourdomain.eth",
  "verifiedCredential": {
    "@context": [...],
    "type": [...],
    "credentialSubject": {
      "email": "user@example.com",
      "did": "did:ens:user.yourdomain.eth#<Public_Key>"
    },
    "issuer": {
      "id": "did:ens:yourdomain.eth#<Public_Key>"
    },
    "proof": {...},
    "expirationDate": "2024-10-15T12:34:56Z",
    "issuanceDate": "2023-10-15T12:34:56Z"
  }
}
```
#### Clear Email State

**Endpoint**: `POST /credentials/email/clear`

**Description**: Clears the email verification state.

**Request Body**:
```json
{
  "state": "<Encrypted_State>"
}
```

**Response**:
HTTP 200 OK

### Verify Records

#### Verify Records

**Endpoint**: `GET /verify-records`

**Description**: Verifies the records associated with an ENS name.

**Query Parameters:**
- `ens`: The ENS name to verify.
- `chainId`: The chain ID (1 for Mainnet, 11155111 for Sepolia).
- `credentials`: An array of VCs to verify.
- `matchStandard`(optional): Whether to match to the user set records. Default is false.
- `issuer`(optional): The issuer domain. Defaults to `justverified.eth`.

**Response**:

```json
{
  "records": {
    "com.twitter": true,
    "com.github": false,
    "email": true
  }
}
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

When contributing, please follow the existing code style and conventions.









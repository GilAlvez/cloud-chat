# Cloud Chat - Serverless Chat Application

Cloud Chat is a simple chat application built using the Serverless Framework on AWS, leveraging services like AWS Lambda, DynamoDB, and Cognito for authentication. This project demonstrates the creation and management of chat rooms, sending and listing text messages, and user profile management.

## Features

- **Authentication**

  - Sign up and sign in using phone number.
  - Phone number recovery and validation.
  - _Upcoming implementations_: Two-step authentication, email authentication, social authentication.

- **Chat**

  - Creation and listing of chat rooms.
  - Sending and listing of text messages per room.
  - _Upcoming implementations_: Support for message types such as file, audio, video, image; message status; deleting message content; typing indicator; notifications; replying to messages; editing messages; deleting messages; creating and managing group rooms.

- **Profile**
  - Retrieving user information.
  - Updating profile information, including profile photo.
  - _Upcoming implementations_: Changing status manually, user preferences, blocking other users, removing account.

## Architecture

The project is based on a serverless architecture, with Lambda functions responsible for handling backend operations. Data persistence is performed in DynamoDB, and Cognito is used to manage user authentication and authorization.

### Main Components

- **AWS Lambda**: Serverless functions that execute the application's backend logic.
- **AWS DynamoDB**: A NoSQL database that stores data for chat rooms and messages.
- **AWS Cognito**: An authentication service that manages users and sessions, using phone number as the primary authentication method and also performs token validation using API Gateway authorizers

### Project Structure

```plaintext
/
├── src/
│   ├── functions/       # Lambda functions for specific operations
│   ├── services/        # Scope-structured logic: e.g. auth, chat, profile...
│   ├── types/           # Types and interfaces
│   ├── libs/            # Shared libraries and AWS client configurations
│   └── utils/           # Utilities and helpers like parsers
├── serverless.yml       # Serverless Framework configuration
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 20
- Configured AWS CLI
- Serverless Framework

### Setup and Deployment

1. Install the project dependencies:

   ```bash
   npm install
   ```

2. Deploy the application to AWS:

   ```bash
   serverless deploy
   ```

### Usage

- **User registration**: Use the `/auth/sign-up` endpoint with a phone number to register a new user.
- **Validate account**: on endpoint `/auth/account-confirmation` it is possible to pass the necessary authentication token
- **Login**: After validation, use the `/auth/sign-in` endpoint to log in.
- **Creating chat rooms**: Once authenticated, use the `/chat/rooms` endpoint to create a new room passing the id of two registered users.
- **Sending messages**: With a room created, messages can be sent using the `/chat/messages` endpoint.

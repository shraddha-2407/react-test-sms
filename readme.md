## Sendsei React Test

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Here is a simple test of your understanding of React components, async API calls and state management. You are required to complete the missing parts of this repository such that the page displays a form component on the left for submitting SMS messages and a list of sent messages to the right.

The test code will be run from the root of the repository and the Sendsei API Key will be provided to you

```
REACT_APP_API_KEY=xxx npm start
```

It is intended for this test to take roughly an hour to complete. You are free to take your time with it though be mindful of keeping it simple. This is not a test of your design skills.

### Criteria

- **MessageForm.tsx** should contain a form with 3 inputs: Sender, Recipient, Message.

- The form should validate that the message length is a maximum of 3 SMS worth of text.

- The Sender on the form should be a read-only field with the value of `Enterprise` as this is the valid sender enabled for use in the Sendsei account.

- a **service.ts** file has been created which needs completion, this is where the implementation of the Sendsei SMS api call goes. Use the [Sendsei Beta API docs](https://documenter.getpostman.com/view/10746805/Szzei1PZ#intro) to submit an SMS from the service. The API key provided to you is passed in as the environment variable `REACT_APP_API_KEY` as shown above.

- Use `fetch` rather than installing any extra npm packages

- Use your own mobile number as the recipient for testing

- **MessageDisplay.tsx** should display a list of messages that have been sent with the following data: Recipient, Message, Cost. These are returned by the Sendsei API.

- You are not required to restore the list of sent messages between sessions. A page refresh can lose all state.

### How to submit

Clone this and push to a private github repository and then add @paran01d as a collaborator when completed.

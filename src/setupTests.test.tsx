// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent, act } from '@testing-library/react';
import MessageForm from './MessageForm';
import { sendSMS } from './service';
import MessageDisplay from './MessageDisplay';
import { ISmsDetails } from './types';
import MessagePage from './MessagePage';

describe ('SMS tests', () => {
  beforeAll(() => jest.spyOn(window, 'fetch'));
  window.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({sms: { recipient: '61410111232', message: 'Hi', cost: 0.87 }}),
    })
  );

  describe('sendSMS', () => {
    it('should return the successful sms details', async () => {
      const response = await sendSMS('Enterprise', '61410111232', 'Hi');
      expect(response).toEqual(expect.objectContaining({sms: { recipient: '61410111232', message: 'Hi', cost: 0.87 }}));
    });

    it("should resolve to error message when format of number is wrong, `starting with 0 and not 61 or +61' ", async () => {
      window.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({error: 'Failed to send SMS'}),
        })
      );
    
      const response = await sendSMS('Enterprise', '0410111232', 'Hi');
      expect(response).toEqual(expect.objectContaining({error: 'Failed to send SMS'}));
    });

    it("should return exception", async () => {
      window.fetch.mockImplementationOnce(() => Promise.reject('Failed to send SMS'));
      const response = await sendSMS('Enterprise', '0410111232', 'Hi');
      expect(response).toEqual(expect.objectContaining({error: 'Failed to send SMS'}));
    });
  })
  
  describe('<MessageForm />', () => {
    beforeEach(() => {
      jest.resetModules();
    });
  
    it('should render succesfully and call handleSendSms function', async () => {
      const handleSendSms = jest.fn(details => { return; });
      const form = render(<MessageForm handleSendSms={handleSendSms} />);
      const { getByTestId } = form;
      const senderInput = getByTestId(`senderInput`);
      const recipientInput = getByTestId(`recipientInput`);
      const messageInput = getByTestId(`messageTextArea`);
      fireEvent.change(recipientInput, { target: { value: '61410111232' } });
      fireEvent.change(messageInput, { target: { value: 'Hi' } });
      expect(senderInput.value).toBe('Enterprise');
      await act(async () => {
        await fireEvent.submit(getByTestId('messageForm'));
      });
      expect(handleSendSms).toHaveBeenCalledWith({recipient: '61410111232', message: 'Hi', cost: 0.87});
    });

    it('should not call API when recipient is missing and show error message', async () => {
      const handleSendSms = jest.fn(details => { return; });
      const form = render(<MessageForm handleSendSms={handleSendSms} />);
      const { getByTestId } = form;
      const senderInput = getByTestId(`senderInput`);
      const recipientInput = getByTestId(`recipientInput`);
      const messageInput = getByTestId(`messageTextArea`);
      fireEvent.change(recipientInput, { target: { value: '' } });
      fireEvent.change(messageInput, { target: { value: 'Hi' } });
      expect(senderInput.value).toBe('Enterprise');
      await act(async () => {
        await fireEvent.submit(getByTestId('messageForm'));
      });
      const error = getByTestId(`recipientError`);
      expect(error.innerHTML).toBe('Please enter recipient');
    });

    it('should not call API when message length is greater than 480 characters and show error message', async () => {
      const handleSendSms = jest.fn(details => { return; });
      const msg = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vulputate nulla eget egestas bibendum. Sed consectetur, dolor sed suscipit auctor, libero ante sollicitudin diam, id dapibus arcu sem eu nisi. Nullam a eleifend nulla, vitae facilisis est. Fusce mattis dictum elit quis aliquet. Etiam imperdiet convallis vestibulum. Maecenas feugiat pellentesque arcu. Nam eget mi porta, consectetur arcu in, posuere purus. Nullam scelerisque faucibus tellus quis aliquet. Vivamus in.'
      const form = render(<MessageForm handleSendSms={handleSendSms} />);
      const { getByTestId } = form;
      const senderInput = getByTestId(`senderInput`);
      const recipientInput = getByTestId(`recipientInput`);
      const messageInput = getByTestId(`messageTextArea`);
      fireEvent.change(recipientInput, { target: { value: '61410111232' } });
      fireEvent.change(messageInput, { target: { value: msg } });
      expect(senderInput.value).toBe('Enterprise');
      await act(async () => {
        await fireEvent.submit(getByTestId('messageForm'));
      });
      const error = getByTestId(`messageError`);
      expect(error.innerHTML).toBe('Please check message');
    });

    it('should not call API when message is missing and show message is missing', async () => {
      const handleSendSms = jest.fn(details => { return; });
      const form = render(<MessageForm handleSendSms={handleSendSms} />);
      const { getByTestId } = form;
      const senderInput = getByTestId(`senderInput`);
      const recipientInput = getByTestId(`recipientInput`);
      const messageInput = getByTestId(`messageTextArea`);
      fireEvent.change(recipientInput, { target: { value: '61410111232' } });
      fireEvent.change(messageInput, { target: { value: '' } });
      expect(senderInput.value).toBe('Enterprise');
      await act(async () => {
        await fireEvent.submit(getByTestId('messageForm'));
      });
      const error = getByTestId(`messageError`);
      expect(error.innerHTML).toBe('Please check message');
    });
  });

  describe('<MessageDisplay />', () => {
    beforeEach(() => {
      jest.resetModules();
    });
  
    it('should render succesfully with all the messages', async () => {
      const smsDetails = [
        { recipient: '61410111232', message: 'Hi', cost: 0.87 },
        { recipient: '61410111232', message: 'Hello', cost: 0.87 },
        { recipient: '61410111232', message: 'How are u?', cost: 0.87 }
      ]
      const display = render(<MessageDisplay smsDetails={smsDetails} />);
      const { getAllByTestId } = display;
      const messageDetails = getAllByTestId(`messageDetails`);
      expect(messageDetails.length).toBe(3);
    });

    it('should render initial welcome message', async () => {
      const smsDetails: ISmsDetails[] = [];
      const display = render(<MessageDisplay smsDetails={smsDetails} />);
      const { getByTestId } = display;
      const messageDetails = getByTestId(`initialMessage`);
      expect(messageDetails).toBeInTheDocument();
    });
  });

  describe('<MessagePage />', () => {
    beforeEach(() => {
      jest.resetModules();
    });
  
    it('should render Message Page successfully', async () => {
      const page = render(<MessagePage />);
      const { getByTestId } = page;
      const messagePage = getByTestId(`messagePage`);
      expect(messagePage.children.length).toBe(2);
    });
  }); 
})



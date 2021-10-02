import React from "react";
import { sendSMS } from './service';
import { ISmsDetails, ISendSMSError, ISendSMSResponse } from './types';
interface Props {
  handleSendSms: (details: ISmsDetails) => void;
}

const MessageForm: React.FC<Props> = ({handleSendSms}: Props) => {
  let formRef: HTMLFormElement | null = null;
  const [smsRecipient, setSmsRecipient] = React.useState<string>('')
  const [smsMessage, setSmsMessage] = React.useState<string>('');
  const [isMessageError, setIsMessageError] = React.useState<boolean>(false);
  const [isRecipientError, setIsRecipientError] = React.useState<boolean>(false);
  const [isApiError, setIsApiError] = React.useState<string>('');
  const sender = 'Enterprise';
  

  const handleSmsMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSmsMessage(event.target.value);
    setIsMessageError(false);
  }

  const handleRecipientChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSmsRecipient(event.target.value);
    setIsRecipientError(false);
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsRecipientError(false);
    setIsMessageError(false);
    setIsApiError('');
    
    if (smsRecipient.length === 0) {
      setIsRecipientError(true);
      return;
    }

    if (smsMessage.length === 0 || smsMessage.length > 480) {
      setIsMessageError(true);
      return;
    }

    try {
      const smsDetails = await sendSMS(sender, smsRecipient, smsMessage);
      const { error } = smsDetails as ISendSMSError;
      const { sms } = smsDetails as ISendSMSResponse;
      
      if (error) {
        setIsApiError(error);
        return;
      }

      if (sms) {
        const { recipient, message, cost } = sms;
        handleSendSms({
          recipient,
          message,
          cost
        });
        setSmsMessage('');
      }
    } catch (e) {
      console.log(e);
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>)=>{
    if(event.key === "Enter" && (event.metaKey || event.ctrlKey)){ // enter button
      formRef?.dispatchEvent(
        new Event("submit", { bubbles: false, cancelable: true })
      );
    }
  }

  return (
    <div className="MessageForm">
      <header>Send SMS <sup>*</sup></header>
      <div onKeyDown={e => handleKeyDown(e)}>
        <form className="smsForm" ref={ref => formRef = ref} onSubmit={e => handleSubmit(e)} data-testid='messageForm' >
          {isApiError && <div id="apiError">{isApiError.toUpperCase()}</div>}
          <fieldset>
            <label id='senderLabel' htmlFor='senderInput'>
              Sender:
            </label>
            <input type="text" readOnly value={sender} id='senderInput' data-testid='senderInput' />
          </fieldset>
          <fieldset>
            <label id='recipientLabel' htmlFor='recipientInput'>
              Recipient:
            </label>
            <input type="text" value={smsRecipient} onChange={e => handleRecipientChange(e)} data-testid='recipientInput' />
            <div id='recipientError' data-testid='recipientError' >{isRecipientError && 'Please enter recipient'}</div>
          </fieldset>
          <fieldset>
            <label id='messageLabel' htmlFor='messageInput'>
              Message:
            </label>
            <textarea value={smsMessage} onChange={e => handleSmsMessageChange(e)} data-testid='messageTextArea' />
            <div id="messageError" data-testid='messageError' >{isMessageError && 'Please check message'}</div>
          </fieldset>
        </form>
        <p className="finePrint"><sup>*</sup>To send SMS - press Cmd + Enter</p>
      </div>
    </div>
  );
};

export default MessageForm;

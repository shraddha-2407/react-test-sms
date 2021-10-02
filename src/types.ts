export interface ISendSMSResponse {
    sms: {
        ["_id"]: string;
        ["updated_at"]: string;
        ["created_at"]: string;
        cost: number;
        country: string;
        message: string;
        ["sms_count"]: number,
        gsm: boolean;
        recipient: string;
        sender: string;
        source: string;
        ["account_id"]: string;
        ["campaign_id"]: string;
        contact: {
          ["_id"]: string;
          ["contact_ref"]: string;
          ["first_name"]: string;
          ["last_name"]: string;
          mobile: string;
          email: string;
          country: string;
          status: string;
        },
        list: {
          ["_id"]: string;
          name: string;
          count: number;
        },
        status: string;
        dlr: {
          status: string;
        }
      },
      parts: number;
  };
  
export interface ISendSMSError {
    error: string;
}

export interface ISmsDetails {
    recipient: string;
    message: string;
    cost: number;
}
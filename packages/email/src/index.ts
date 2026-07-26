export interface EmailMessage {
  purpose: "early-access-confirmation" | "result-ready";
  recipient: string;
}

export interface EmailProvider {
  send(message: EmailMessage): Promise<{ deliveryId: string }>;
}

export class FakeEmailProvider implements EmailProvider {
  send(message: EmailMessage): Promise<{ deliveryId: string }> {
    return Promise.resolve({
      deliveryId: `fake-${message.purpose}`
    });
  }
}

export const emailProvider: EmailProvider = new FakeEmailProvider();

import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class EmailConfirmation {
  @Prop({ type: String, default: null })
  confirmationCode: string | null;

  @Prop({ type: String, default: null })
  recoveryCode: string | null;

  @Prop({ type: Date, required: true })
  issuedAt: Date;

  @Prop({ type: Date, required: true })
  expirationDate: Date;

  @Prop({ type: Boolean, default: false })
  isConfirmed: boolean;

  static create(): EmailConfirmation {
    const data = new EmailConfirmation();
    data.confirmationCode = null;
    data.recoveryCode = null;
    data.issuedAt = new Date();
    data.expirationDate = new Date(data.issuedAt.getTime() + 1 * 3600 * 1000);
    data.isConfirmed = false;

    return data;
  }
}

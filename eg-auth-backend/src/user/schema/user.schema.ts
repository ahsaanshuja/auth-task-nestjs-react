import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  // Username field
  @Prop({
    type: String, // The data type
    required: true, // It's a required field
    unique: true, // The username must be unique across all documents
    description: 'The unique username of the user', // Description
  })
  username: string;

  // UserEmail field
  @Prop({
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/,
    description: 'The email of the user',
  })
  email: string;

  // Password field
  @Prop({
    type: String, // The data type
    required: true, // It's a required field
    description: 'The hashed password of the user', // Description
  })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

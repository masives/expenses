import * as mongoose from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';
import { hashPassword } from '../../utils/crypto';
import { IUser } from '../../../types/User';

interface IUserModel extends mongoose.Document, IUser {}

const UserSchema: mongoose.Schema = new mongoose.Schema({
  password: {
    required: true,
    type: String,
  },
  username: {
    required: true,
    type: String,
    unique: true,
  },
})
  .plugin(uniqueValidator)
  .pre('save', function(next) {
    // @ts-ignore-next-line - we receive password alongside username
    this.password = hashPassword(this.password);
    next();
  });

const UserModel: mongoose.Model<IUserModel> = mongoose.model('users', UserSchema);

export const addUser = (user: IUser): Promise<IUserModel> => UserModel.create(user);

export const findUserByUsername = (username: string): mongoose.DocumentQuery<IUserModel | null, IUserModel, {}> =>
  UserModel.findOne({ username });

export default UserModel;

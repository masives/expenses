import * as mongoose from 'mongoose';

import { addUser } from '../server/repository/user';

const { ADMIN_USERNAME, ADMIN_PASSWORD, MONGO_SERVICE_HOST, MONGODB_PORT_NUMBER, MONGO_DATABASE_NAME } = process.env;

(async () => {
  const mongooseConnection = await mongoose.connect(
    `mongodb://${MONGO_SERVICE_HOST}:${MONGODB_PORT_NUMBER}/${MONGO_DATABASE_NAME}`,
    { useNewUrlParser: true }
  );
  mongooseConnection.connection.db.dropDatabase();
  const seededUsers = await addUser({ password: String(ADMIN_PASSWORD), username: String(ADMIN_USERNAME) });
  console.log('seededUsers: ', seededUsers);

  process.exit(0);
})();

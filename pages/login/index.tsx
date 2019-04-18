import * as React from 'react';
import axios from 'axios';
import { Input, Button } from '../../components/';

const login = (user, errorSetter): void => {
  axios
    .post('api/auth/login', user)
    .then(() => {
      window.location.href = '/';
    })
    .catch((error) => errorSetter(error.response.data));
};

const Login: React.FunctionComponent = () => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const user = { username, password };
  const [errorMessage, setErrorMessage] = React.useState('');
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        login(user, setErrorMessage);
      }}
    >
      <Input fieldName="login" label="Username" value={username} onChange={setUsername} />
      <Input fieldName="password" label="Password" type="password" value={password} onChange={setPassword} />
      <Button type="submit" label="Submit" />
      <p>{errorMessage}</p>
    </form>
  );
};
export default Login;

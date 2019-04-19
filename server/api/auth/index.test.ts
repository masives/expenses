import { ERRORS } from '.';
import axios from 'axios';

const apiEndpoint = 'http://expenses_dev:3000/';

describe('Api - login', () => {
  it('returns error on invalid request', async () => {
    // given
    const username = '';
    const password = '';

    //when
    await axios.post(`${apiEndpoint}api/auth/login`, { username, password }).catch(({ response }) => {
      // then
      expect(response.status).toEqual(400);
      expect(response.data).toEqual(ERRORS.PROVIDE_CREDENTIALS);
    });
  });
});

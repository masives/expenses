import { ERRORS } from '.';
import axios from 'axios';
import { apiEndpoint, seededUser } from '../../../test-utils';

describe('Api - login', () => {
  it('should set JWT token cookie on correct credentials', async () => {
    // given
    const username = seededUser.username;
    const password = seededUser.password;

    //when
    const response = await axios.post(`${apiEndpoint}api/auth/login`, { password, username });
    // then
    expect(response.status).toEqual(200);
    expect(response.headers['set-cookie'][0]).toEqual(expect.stringContaining('jwt'));
  });
  describe('should return error on invalid request', () => {
    it('empty request', async () => {
      // when
      await axios.post(`${apiEndpoint}api/auth/login`).catch(({ response }) => {
        // then
        expect(response.status).toEqual(400);
        expect(response.data).toEqual(ERRORS.PROVIDE_CREDENTIALS);
      });
    });
    it('lack of username', async () => {
      //given
      const password = seededUser.password;
      // when
      await axios.post(`${apiEndpoint}api/auth/login`, { password }).catch(({ response }) => {
        // then
        expect(response.status).toEqual(400);
        expect(response.data).toEqual(ERRORS.PROVIDE_CREDENTIALS);
      });
    });
    it('lack of password', async () => {
      //given
      const username = seededUser.username;
      // when
      await axios.post(`${apiEndpoint}api/auth/login`, username).catch(({ response }) => {
        // then
        expect(response.status).toEqual(400);
        expect(response.data).toEqual(ERRORS.PROVIDE_CREDENTIALS);
      });
    });
  });

  it('should return error on invalid password', async () => {
    // given
    const username = seededUser.username;
    const password = 'someInvalidPassword';

    //when
    await axios.post(`${apiEndpoint}api/auth/login`, { password, username }).catch(({ response }) => {
      // then
      expect(response.status).toEqual(401);
      expect(response.data).toEqual(ERRORS.INCORRECT_CREDENTIALS);
    });
  });
});

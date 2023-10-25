import request from 'supertest'
import { app } from '../../src/app'
import { HTTP_STATUSES, RouterPaths } from '../../src/constants/global'
import { dbConnection, dbClear, dbDisconnect } from '../../src/db/mongo-db'
import { usersTestManager } from '../utils/usersTestManager'
import { authTestManager } from '../utils/authTestManager'

const getRequest = () => request(app)

describe('AUTH tests', () => {
  beforeAll(async () => {
    await dbConnection()
  })

  const creatingData = {
    login: 'uer156',
    email: 'some@some.com',
    password: '123456'
  }

  it('POST - success - login with user wich was created by admin', async () => {
    await usersTestManager.createUser(creatingData, HTTP_STATUSES.CREATED_201)
  
    const response = await getRequest()
      .post(`${RouterPaths.auth}/login`)
      .send({
        loginOrEmail: creatingData.email,
        password: creatingData.password
      })
      
      expect(response.status).toBe(HTTP_STATUSES.OK_200)
      expect(response.body.accessToken).toBeDefined()

      const refreshToken = response.headers['set-cookie'][0]
      expect(refreshToken).toMatch(/refreshToken=/)
  })

  it('POST - fail - login', async () => {
    await usersTestManager.createUser(creatingData, HTTP_STATUSES.CREATED_201)
  
    await getRequest()
      .post(`${RouterPaths.auth}/login`)
      .send({
        loginOrEmail: 'qwe',
        password: creatingData.password
      })
      .expect(HTTP_STATUSES.NOT_AUTHORIZED_401)
  })

  it('POST - success - registration', async () => {
    const response = await authTestManager.registration(creatingData)

    expect(response.response.status).toBe(HTTP_STATUSES.NO_CONTENT_204)
  })

  it('POST - fail - registration with incorrect data', async () => {
    await getRequest()
      .post(`${RouterPaths.auth}/registration`)
      .send({
        ...creatingData,
        login: 'qw'
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400)
  })

  it('POST - success - registration-email-resending', async () => {
    await authTestManager.registration(creatingData)

    const response = await getRequest()
      .post(`${RouterPaths.auth}/registration-email-resending`)
      .send({
        email: creatingData.email
      })
      .expect(HTTP_STATUSES.NO_CONTENT_204)

      expect(response.status).toBe(HTTP_STATUSES.NO_CONTENT_204)
  })

  it('POST - fail - registration-email-resending with not existed email', async () => {
    await authTestManager.registration(creatingData)

    await getRequest()
      .post(`${RouterPaths.auth}/registration-email-resending`)
      .send({
        email: 'someQWE@some.com'
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400)
  })

  it('POST - success - registration-confirmation', async () => {
    await authTestManager.registration(creatingData)
    const existedUser = await usersTestManager.getUserByEmail(creatingData.email)

    await getRequest()
      .post(`${RouterPaths.auth}/registration-confirmation`)
      .send({
        code: existedUser?.emailConfirmation.confirmationCode
      })
      .expect(HTTP_STATUSES.NO_CONTENT_204)
  })

  it('POST - fail - registration-confirmation with incorrect code', async () => {
    await authTestManager.registration(creatingData)

    await getRequest()
      .post(`${RouterPaths.auth}/registration-confirmation`)
      .send({
        code: 'dkffkdf-12232323-dfkdfkdfkdfk'
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400)
  })

  it('GET - success - me', async () => {
    await authTestManager.registration(creatingData)
    const existedUser = await usersTestManager.getUserByEmail(creatingData.email)

    await getRequest()
      .post(`${RouterPaths.auth}/registration-confirmation`)
      .send({
        code: existedUser?.emailConfirmation.confirmationCode
      })
      .expect(HTTP_STATUSES.NO_CONTENT_204)

    const response = await authTestManager.login({
      loginOrEmail: creatingData.email,
      password: creatingData.password
    })

    const responseq = await getRequest()
      .get(`${RouterPaths.auth}/me`)
      .set({Authorization: `Bearer ${response.entity.accessToken}`})
      .expect(HTTP_STATUSES.OK_200, {
        userId: existedUser!.accountData.id,
        email: existedUser!.accountData.email,
        login: existedUser!.accountData.login
      })
  })

  afterEach(async () => {
    await dbClear()
  })

  afterAll(async () => {
    await dbClear()
    await dbDisconnect()
  })
})

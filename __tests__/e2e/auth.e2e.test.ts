import request from 'supertest'
import { app } from '../../src/app'
import { HTTP_STATUSES, RouterPaths } from '../../src/constants/global'
import { dbConnection, dbClear, dbDisconnect } from '../../src/db/mongo-db'
import { usersTestManager } from '../utils/usersTestManager'

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

  it('POST - success - login', async () => {
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
    const response = await getRequest()
      .post(`${RouterPaths.auth}/registration`)
      .send(creatingData)
      
      expect(response.status).toBe(HTTP_STATUSES.NO_CONTENT_204)
  })

  it('POST - fail - registration', async () => {
    await getRequest()
      .post(`${RouterPaths.auth}/registration`)
      .send({
        ...creatingData,
        login: 'qw'
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400)
  })

  afterEach(async () => {
    await dbClear()
  })

  afterAll(async () => {
    await dbClear()
    await dbDisconnect()
  })
})

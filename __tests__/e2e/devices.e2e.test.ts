import request from 'supertest'
import { app } from '../../src/app'
import { HTTP_STATUSES, RouterPaths } from '../../src/constants/global'
import { dbConnection, dbClear, dbDisconnect } from '../../src/db/mongo-db'
import { usersTestManager } from '../utils/usersTestManager'
import { authTestManager } from '../utils/authTestManager'

const getRequest = () => request(app)

describe('DEVICES tests', () => {
  beforeAll(async () => {
    await dbConnection()
  })

  const creatingData = {
    login: 'uer156',
    email: 'some@some.com',
    password: '123456'
  }

  it('GET - success - get devices list', async () => {
    await usersTestManager.createUser(creatingData, HTTP_STATUSES.CREATED_201)
    const {response: loginResponse} = await authTestManager.login({
      loginOrEmail: creatingData.email,
      password: creatingData.password
    },
    { 'X-Forwarded-For': '192.168.2.1' }
    )
  
    const response = await getRequest()
      .get(`${RouterPaths.security}/devices`)
      .set({'cookie': loginResponse.headers['set-cookie'][0]})

      
    //   expect(response.status).toBe(HTTP_STATUSES.OK_200)
    //   expect(response.body.accessToken).toBeDefined()

    //   const refreshToken = response.headers['set-cookie'][0]
    //   expect(refreshToken).toMatch(/refreshToken=/)
  })

  it('DELETE - success - delete device by id', async () => {
    await usersTestManager.createUser(creatingData, HTTP_STATUSES.CREATED_201)
    await authTestManager.login({
      loginOrEmail: creatingData.email,
      password: creatingData.password
    })
    const {response: loginResponse} = await authTestManager.login({
      loginOrEmail: creatingData.email,
      password: creatingData.password
    })

    const response = await getRequest()
      .get(`${RouterPaths.security}/devices`)
      .set({'cookie': loginResponse.headers['set-cookie'][0]})
      console.log("----", loginResponse.headers['set-cookie'][0])

    await getRequest()
      .delete(`${RouterPaths.security}/devices/${response.body[0].deviceId}`)
      .set({'cookie': loginResponse.headers['set-cookie'][0]})
      .expect(HTTP_STATUSES.NO_CONTENT_204)
    
    const response2 = await getRequest()
      .get(`${RouterPaths.security}/devices`)
      .set({'cookie': loginResponse.headers['set-cookie'][0]})
  })

  it('DELETE - fail - delete device by id', async () => {
    await usersTestManager.createUser(creatingData, HTTP_STATUSES.CREATED_201)
    const {response: loginResponse} = await authTestManager.login({
      loginOrEmail: creatingData.email,
      password: creatingData.password
    })

    await getRequest()
      .delete(`${RouterPaths.security}/devices/1`)
      .set({'cookie': loginResponse.headers['set-cookie'][0]})
      .expect(HTTP_STATUSES.NOT_FOUND_404)
  })

  it('DELETE - fail - delete device by id with incorrect token', async () => {
    await usersTestManager.createUser(creatingData, HTTP_STATUSES.CREATED_201)
    await authTestManager.login({
      loginOrEmail: creatingData.email,
      password: creatingData.password
    })

    await getRequest()
      .delete(`${RouterPaths.security}/devices`)
      .set({})
      .expect(HTTP_STATUSES.NOT_AUTHORIZED_401)
  })

  afterEach(async () => {
    await dbClear()
  })

  afterAll(async () => {
    await dbClear()
    await dbDisconnect()
  })
})

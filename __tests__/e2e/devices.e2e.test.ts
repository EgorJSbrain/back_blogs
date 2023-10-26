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
  const creatingData2 = {
    login: 'uer1567',
    email: 'some1@some.com',
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
  
    await getRequest()
      .get(`${RouterPaths.security}/devices`)
      .set({'cookie': loginResponse.headers['set-cookie'][0]})
  })

  it('DELETE - success - delete device by id', async () => {
    await usersTestManager.createUser(creatingData, HTTP_STATUSES.CREATED_201)
    await authTestManager.login({
      loginOrEmail: creatingData.email,
      password: creatingData.password
    })
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

    await getRequest()
      .delete(`${RouterPaths.security}/devices/${response.body[0].deviceId}`)
      .set({'cookie': loginResponse.headers['set-cookie'][0]})
      .expect(HTTP_STATUSES.NO_CONTENT_204)
    
    const response2 = await getRequest()
      .get(`${RouterPaths.security}/devices`)
      .set({'cookie': loginResponse.headers['set-cookie'][0]})

      expect(response.body.length - 1).toEqual(response2.body.length)
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

  it('DELETE - sucess - delete devices list, excepted current divice', async () => {
    await usersTestManager.createUser(creatingData, HTTP_STATUSES.CREATED_201)
    await authTestManager.login({
      loginOrEmail: creatingData.email,
      password: creatingData.password
    })
    await authTestManager.login({
      loginOrEmail: creatingData.email,
      password: creatingData.password
    })
    await authTestManager.login({
      loginOrEmail: creatingData.email,
      password: creatingData.password
    })
    await authTestManager.login({
      loginOrEmail: creatingData.email,
      password: creatingData.password
    })
    const { response } = await authTestManager.login({
      loginOrEmail: creatingData.email,
      password: creatingData.password
    })

    const devices = await getRequest()
      .get(`${RouterPaths.security}/devices`)
      .set({'cookie': response.headers['set-cookie'][0]})

    await getRequest()
      .delete(`${RouterPaths.security}/devices`)
      .set({'cookie': response.headers['set-cookie'][0]})
      .expect(HTTP_STATUSES.NO_CONTENT_204)
    
    await getRequest()
      .get(`${RouterPaths.security}/devices`)
      .set({'cookie': response.headers['set-cookie'][0]})
      .expect(HTTP_STATUSES.OK_200, [devices.body[devices.body.length - 1]])
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

  it('DELETE - success - delete device of another user. Should get 403 error', async () => {
    await authTestManager.registration(creatingData)
    const existedUser = await usersTestManager.getUserByEmail(creatingData.email)

    await getRequest()
      .post(`${RouterPaths.auth}/registration-confirmation`)
      .send({
        code: existedUser?.emailConfirmation.confirmationCode
      })
      .expect(HTTP_STATUSES.NO_CONTENT_204)

    const { response: user } = await authTestManager.login({
      loginOrEmail: creatingData.email,
      password: creatingData.password
    },
    { 'user-agent': '192.168.2.1' }
    )

    await usersTestManager.createUser(creatingData2, HTTP_STATUSES.CREATED_201)

    const { response: user2 } = await authTestManager.login({
      loginOrEmail: creatingData2.email,
      password: creatingData2.password
    },
    { 'user-agent': '192.168.2.1' }
    )

    const devices = await getRequest()
      .get(`${RouterPaths.security}/devices`)
      .set({'cookie': user.headers['set-cookie'][0]})

    await getRequest()
      .delete(`${RouterPaths.security}/devices/${devices.body[0].deviceId}`)
      .set({'cookie': user2.headers['set-cookie'][0], 'user-agent': '192.168.2.1' })
      .expect(HTTP_STATUSES.FORBIDEN_403)
  })

  afterEach(async () => {
    await dbClear()
  })

  afterAll(async () => {
    await dbClear()
    await dbDisconnect()
  })
})

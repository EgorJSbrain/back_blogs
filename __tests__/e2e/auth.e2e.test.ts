import request from 'supertest'
import { app } from '../../src/app'
import { HTTP_STATUSES, RouterPaths } from '../../src/constants/global'
import { videosTestManager } from '../utils/videosTestManager'
import { VideoAvailableResolutions } from '../../src/constants/videos'
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
  
    await getRequest()
      .post(`${RouterPaths.auth}/login`)
      .send({
        loginOrEmail: creatingData.email,
        password: creatingData.password
      })
      .expect(HTTP_STATUSES.NO_CONTENT_204)
  })

  it('POST - fail - login', async () => {
    await usersTestManager.createUser(creatingData, HTTP_STATUSES.CREATED_201)
  
    await getRequest()
      .post(`${RouterPaths.auth}/login`)
      .send({
        loginOrEmail: 'qwe',
        password: creatingData.password
      })
      .expect(HTTP_STATUSES.NOT_AUTHORIZED_401);

  })

  afterEach(async () => {
    await dbClear()
  })

  afterAll(async () => {
    await dbClear()
    await dbDisconnect()
  })
})

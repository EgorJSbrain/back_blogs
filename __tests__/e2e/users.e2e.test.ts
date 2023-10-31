import request from 'supertest'
import { generateApp } from '../../src/app'
import { authUser } from '../../src/db/db'
import { dbConnection, dbClear, dbDisconnect } from '../../src/db/mongo-db'
import { usersTestManager } from '../utils/usersTestManager'
import { HTTP_STATUSES, RouterPaths } from '../../src/constants/global'

const getRequest = () => request(generateApp())

const responseData = {
  pagesCount: 0,
  page: 1,
  pageSize: 10,
  totalCount: 0,
  items: []
}

describe('Users tests', () => {
  beforeAll(async () => {
    await dbConnection()
  })

  const creatingData = {
    login: 'uer156',
    email: 'some@some.com',
    password: '123456'
  }

  const creatingData2 = {
    login: 'uer2',
    email: 'some2@some.com',
    password: '123456'
  }

  it('GET - success - get empty array of users', async () => {
    await getRequest()
      .get(RouterPaths.users)
      .expect(HTTP_STATUSES.OK_200, responseData)
  })

  it('GET - fail - get not existing users', async () => {
    await getRequest()
      .get(`${RouterPaths.users}/1`)
      .expect(HTTP_STATUSES.NOT_FOUND_404)
  })

  it('GET - success - request with search param: sortDirection=asc, sortBy=login. Get array with searched users', async () => {
    const { entity: user1 } = await usersTestManager.createUser(creatingData, HTTP_STATUSES.CREATED_201)
    const { entity: user2 } = await usersTestManager.createUser(creatingData2, HTTP_STATUSES.CREATED_201)

    await getRequest().get(`${RouterPaths.users}?sortDirection=asc&sortBy=login`).expect(HTTP_STATUSES.OK_200, {
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 2,
      items: [user1, user2]
    })
  })

  it('GET - fail - request with search param: searchLoginTerm=156, sortBy=login. Get array with searched users', async () => {
    const { entity: user1 } = await usersTestManager.createUser(creatingData, HTTP_STATUSES.CREATED_201)
    await usersTestManager.createUser(creatingData2, HTTP_STATUSES.CREATED_201)

    await getRequest().get(`${RouterPaths.users}?searchLoginTerm=156&sortBy=login`).expect(HTTP_STATUSES.OK_200, {
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 1,
      items: [user1]
    })
  })

  it('GET - fail - request with search param: searchLoginTerm=uer2, searchEmailTerm=some2@, sortBy=login. Get array with searched users', async () => {
    await usersTestManager.createUser(creatingData, HTTP_STATUSES.CREATED_201)
    const { entity: user2 } = await usersTestManager.createUser(creatingData2, HTTP_STATUSES.CREATED_201)

    await getRequest().get(`${RouterPaths.users}?searchLoginTerm=uer2&searchEmailTerm=some2@&sortBy=login`).expect(HTTP_STATUSES.OK_200, {
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 1,
      items: [user2]
    })
  })

  it('POST - fail - creating user with incorrect data', async () => {
    const data = { login: '', email: 'some@some.com', password: '123234' }

    await usersTestManager.createUser(data, HTTP_STATUSES.BAD_REQUEST_400)

    await getRequest()
      .get(RouterPaths.users)
      .expect(HTTP_STATUSES.OK_200, responseData)
  })

  it('POST - success - creating user with correct data', async () => {
    const { entity } = await usersTestManager.createUser(
      creatingData,
      HTTP_STATUSES.CREATED_201
    )

    await getRequest()
      .get(RouterPaths.users)
      .expect(HTTP_STATUSES.OK_200, {
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [entity]
      })
  })

  it('POST - fail - creating user with the same data', async () => {
    await usersTestManager.createUser(
      creatingData,
      HTTP_STATUSES.CREATED_201
    )
  
    await usersTestManager.createUser(
      creatingData,
      HTTP_STATUSES.BAD_REQUEST_400
    )
  })

  it('DELETE - success delete video with correct id', async () => {
    const { entity } = await usersTestManager.createUser(
      creatingData,
      HTTP_STATUSES.CREATED_201
    )

    await getRequest()
      .delete(`${RouterPaths.users}/${entity.id}`)
      .set({ Authorization: `Basic ${authUser.password}` })
      .expect(HTTP_STATUSES.NO_CONTENT_204)
  })

  it('DELETE - success delete post with correct id', async () => {
    const { entity: user1 } = await usersTestManager.createUser(
      creatingData,
      HTTP_STATUSES.CREATED_201
    )
    const creatingData2 = {
      login: 'uer2',
      email: 'some2@some.com',
      password: '1234567'
    }
    const { entity: user2 } = await usersTestManager.createUser(
      creatingData2,
      HTTP_STATUSES.CREATED_201
    )

    await getRequest()
      .delete(`${RouterPaths.users}/${user1.id}`)
      .set({ Authorization: `Basic ${authUser.password}` })
      .expect(HTTP_STATUSES.NO_CONTENT_204)

    await getRequest()
      .get(RouterPaths.users)
      .expect(HTTP_STATUSES.OK_200, {
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [user2]
      })
  })

  it('DELETE - fail delete post with incorrect id', async () => {
    await usersTestManager.createUser(creatingData, HTTP_STATUSES.CREATED_201)

    await getRequest()
      .delete(`${RouterPaths.users}/1`)
      .set({ Authorization: `Basic ${authUser.password}` })
      .expect(HTTP_STATUSES.NOT_FOUND_404)
  })

  afterEach(async () => {
    await dbClear()
  })

  afterAll(async () => {
    await dbClear()
    await dbDisconnect()
  })
})

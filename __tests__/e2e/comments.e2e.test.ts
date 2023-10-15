import request from 'supertest'
import { app } from '../../src/app'
import { HTTP_STATUSES, RouterPaths } from '../../src/constants/global'
import { dbClear, dbConnection, dbDisconnect } from '../../src/db/mongo-db'
import { commetnsTestManager } from '../utils/commentsTestManager'

const getRequest = () => request(app)

const responseData = {
  pagesCount: 0,
  page: 1,
  pageSize: 10,
  totalCount: 0,
  items: []
}

describe('COMMENTS tests', () => {
  beforeAll(async () => {
    await dbConnection()
  })

  const creatingData = {
    content: 'some content for creatin comment more than 20 symbols'
  }

  it('GET - success - get comment by id', async () => {
    const { entity } = await commetnsTestManager.createComment(creatingData, HTTP_STATUSES.CREATED_201)

    await getRequest().get(`${RouterPaths.comments}/${entity.id}`).expect(HTTP_STATUSES.OK_200, entity)
  })

  it('GET - success - get comments of some post by postId', async () => {
    const { entity, post } = await commetnsTestManager.createComment(creatingData, HTTP_STATUSES.CREATED_201)

    await getRequest().get(`${RouterPaths.posts}/${post.id}/comments`).expect(HTTP_STATUSES.OK_200, {
      ...responseData,
      pagesCount: 1,
      totalCount: 1,
      items: [entity]
    })
  })

  it('POST - success - create and get comment', async () => {
    const { entity } = await commetnsTestManager.createComment(creatingData, HTTP_STATUSES.CREATED_201)

    await getRequest().get(`${RouterPaths.comments}/${entity.id}`).expect(HTTP_STATUSES.OK_200, entity)
  })

  it('PUT - success - update and comment', async () => {
    const updatingData = {
      content: 'NEW some content for updating comment'
    }
    const { entity, token } = await commetnsTestManager.createComment(creatingData, HTTP_STATUSES.CREATED_201)

    await getRequest()
      .put(`${RouterPaths.comments}/${entity.id}`)
      .set({ Authorization: `Bearer ${token.accessToken}` })
      .send(updatingData)
      .expect(HTTP_STATUSES.NO_CONTENT_204)

    await getRequest().get(`${RouterPaths.comments}/${entity.id}`).expect(HTTP_STATUSES.OK_200, {
      ...entity,
      content: updatingData.content
    })
  })

  it('DELETE - success - delete comment by id', async () => {
    const { entity, token } = await commetnsTestManager.createComment(creatingData, HTTP_STATUSES.CREATED_201)

    await getRequest()
      .delete(`${RouterPaths.comments}/${entity.id}`)
      .set({ Authorization: `Bearer ${token.accessToken}` })
      .expect(HTTP_STATUSES.NO_CONTENT_204)
    await getRequest().get(`${RouterPaths.comments}/${entity.id}`).expect(HTTP_STATUSES.NOT_FOUND_404)
  })

  afterEach(async () => {
    await dbClear()
  })

  afterAll(async () => {
    await dbClear()
    await dbDisconnect()
  })
})

import request from 'supertest'
import { app } from '../../src/app'
import { HTTP_STATUSES, RouterPaths } from '../../src/constants/global'
import { blogsTestManager } from '../utils/blogsTestManager'
import { authUser } from '../../src/db/db'

const getRequest = () => request(app)

describe('BLOGS tests', () => {
  beforeAll(async () => {
    await getRequest().delete(`${RouterPaths.testing}/data`)
  })

  it('GET - success - get empty array of blogs', async () => {
    await getRequest().get(RouterPaths.blogs).expect(HTTP_STATUSES.OK_200, [])
  })

  it('GET - fail - get not existing blog', async () => {
    await getRequest().get(`${RouterPaths.blogs}/1`).expect(HTTP_STATUSES.NOT_FOUND_404)
  })

  it ('POST - fail - creating blog with incorrect data', async () => {
    const data = { name: '', description: 'author name', websiteUrl: 'https://www.google.pl/?hl=pl' }

    await blogsTestManager.createBlog(data, HTTP_STATUSES.BAD_REQUEST_400)

    await getRequest().get(RouterPaths.blogs).expect(HTTP_STATUSES.OK_200, [])
  })

  it ('POST - success - creating blog with correct data', async () => {
    const data = { name: 'some name', description: 'author name', websiteUrl: 'https://www.google.pl/?hl=pl' }

    const { entity } = await blogsTestManager.createBlog(data, HTTP_STATUSES.CREATED_201)

    const response = await getRequest().get(RouterPaths.blogs).expect(HTTP_STATUSES.OK_200)

    expect([entity]).toEqual(response.body)
  })

  it ('PUT - success updating blog with correct data', async () => {
    const creatingData = { name: 'some name', description: 'author name', websiteUrl: 'https://www.google.pl/?hl=pl' }
    const updatingData = { name: 'new NAME' }

    const { entity: createdBlog } = await blogsTestManager.createBlog(creatingData, HTTP_STATUSES.CREATED_201)

    const data = {
      ...createdBlog,
      ...updatingData,
    }

    await getRequest()
      .put(`${RouterPaths.blogs}/${createdBlog.id}`)
      .set({ Authorization: `Basic ${authUser.password}` })
      .send(data)
      .expect(HTTP_STATUSES.NO_CONTENT_204)

    const existedBlog = await getRequest().get(`${RouterPaths.blogs}/${createdBlog.id}`).expect(HTTP_STATUSES.OK_200)
    const updatedBlog = {
      ...createdBlog,
      ...updatingData,
    }

    expect(updatedBlog).toEqual(existedBlog.body)
  })

  it ('PUT - fail updating blog with incorrect id', async () => {
    const creatingData = { name: 'some name', description: 'author name', websiteUrl: 'https://www.google.pl/?hl=pl' }
    const updatingData = { title: 'new title' }

    await blogsTestManager.createBlog(creatingData, HTTP_STATUSES.CREATED_201)

    await getRequest()
      .put(`${RouterPaths.blogs}/1`)
      .set({ Authorization: `Basic ${authUser.password}` })
      .send(updatingData)
      .expect(HTTP_STATUSES.NOT_FOUND_404)
  })

  it ('DELETE - success delete blog with correct id', async () => {
    const creatingData = { name: 'some name', description: 'author name', websiteUrl: 'https://www.google.pl/?hl=pl' }

    const { entity } = await blogsTestManager.createBlog(creatingData, HTTP_STATUSES.CREATED_201)

    await getRequest()
      .delete(`${RouterPaths.blogs}/${entity.id}`)
      .set({ Authorization: `Basic ${authUser.password}` })
      .expect(HTTP_STATUSES.NO_CONTENT_204)
  })

  it ('DELETE - fail delete blog with incorrect id', async () => {
    const creatingData = { name: 'some name', description: 'author name', websiteUrl: 'https://www.google.pl/?hl=pl' }

    await blogsTestManager.createBlog(creatingData, HTTP_STATUSES.CREATED_201)

    await getRequest()
      .delete(`${RouterPaths.blogs}/1`)
      .set({ Authorization: `Basic ${authUser.password}` })
      .expect(HTTP_STATUSES.NOT_FOUND_404)
  })
})

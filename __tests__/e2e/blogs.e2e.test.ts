import request from 'supertest'
import { generateApp } from '../../src/app'
import { HTTP_STATUSES, RouterPaths } from '../../src/constants/global'
import { blogsTestManager } from '../utils/blogsTestManager'
import { authUser } from '../../src/db/db'
import { dbConnection, dbClear, dbDisconnect } from '../../src/db/mongo-db'

const getRequest = () => request(generateApp())

const responseData = {
  pagesCount: 0,
  page: 1,
  pageSize: 10,
  totalCount: 0,
  items: []
}

describe('BLOGS tests', () => {
  beforeAll(async () => {
    await dbConnection()
  })

  const creatingData = { name: 'some name', description: 'author name', websiteUrl: 'https://www.google.pl' }

  it('GET - success - get empty array of blogs', async () => {
    await getRequest().get(RouterPaths.blogs).expect(HTTP_STATUSES.OK_200, responseData)
  })

  it('GET - success - get array with created blog', async () => {
    const { entity } = await blogsTestManager.createBlog(creatingData, HTTP_STATUSES.CREATED_201)
  
    await getRequest().get(RouterPaths.blogs).expect(HTTP_STATUSES.OK_200, {
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 1,
      items: [entity]
    })
  })

  it('GET - success - request with search param: searchNameTerm. Get array with searched blog', async () => {
    const data1 = { name: 'some name', description: 'author name', websiteUrl: 'https://www.google.pl' }
    const { entity: blog1 } = await blogsTestManager.createBlog(data1, HTTP_STATUSES.CREATED_201)

    const data2 = { name: 'user', description: 'author name sec', websiteUrl: 'https://www.google.pl' }
    await blogsTestManager.createBlog(data2, HTTP_STATUSES.CREATED_201)

    await getRequest().get(`${RouterPaths.blogs}?searchNameTerm=name`).expect(HTTP_STATUSES.OK_200, {
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 1,
      items: [blog1]
    })
  })

  it('GET - success - request with search param: sortDirection=desc. Get array with searched posts', async () => {
    const { entity: blog1 } = await blogsTestManager.createBlog(creatingData, HTTP_STATUSES.CREATED_201)
    const { entity: blog2 } = await blogsTestManager.createBlog(creatingData, HTTP_STATUSES.CREATED_201)

    await getRequest().get(`${RouterPaths.blogs}?sortDirection=desc`).expect(HTTP_STATUSES.OK_200, {
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 2,
      items: [blog2, blog1]
    })
  })

  it('GET - success - request with search param: sortDirection=asc. Get array with searched posts', async () => {
    const { entity: blog1 } = await blogsTestManager.createBlog(creatingData, HTTP_STATUSES.CREATED_201)
    const { entity: blog2 } = await blogsTestManager.createBlog(creatingData, HTTP_STATUSES.CREATED_201)

    await getRequest().get(`${RouterPaths.blogs}?sortDirection=asc`).expect(HTTP_STATUSES.OK_200, {
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 2,
      items: [blog1, blog2]
    })
  })

  it('GET - success - request with search param: searchNameTerm. Get array with searched blog', async () => {
    const data1 = { name: 'some name', description: 'author name', websiteUrl: 'https://www.google.pl' }
    const { entity: blog1 } = await blogsTestManager.createBlog(data1, HTTP_STATUSES.CREATED_201)

    const data2 = { name: 'user NA', description: 'author name', websiteUrl: 'https://www.google.pl' }
    const { entity: blog2 } = await blogsTestManager.createBlog(data2, HTTP_STATUSES.CREATED_201)

    await getRequest().get(`${RouterPaths.blogs}?searchNameTerm=na`).expect(HTTP_STATUSES.OK_200, {
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 2,
      items: [blog2, blog1]
    })
  })

  it('GET - seccess - request with search params: searchNameTerm, sortDirection. Get array with searched blog in corect order', async () => {
    const data1 = { name: 'some name', description: 'author name', websiteUrl: 'https://www.google.pl' }
    const { entity: blog1 } = await blogsTestManager.createBlog(data1, HTTP_STATUSES.CREATED_201)

    const data2 = { name: 'user NA', description: 'author name', websiteUrl: 'https://www.google.pl' }
    const { entity: blog2 } = await blogsTestManager.createBlog(data2, HTTP_STATUSES.CREATED_201)

    await getRequest().get(`${RouterPaths.blogs}?searchNameTerm=na&sortDirection=asc`).expect(HTTP_STATUSES.OK_200, {
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 2,
      items: [blog1, blog2]
    })
  })

  it('GET - success - request with search params: searchNameTerm, sortDirection. Get empty array ', async () => {
    const data1 = { name: 'some name', description: 'author name', websiteUrl: 'https://www.google.pl' }
    await blogsTestManager.createBlog(data1, HTTP_STATUSES.CREATED_201)
  
    await getRequest().get(`${RouterPaths.blogs}?searchNameTerm=user`).expect(HTTP_STATUSES.OK_200, {
      pagesCount: 0,
      page: 1,
      pageSize: 10,
      totalCount: 0,
      items: []
    })
  })

  it('GET - fail - get not existing blog', async () => {
    await getRequest().get(`${RouterPaths.blogs}/1`).expect(HTTP_STATUSES.NOT_FOUND_404)
  })

  it ('POST - fail - creating blog with incorrect data', async () => {
    const data = { name: '', description: 'author name', websiteUrl: 'https://www.google.pl' }

    await blogsTestManager.createBlog(data, HTTP_STATUSES.BAD_REQUEST_400)

    await getRequest().get(RouterPaths.blogs).expect(HTTP_STATUSES.OK_200, responseData)
  })

  it ('POST - success - creating blog with correct data', async () => {
    const { entity } = await blogsTestManager.createBlog(creatingData, HTTP_STATUSES.CREATED_201)

    const response = await getRequest().get(`${RouterPaths.blogs}/${entity.id}`).expect(HTTP_STATUSES.OK_200)

    expect(entity).toEqual(response.body)
  })

  it ('PUT - success updating blog with correct data', async () => {
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

    const { entity: createdBlog} = await blogsTestManager.createBlog(creatingData, HTTP_STATUSES.CREATED_201)

    const updatingData = {
      ...createdBlog,
      name: 'NEW NAME',
    }

    await getRequest()
      .put(`${RouterPaths.blogs}/1`)
      .set({ Authorization: `Basic ${authUser.password}` })
      .send(updatingData)
      .expect(HTTP_STATUSES.NOT_FOUND_404)
  })

  it ('DELETE - success delete blog with correct id', async () => {

    const { entity } = await blogsTestManager.createBlog(creatingData, HTTP_STATUSES.CREATED_201)

    await getRequest()
      .delete(`${RouterPaths.blogs}/${entity.id}`)
      .set({ Authorization: `Basic ${authUser.password}` })
      .expect(HTTP_STATUSES.NO_CONTENT_204)
  })

  it ('DELETE - success delete blog with correct id', async () => {
    const { entity: blog1 } = await blogsTestManager.createBlog(creatingData, HTTP_STATUSES.CREATED_201)
    const { entity: blog2 } = await blogsTestManager.createBlog(creatingData, HTTP_STATUSES.CREATED_201)

    await getRequest()
      .delete(`${RouterPaths.blogs}/${blog1.id}`)
      .set({ Authorization: `Basic ${authUser.password}` })
      .expect(HTTP_STATUSES.NO_CONTENT_204)
    
      await getRequest().get(RouterPaths.blogs).expect(HTTP_STATUSES.OK_200, {
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [blog2]
      })
  })

  it ('DELETE - fail delete blog with incorrect id', async () => {

    await blogsTestManager.createBlog(creatingData, HTTP_STATUSES.CREATED_201)

    await getRequest()
      .delete(`${RouterPaths.blogs}/1`)
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

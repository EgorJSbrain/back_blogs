import request from 'supertest'
import { app } from '../../src/app'
import { HTTP_STATUSES, RouterPaths } from '../../src/constants/global'
import { postsTestManager } from '../utils/postsTestManager'
import { blogsTestManager } from '../utils/blogsTestManager'
import { authUser } from '../../src/db/db'
import { dbClear, dbConnection, dbDisconnect } from '../../src/db/mongo-db'

const getRequest = () => request(app)

const responseData = {
  pagesCount: 0,
  page: 1,
  pageSize: 10,
  totalCount: 0,
  items: []
}

describe('POSTS tests', () => {
  beforeAll(async () => {
    await dbConnection()
  })

  const creatingData = {
    title: 'title',
    content: 'test content',
    shortDescription: 'test description',
  }

  it('GET - success - get empty array of posts', async () => {
    await getRequest().get(RouterPaths.posts).expect(HTTP_STATUSES.OK_200, responseData)
  })

  it('GET - success - get array with created blog', async () => {
    const { entity } = await postsTestManager.createPost(creatingData, HTTP_STATUSES.CREATED_201)
  
    await getRequest().get(RouterPaths.posts).expect(HTTP_STATUSES.OK_200, {
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 1,
      items: [entity]
    })
  })

  it('GET - success - request with search param: sortDirection=desc. Get array with searched posts', async () => {
    const { entity: post1 } = await postsTestManager.createPost(creatingData, HTTP_STATUSES.CREATED_201)
    const { entity: post2 } = await postsTestManager.createPost(creatingData, HTTP_STATUSES.CREATED_201)

    await getRequest().get(`${RouterPaths.posts}?sortDirection=desc`).expect(HTTP_STATUSES.OK_200, {
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 2,
      items: [post2, post1]
    })
  })

  it('GET - success - request with search param: sortDirection=asc. Get array with searched posts', async () => {
    const { entity: post1 } = await postsTestManager.createPost(creatingData, HTTP_STATUSES.CREATED_201)
    const { entity: post2 } = await postsTestManager.createPost(creatingData, HTTP_STATUSES.CREATED_201)

    await getRequest().get(`${RouterPaths.posts}?sortDirection=asc`).expect(HTTP_STATUSES.OK_200, {
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 2,
      items: [post1, post2]
    })
  })

  it('GET - success - request with search param: sortDirection=asc, sortBy=title. Get array with searched posts', async () => {
    const creatingData1: Record<string, string> = {
      title: 'a title',
      content: 'test content',
      shortDescription: 'test description',
    }
    const creatingData2: Record<string, string> = {
      title: 'b title',
      content: 'test content',
      shortDescription: 'test description',
    }
    const { entity: post1 } = await postsTestManager.createPost(creatingData1, HTTP_STATUSES.CREATED_201)
    const { entity: post2 } = await postsTestManager.createPost(creatingData2, HTTP_STATUSES.CREATED_201)

    await getRequest().get(`${RouterPaths.posts}?sortBy=title`).expect(HTTP_STATUSES.OK_200, {
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 2,
      items: [post2, post1]
    })
  })

  it('GET - success - request with search param: sortDirection=asc, sortBy=title. Get array with searched posts', async () => {
    const creatingData1: Record<string, string> = {
      title: 'a title',
      content: 'test content',
      shortDescription: 'test description',
    }
    const creatingData2: Record<string, string> = {
      title: 'b title',
      content: 'test content',
      shortDescription: 'test description',
    }
    const { entity: post1 } = await postsTestManager.createPost(creatingData1, HTTP_STATUSES.CREATED_201)
    const { entity: post2 } = await postsTestManager.createPost(creatingData2, HTTP_STATUSES.CREATED_201)

    await getRequest().get(`${RouterPaths.posts}?sortDirection=asc&sortBy=title`).expect(HTTP_STATUSES.OK_200, {
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 2,
      items: [post1, post2]
    })
  })

  it('GET - fail - get not existing posts', async () => {
    await getRequest().get(`${RouterPaths.posts}/1`).expect(HTTP_STATUSES.NOT_FOUND_404)
  })

  it ('POST - fail - creating post with incorrect data', async () => {
    const blogData = { name: 'some name', description: 'author name', websiteUrl: 'https://www.google.pl/?hl=pl' }
    const { entity: createdBlog } = await blogsTestManager.createBlog(blogData, HTTP_STATUSES.CREATED_201)
    const { entity: foundBlog } = await blogsTestManager.getBlogById(createdBlog.id)
    const creatingData = { title: '', blogId: foundBlog.id, content: '', shortDescription: '', blogName: foundBlog.name }

    await postsTestManager.createPost(creatingData, HTTP_STATUSES.BAD_REQUEST_400)

    await getRequest().get(RouterPaths.posts).expect(HTTP_STATUSES.OK_200, responseData)
  })

  it ('POST - success - creating post with correct data', async () => {
    const blogData = { name: 'some name', description: 'author name', websiteUrl: 'https://www.google.pl/?hl=pl' }
    const { entity: createdBlog } = await blogsTestManager.createBlog(blogData, HTTP_STATUSES.CREATED_201)

    const data = {
      title: 'dfdfdfdf',
      blogId: createdBlog.id,
      content: 'dfdfdfdf',
      shortDescription: 'dfdfdfdfdf',
      blogName: createdBlog.name
    }

    const { entity } = await postsTestManager.createPost(creatingData, HTTP_STATUSES.CREATED_201)

    const response = await getRequest().get(`${RouterPaths.posts}/${entity.id}`).expect(HTTP_STATUSES.OK_200)

    expect(entity).toEqual(response.body)
  })

  it ('PUT - success updating post with correct data', async () => {
    const creatingData: Record<string, string> = {
      title: 'title',
      content: 'test content',
      shortDescription: 'test description',
    }

    const updatingData = {
      title: 'NEW TITLE',
    }

    const { entity: createdPost } = await postsTestManager.createPost(creatingData, HTTP_STATUSES.CREATED_201)

    const data = {
      ...createdPost,
      ...updatingData,
    }

    await getRequest()
      .put(`${RouterPaths.posts}/${createdPost.id}`)
      .set({ Authorization: `Basic ${authUser.password}` })
      .send(data)
      .expect(HTTP_STATUSES.NO_CONTENT_204)

    const existedPost = await getRequest().get(`${RouterPaths.posts}/${createdPost.id}`).expect(HTTP_STATUSES.OK_200)
    const updatedPost = {
      ...createdPost,
      ...updatingData,
    }

    expect(updatedPost).toEqual(existedPost.body)
  })

  it ('PUT - fail updating post with incorrect id', async () => {
    const { entity: createdPost } = await postsTestManager.createPost(creatingData, HTTP_STATUSES.CREATED_201)

    const updatingData = {
      ...createdPost,
      title: 'NEW TITLE',
    }

    await getRequest()
      .put(`${RouterPaths.posts}/1`)
      .set({ Authorization: `Basic ${authUser.password}` })
      .send(updatingData)
      .expect(HTTP_STATUSES.NOT_FOUND_404)
  })

  it ('DELETE - success delete post with correct id', async () => {
    const { entity } = await postsTestManager.createPost(creatingData, HTTP_STATUSES.CREATED_201)

    await getRequest()
      .delete(`${RouterPaths.posts}/${entity.id}`)
      .set({ Authorization: `Basic ${authUser.password}` })
      .expect(HTTP_STATUSES.NO_CONTENT_204)
  })

  it ('DELETE - success delete post with correct id', async () => {
    const { entity: post1 } = await postsTestManager.createPost(creatingData, HTTP_STATUSES.CREATED_201)
    const { entity: post2 } = await postsTestManager.createPost(creatingData, HTTP_STATUSES.CREATED_201)

    await getRequest()
      .delete(`${RouterPaths.posts}/${post1.id}`)
      .set({ Authorization: `Basic ${authUser.password}` })
      .expect(HTTP_STATUSES.NO_CONTENT_204)
    
    await getRequest().get(RouterPaths.posts).expect(HTTP_STATUSES.OK_200, {
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 1,
      items: [post2]
    })
  })

  it ('DELETE - fail delete post with incorrect id', async () => {
    await postsTestManager.createPost(creatingData, HTTP_STATUSES.CREATED_201)

    await getRequest()
      .delete(`${RouterPaths.posts}/1`)
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

import request from 'supertest'
import { app } from '../../src/app'
import { HTTP_STATUSES, RouterPaths } from '../../src/constants/global'
import { videosTestManager } from '../utils/videosTestManger'

const getRequest = () => request(app)

describe('VISEOS tests', () => {
  beforeAll(async () => {
    await getRequest().delete(`${RouterPaths.testing}/data`)
  })

  it('GET - success - get empty array of video', async () => {
    await getRequest().get(RouterPaths.videos).expect(HTTP_STATUSES.OK_200, [])
  })

  it('GET - fail - get not existing video', async () => {
    await getRequest().get(`${RouterPaths.videos}/1`).expect(HTTP_STATUSES.NOT_FOUND_404)
  })

  it ('POST - fail - creating video with incorrect data', async () => {
    const data = { title: '', author: 'author name', availableResolutions: [] }

    await videosTestManager.createVideo(data, HTTP_STATUSES.BAD_REQUEST_400)

    await getRequest().get(RouterPaths.videos).expect(HTTP_STATUSES.OK_200, [])
  })

  it ('POST - success - creating video with correct data', async () => {
    const data = { title: 'some title', author: 'author name', availableResolutions: ['P720'] }

    const { entity } = await videosTestManager.createVideo(data, HTTP_STATUSES.CREATED_201)

    const response = await getRequest().get(RouterPaths.videos).expect(HTTP_STATUSES.OK_200)

    expect([entity]).toEqual(response.body)
  })

  it ('PUT - success updating video with correct data', async () => {
    const creatingData = { title: 'some title', author: 'author name', availableResolutions: ['P720'] }
    const updatingData = { title: 'new title' }

    const { entity: createdVideo } = await videosTestManager.createVideo(creatingData, HTTP_STATUSES.CREATED_201)

    await getRequest()
      .put(`${RouterPaths.videos}/${createdVideo.id}`)
      .send(updatingData)
      .expect(HTTP_STATUSES.NO_CONTENT_204)

    const existedVideo = await getRequest().get(`${RouterPaths.videos}/${createdVideo.id}`).expect(HTTP_STATUSES.OK_200)
    const updatedVideo = {
      ...createdVideo,
      ...updatingData,
    }

    expect(updatedVideo).toEqual(existedVideo.body)
  })

  it ('PUT - fail updating video with incorrect id', async () => {
    const creatingData = { title: 'some title', author: 'author name', availableResolutions: ['P720'] }
    const updatingData = { title: 'new title' }

    await videosTestManager.createVideo(creatingData, HTTP_STATUSES.CREATED_201)

    await getRequest()
      .put(`${RouterPaths.videos}/1`)
      .send(updatingData)
      .expect(HTTP_STATUSES.NOT_FOUND_404)
  })

  it ('DELETE - success delete video with correct id', async () => {
    const creatingData = { title: 'some title', author: 'author name', availableResolutions: ['P720'] }

    const { entity } = await videosTestManager.createVideo(creatingData, HTTP_STATUSES.CREATED_201)

    await getRequest()
      .delete(`${RouterPaths.videos}/${entity.id}`)
      .expect(HTTP_STATUSES.NO_CONTENT_204)
  })

  it ('DELETE - fail delete video with incorrect id', async () => {
    const creatingData = { title: 'some title', author: 'author name', availableResolutions: ['P720'] }

    await videosTestManager.createVideo(creatingData, HTTP_STATUSES.CREATED_201)

    await getRequest()
      .delete(`${RouterPaths.videos}/1`)
      .expect(HTTP_STATUSES.NOT_FOUND_404)
  })
})

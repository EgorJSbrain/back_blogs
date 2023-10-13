import { DBfields } from '../db/constants'
import { getCollection } from '../db/mongo-db'
import { SortDirections } from '../constants/global'

import { IComment } from '../types/comments'
import { RequestParams, ResponseBody } from '../types/global'
import { Sort } from 'mongodb'
import { UpdateCommentDto } from '../dtos/comments/update-comment.dto'

const db = getCollection<IComment>(DBfields.comments)

export const CommentsRepository = {
  async getCommentsByPostId(params: RequestParams, postId: string): Promise<ResponseBody<IComment> | null> {
    try {
      const {
        sortBy = 'createdAt',
        sortDirection = SortDirections.desc,
        pageNumber = 1,
        pageSize = 10
      } = params

      const sort: Sort = {}

      if (sortBy && sortDirection) {
        sort[sortBy] = sortDirection === SortDirections.asc ? 1 : -1
      }

      const pageSizeNumber = Number(pageSize)
      const pageNumberNum = Number(pageNumber)
      const skip = (pageNumberNum - 1) * pageSizeNumber
      const count = await db.estimatedDocumentCount()
      const pagesCount = Math.ceil(count / pageSizeNumber)

      const comments = await db
        .find({ postId }, { projection: { _id: 0, postId: 0 } })
        .sort(sort)
        .skip(skip)
        .limit(pageSizeNumber)
        .toArray()

      return {
        pagesCount,
        page: pageNumberNum,
        pageSize: pageSizeNumber,
        totalCount: count,
        items: comments
      }
    } catch {
      return null
    }
  },

  async getCommentById(id: string) {
    try {
      const comment = await db.findOne({ id }, { projection: { _id: 0, postId: 0 } })

      return comment
    } catch {
      return null
    }
  },

  async createComment(data: IComment) {
    try {
      let comment

      const response = await db.insertOne(data)

      if (response.insertedId) {
        comment = await db.findOne(
          { id: data.id },
          { projection: { _id: 0, postId: 0 } }
        )
      }

      return comment
    } catch {
      return null
    }
  },

  async updateComment(id: string, data: UpdateCommentDto) {
    try {
      let comment
      const response = await db.updateOne({ id }, { $set: data })

      if (response.modifiedCount) {
        comment = await db.findOne({ id }, { projection: { _id: 0, postId: 0 } })
      }

      return comment
    } catch {
      return null
    }
  },

  async deleteComment(id: string) {
    try {
      const response = await db.deleteOne({ id })

      return !!response.deletedCount
    } catch {
      return null
    }
  }
}

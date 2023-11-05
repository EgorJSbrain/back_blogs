import { FilterQuery, SortOrder } from 'mongoose'
import { Comment } from '../models'
import { SortDirections } from '../constants/global'

import { IComment, Comment as CommentType } from '../types/comments'
import { RequestParams, ResponseBody } from '../types/global'
import { UpdateCommentDto } from '../dtos/comments/update-comment.dto'

export class CommentsRepository {
  async getCommentsByPostId(params: RequestParams, postId: string): Promise<ResponseBody<CommentType> | null> {
    try {
      const {
        sortBy = 'createdAt',
        sortDirection = SortDirections.desc,
        pageNumber = 1,
        pageSize = 10
      } = params

      const filter: FilterQuery<CommentType> = { postId }
      const sort: Record<string, SortOrder> = {}

      if (sortBy && sortDirection) {
        sort[sortBy] = sortDirection === SortDirections.asc ? 1 : -1
      }

      const pageSizeNumber = Number(pageSize)
      const pageNumberNum = Number(pageNumber)
      const skip = (pageNumberNum - 1) * pageSizeNumber
      const count = await Comment.countDocuments(filter)
      const pagesCount = Math.ceil(count / pageSizeNumber)

      const comments = await Comment
        .find(filter, { projection: { _id: 0, postId: 0, __v: 0 } })
        .sort(sort)
        .skip(skip)
        .limit(pageSizeNumber)
        .lean()

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
  }

  async getCommentById(id: string): Promise<IComment | null> {
    try {
      const comment = await Comment.findOne({ id }, { projection: { _id: 0, postId: 0, __v: 0 } }).lean()

      if (!comment) {
        return null
      }

      return {
        id: comment?.id,
        content: comment?.content,
        commentatorInfo: comment?.commentatorInfo,
        createdAt: comment?.createdAt
      }
    } catch {
      return null
    }
  }

  async createComment(data: CommentType): Promise<CommentType | null> {
    try {
      let comment: CommentType | null = null

      const response = await Comment.create(data)

      if (response._id) {
        comment = await Comment.findOne(
          { _id: response._id },
          { projection: { _id: 0, postId: 0 } }
        )
      }

      return comment
    } catch {
      return null
    }
  }

  async updateComment(id: string, data: UpdateCommentDto): Promise<IComment | null> {
    try {
      let comment: IComment | null = null
      const response = await Comment.updateOne({ id }, { $set: data })

      if (response.modifiedCount) {
        comment = await Comment.findOne({ id }, { projection: { _id: 0, postId: 0 } })
      }

      return comment
    } catch {
      return null
    }
  }

  async deleteComment(id: string): Promise<boolean> {
    try {
      const response = await Comment.deleteOne({ id })

      return !!response.deletedCount
    } catch {
      return false
    }
  }
}

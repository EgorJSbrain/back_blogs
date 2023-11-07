import { Response } from 'express'
import { CommentsService, UsersService } from '../services'
import {
  RequestWithParams,
  RequestWithParamsAndBody
} from '../types/global'

import { HTTP_STATUSES, LikeStatus } from '../constants/global'
import { IComment } from '../types/comments'
import { UpdateCommentDto } from '../dtos/comments/update-comment.dto'
import { LikesService } from '../services/likes'
import { JwtService } from '../applications/jwt-service'
import { Like } from '../types/likes'

export class CommentsController {
  constructor(
    protected commentsService: CommentsService,
    protected usersService: UsersService,
    protected likesService: LikesService,
    protected jwtService: JwtService
  ) {}

  async getCommentById (req: RequestWithParams<{ id: string }>, res: Response<IComment>): Promise<undefined> {
    const { id } = req.params
    let userId: string | null = null
    let myLike: Like | null = null

    if (!id) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const comment = await this.commentsService.getCommentById(id)

    if (!comment) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1]
      userId = await this.jwtService.verifyExperationToken(token)
    }

    const likesCounts = await this.likesService.getLikesCountsBySourceId(comment?.id)

    if (userId) {
      myLike = await this.likesService.getLikeBySourceIdAndAuthorId(comment?.id, userId)
    }

    res.status(HTTP_STATUSES.OK_200).send({
      ...comment,
      likesInfo: {
        likesCount: likesCounts?.likesCount ?? 0,
        dislikesCount: likesCounts?.dislikesCount ?? 0,
        myStatus: myLike?.status ?? LikeStatus.none
      }
    })
  }

  async updateComment (
    req: RequestWithParamsAndBody<{ id: string }, UpdateCommentDto>,
    res: Response
  ): Promise<undefined> {
    const { id } = req.params

    if (!id) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const existedUser = await this.usersService.getUserById(req.userId)
    const existedComment = await this.commentsService.getCommentById(id)

    if (!existedUser) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    if (!existedComment) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    if (existedComment?.commentatorInfo.userId !== existedUser?.accountData.id) {
      res.sendStatus(HTTP_STATUSES.FORBIDEN_403)
      return
    }

    if (existedComment?.content === req.body.content) {
      res.status(HTTP_STATUSES.OK_200).send(existedComment)
      return
    }

    const comment = await this.commentsService.updateComment(id, req.body)

    if (!comment) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }

  async likeComment (
    req: RequestWithParamsAndBody<{ commentId: string }, { likeStatus: LikeStatus }>,
    res: Response
  ): Promise<undefined> {
    const { commentId } = req.params
    const { likeStatus } = req.body
    if (!commentId) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const existedUser = await this.usersService.getUserById(req.userId)
    // console.log("existedUser:", existedUser)
    const existedComment = await this.commentsService.getCommentById(commentId)

    if (!existedUser) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    if (!existedComment) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const like = await this.likesService.getLikeBySourceIdAndAuthorId(commentId, existedUser?.accountData.id)
    // console.log('---like---', like)
    // console.log('---', likeStatus)

    if (!like && (likeStatus === LikeStatus.like || likeStatus === LikeStatus.dislike)) {
      const response = await this.likesService.createLike({
        sourceId: commentId,
        authorId: existedUser?.accountData.id,
        status: likeStatus
      })

      if (!response) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
      }
    }

    if (like && likeStatus !== like.status) {
      const response = await this.likesService.updateLike(like.id, likeStatus)

      if (!response) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
      }
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }

  async deleteComment (req: RequestWithParams<{ id: string }>, res: Response): Promise<undefined> {
    const { id } = req.params

    if (!id) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const existedUser = await this.usersService.getUserById(req.userId)
    const existedComment = await this.commentsService.getCommentById(id)

    if (!existedComment) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    if (existedComment?.commentatorInfo.userId !== existedUser?.accountData.id) {
      res.sendStatus(HTTP_STATUSES.FORBIDEN_403)
      return
    }

    const response = await this.commentsService.deleteComment(id)

    if (!response) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }
}

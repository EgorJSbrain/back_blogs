import { Response } from 'express'
import {
  BlogsService,
  CommentsService,
  PostsService,
  UsersService,
  LikesService
} from '../services'
import {
  RequestParams,
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  ResponseBody
} from '../types/global'

import { JwtService } from '../applications/jwt-service'

import { PostInputFields } from '../constants/posts'
import { HTTP_STATUSES } from '../constants/global'
import { LikeStatus } from '../constants/likes'

import { IPost } from '../types/posts'
import { CreatePostDto } from '../dtos/posts/create-post.dto'
import { UpdatePostDto } from '../dtos/posts/update-post.dto'
import { CreateCommentDto } from '../dtos/comments/create-comment.dto'
import { CommentsRequestParams } from '../types/comments'

export class PostsController {
  constructor(
    protected postsService: PostsService,
    protected blogsService: BlogsService,
    protected commentsService: CommentsService,
    protected usersService: UsersService,
    protected likesService: LikesService,
    protected jwtService: JwtService
  ) {}

  async getPosts(
    req: RequestWithParams<RequestParams>,
    res: Response<ResponseBody<IPost>>
  ): Promise<undefined> {
    let userId: string | null = null

    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1]
      userId = await this.jwtService.verifyExperationToken(token)
    }

    const posts = await this.postsService.getPosts(req.query, userId)

    if (!posts) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
      return
    }

    res.status(HTTP_STATUSES.OK_200).send(posts)
  }

  async getPostById(
    req: RequestWithParams<{ id: string }>,
    res: Response<IPost>
  ): Promise<undefined> {
    const { id } = req.params
    let userId: string | null = null

    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1]
      userId = await this.jwtService.verifyExperationToken(token)
    }

    if (!id) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const blog = await this.postsService.getPostById(id, userId)

    if (!blog) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    res.status(HTTP_STATUSES.OK_200).send(blog)
  }

  async createPost(
    req: RequestWithBody<CreatePostDto>,
    res: Response
  ): Promise<undefined> {
    const existedBlog = await this.blogsService.getBlogById(req.body.blogId)

    if (!existedBlog) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const post = await this.postsService.createPost(req.body, existedBlog)

    if (!post) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
      return
    }

    res.status(HTTP_STATUSES.CREATED_201).send(post)
  }

  async updatePost(
    req: RequestWithParamsAndBody<{ id: string }, UpdatePostDto>,
    res: Response
  ): Promise<undefined> {
    const { id } = req.params
    const { title, content, blogId, shortDescription } = req.body

    if (!id) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const existedPost = await this.postsService.getPostById(id)

    if (!existedPost) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const updatedPost = {
      [PostInputFields.title]:
        PostInputFields.title in req.body ? title : existedPost?.title,
      [PostInputFields.content]:
        PostInputFields.content in req.body ? content : existedPost?.content,
      [PostInputFields.shortDescription]:
        PostInputFields.shortDescription in req.body
          ? shortDescription
          : existedPost?.shortDescription,
      [PostInputFields.blogId]:
        PostInputFields.blogId in req.body ? blogId : existedPost?.blogId
    }

    const post = await this.postsService.updatePost(id, updatedPost)

    if (!post) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }

  async deletePost(
    req: RequestWithParams<{ id: string }>,
    res: Response
  ): Promise<undefined> {
    const { id } = req.params

    if (!id) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const response = await this.postsService.deletePost(id)

    if (!response) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }

  async getCommentsByPostId(
    req: RequestWithParams<CommentsRequestParams>,
    res: Response
  ): Promise<undefined> {
    const { postId } = req.params
    let userId: string | null = null

    if (!postId) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const existedPost = await this.postsService.getPostById(postId)

    if (!existedPost) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1]
      userId = await this.jwtService.verifyExperationToken(token)
    }

    const comments = await this.commentsService.getCommentsByPostId(
      req.query,
      existedPost.id,
      userId
    )

    if (!comments) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    res.status(HTTP_STATUSES.OK_200).send(comments)
  }

  async createComment(
    req: RequestWithParamsAndBody<{ postId: string }, CreateCommentDto>,
    res: Response
  ): Promise<undefined> {
    const { postId } = req.params
    const existedUser = await this.usersService.getUserById(req.userId)

    if (!existedUser) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    if (!postId) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const existedPost = await this.postsService.getPostById(postId)

    if (!existedPost) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const newComment = await this.commentsService.createComment(
      req.body,
      existedUser,
      postId
    )

    if (!newComment) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const comment = {
      id: newComment.id,
      content: newComment.content,
      createdAt: newComment.createdAt,
      commentatorInfo: newComment.commentatorInfo,
      likesInfo: {
        dislikesCount: 0,
        likesCount: 0,
        myStatus: LikeStatus.none
      }
    }

    res.status(HTTP_STATUSES.CREATED_201).send(comment)
  }

  async likePost (
    req: RequestWithParamsAndBody<{ postId: string }, { likeStatus: LikeStatus }>,
    res: Response
  ): Promise<undefined> {
    const { postId } = req.params
    const { likeStatus } = req.body

    if (!postId) {
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
      return
    }

    const existedUser = await this.usersService.getUserById(req.userId)
    const existedPost = await this.postsService.getPostById(postId)

    if (!existedUser) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    if (!existedPost) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const like = await this.likesService.likeEntity(likeStatus, postId, existedUser?.accountData.id)

    if (!like) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }
}

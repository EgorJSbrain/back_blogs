export enum LikesInputFields {
  likeStatus = 'likeStatus',
}

export const likesErrorMessage = {
  likeInfo: 'Like status should be correct'
}

export enum LikeStatus {
  like = 'Like',
  dislike = 'Dislike',
  none = 'None',
}

export const LikeStatuses: Record<string, LikeStatus> = {
  Like: LikeStatus.like,
  Dislike: LikeStatus.dislike,
  None: LikeStatus.none
}

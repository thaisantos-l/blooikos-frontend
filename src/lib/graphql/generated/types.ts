/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export enum AvatarRatingEnum {
  /** Indicates a G level avatar rating level. */
  G = 'G',
  /** Indicates a PG level avatar rating level. */
  Pg = 'PG',
  /** Indicates an R level avatar rating level. */
  R = 'R',
  /** Indicates an X level avatar rating level. */
  X = 'X',
}

export type BlooikosCompanyToRevisionConnectionWhereArgs = {
  dateQuery?: InputMaybe<DateQueryInput>;
  hasPassword?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  isSticky?: InputMaybe<Scalars['Boolean']['input']>;
  mimeType?: InputMaybe<MimeTypeEnum>;
  name?: InputMaybe<Scalars['String']['input']>;
  nameIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  orderby?: InputMaybe<Array<InputMaybe<PostObjectsConnectionOrderbyInput>>>;
  parent?: InputMaybe<Scalars['ID']['input']>;
  parentIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  parentNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  password?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  stati?: InputMaybe<Array<InputMaybe<PostStatusEnum>>>;
  status?: InputMaybe<PostStatusEnum>;
  template?: InputMaybe<ContentTemplateEnum>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export enum CategoryIdType {
  /** The Database ID for the node */
  DatabaseId = 'DATABASE_ID',
  /** The hashed Global ID */
  Id = 'ID',
  /** The name of the node */
  Name = 'NAME',
  /** Url friendly name of the node */
  Slug = 'SLUG',
  /** The URI for the node */
  Uri = 'URI',
}

export type CategoryToCategoryConnectionWhereArgs = {
  cacheDomain?: InputMaybe<Scalars['String']['input']>;
  childOf?: InputMaybe<Scalars['Int']['input']>;
  childless?: InputMaybe<Scalars['Boolean']['input']>;
  descriptionLike?: InputMaybe<Scalars['String']['input']>;
  exclude?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  excludeTree?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  hideEmpty?: InputMaybe<Scalars['Boolean']['input']>;
  hierarchical?: InputMaybe<Scalars['Boolean']['input']>;
  include?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  nameLike?: InputMaybe<Scalars['String']['input']>;
  objectIds?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  order?: InputMaybe<OrderEnum>;
  orderby?: InputMaybe<TermObjectsConnectionOrderbyEnum>;
  padCounts?: InputMaybe<Scalars['Boolean']['input']>;
  parent?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  termTaxonomId?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  termTaxonomyId?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  updateTermMetaCache?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CategoryToContentNodeConnectionWhereArgs = {
  contentTypes?: InputMaybe<Array<InputMaybe<ContentTypesOfCategoryEnum>>>;
  dateQuery?: InputMaybe<DateQueryInput>;
  hasPassword?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  isSticky?: InputMaybe<Scalars['Boolean']['input']>;
  mimeType?: InputMaybe<MimeTypeEnum>;
  name?: InputMaybe<Scalars['String']['input']>;
  nameIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  orderby?: InputMaybe<Array<InputMaybe<PostObjectsConnectionOrderbyInput>>>;
  parent?: InputMaybe<Scalars['ID']['input']>;
  parentIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  parentNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  password?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  stati?: InputMaybe<Array<InputMaybe<PostStatusEnum>>>;
  status?: InputMaybe<PostStatusEnum>;
  template?: InputMaybe<ContentTemplateEnum>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type CategoryToPostConnectionWhereArgs = {
  author?: InputMaybe<Scalars['Int']['input']>;
  authorIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  authorName?: InputMaybe<Scalars['String']['input']>;
  authorNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  categoryIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  categoryName?: InputMaybe<Scalars['String']['input']>;
  categoryNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  dateQuery?: InputMaybe<DateQueryInput>;
  hasPassword?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  isSticky?: InputMaybe<Scalars['Boolean']['input']>;
  mimeType?: InputMaybe<MimeTypeEnum>;
  name?: InputMaybe<Scalars['String']['input']>;
  nameIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  orderby?: InputMaybe<Array<InputMaybe<PostObjectsConnectionOrderbyInput>>>;
  parent?: InputMaybe<Scalars['ID']['input']>;
  parentIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  parentNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  password?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  stati?: InputMaybe<Array<InputMaybe<PostStatusEnum>>>;
  status?: InputMaybe<PostStatusEnum>;
  tag?: InputMaybe<Scalars['String']['input']>;
  tagId?: InputMaybe<Scalars['String']['input']>;
  tagIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  tagNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  tagSlugAnd?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tagSlugIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  template?: InputMaybe<ContentTemplateEnum>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export enum CommentNodeIdTypeEnum {
  /** Identify a resource by the Database ID. */
  DatabaseId = 'DATABASE_ID',
  /** Identify a resource by the (hashed) Global ID. */
  Id = 'ID',
}

export enum CommentStatusEnum {
  /** Comments with the Aprovado status */
  Approve = 'APPROVE',
  /** Comments with the Rejeitado status */
  Hold = 'HOLD',
  /** Comments with the Spam status */
  Spam = 'SPAM',
  /** Comments with the Lixo status */
  Trash = 'TRASH',
}

export type CommentToCommentConnectionWhereArgs = {
  authorEmail?: InputMaybe<Scalars['String']['input']>;
  authorIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  authorNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  authorUrl?: InputMaybe<Scalars['String']['input']>;
  commentIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  commentNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  commentType?: InputMaybe<Scalars['String']['input']>;
  commentTypeIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  commentTypeNotIn?: InputMaybe<Scalars['String']['input']>;
  contentAuthor?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contentAuthorIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contentAuthorNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contentId?: InputMaybe<Scalars['ID']['input']>;
  contentIdIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contentIdNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contentName?: InputMaybe<Scalars['String']['input']>;
  contentParent?: InputMaybe<Scalars['Int']['input']>;
  contentStatus?: InputMaybe<Array<InputMaybe<PostStatusEnum>>>;
  contentType?: InputMaybe<Array<InputMaybe<ContentTypeEnum>>>;
  includeUnapproved?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  karma?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<OrderEnum>;
  orderby?: InputMaybe<CommentsConnectionOrderbyEnum>;
  parent?: InputMaybe<Scalars['Int']['input']>;
  parentIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  parentNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  statusIn?: InputMaybe<Array<InputMaybe<CommentStatusEnum>>>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type CommentToParentCommentConnectionWhereArgs = {
  authorEmail?: InputMaybe<Scalars['String']['input']>;
  authorIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  authorNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  authorUrl?: InputMaybe<Scalars['String']['input']>;
  commentIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  commentNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  commentType?: InputMaybe<Scalars['String']['input']>;
  commentTypeIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  commentTypeNotIn?: InputMaybe<Scalars['String']['input']>;
  contentAuthor?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contentAuthorIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contentAuthorNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contentId?: InputMaybe<Scalars['ID']['input']>;
  contentIdIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contentIdNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contentName?: InputMaybe<Scalars['String']['input']>;
  contentParent?: InputMaybe<Scalars['Int']['input']>;
  contentStatus?: InputMaybe<Array<InputMaybe<PostStatusEnum>>>;
  contentType?: InputMaybe<Array<InputMaybe<ContentTypeEnum>>>;
  includeUnapproved?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  karma?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<OrderEnum>;
  orderby?: InputMaybe<CommentsConnectionOrderbyEnum>;
  parent?: InputMaybe<Scalars['Int']['input']>;
  parentIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  parentNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  statusIn?: InputMaybe<Array<InputMaybe<CommentStatusEnum>>>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export enum CommentsConnectionOrderbyEnum {
  /** Order by browser user agent of the commenter. */
  CommentAgent = 'COMMENT_AGENT',
  /** Order by approval status of the comment. */
  CommentApproved = 'COMMENT_APPROVED',
  /** Order by name of the comment author. */
  CommentAuthor = 'COMMENT_AUTHOR',
  /** Order by e-mail of the comment author. */
  CommentAuthorEmail = 'COMMENT_AUTHOR_EMAIL',
  /** Order by IP address of the comment author. */
  CommentAuthorIp = 'COMMENT_AUTHOR_IP',
  /** Order by URL address of the comment author. */
  CommentAuthorUrl = 'COMMENT_AUTHOR_URL',
  /** Order by the comment contents. */
  CommentContent = 'COMMENT_CONTENT',
  /** Chronological ordering by comment submission date. */
  CommentDate = 'COMMENT_DATE',
  /** Chronological ordering by comment date in UTC/GMT time. */
  CommentDateGmt = 'COMMENT_DATE_GMT',
  /** Ordering by internal ID (typically reflects creation order). */
  CommentId = 'COMMENT_ID',
  /** Preserve custom order of IDs as specified in the query. */
  CommentIn = 'COMMENT_IN',
  /** Order by the comment karma score. */
  CommentKarma = 'COMMENT_KARMA',
  /** Ordering by parent comment relationship (threaded discussions). */
  CommentParent = 'COMMENT_PARENT',
  /** Ordering by associated content item ID. */
  CommentPostId = 'COMMENT_POST_ID',
  /** Ordering by comment classification (standard comments, pingbacks, etc.). */
  CommentType = 'COMMENT_TYPE',
  /** Ordering by the user account ID associated with the comment as the comment author. */
  UserId = 'USER_ID',
}

export enum ContentNodeIdTypeEnum {
  /** Identify a resource by the Database ID. */
  DatabaseId = 'DATABASE_ID',
  /** Identify a resource by the (hashed) Global ID. */
  Id = 'ID',
  /** Identify a resource by the URI. */
  Uri = 'URI',
}

export type ContentNodeToEnqueuedScriptConnectionWhereArgs = {
  handlesIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ContentNodeToEnqueuedStylesheetConnectionWhereArgs = {
  handlesIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export enum ContentTemplateEnum {
  /** The default template, applied when no specific template is assigned. */
  DefaultTemplate = 'DEFAULT_TEMPLATE',
  /** The "Página sem título" template. */
  PageNoTitleBlockTemplate = 'PAGE_NO_TITLE_BLOCK_TEMPLATE',
}

export enum ContentTypeEnum {
  /** The Type of Content object */
  Attachment = 'ATTACHMENT',
  /** The Type of Content object */
  BlooikosCompany = 'BLOOIKOS_COMPANY',
  /** The Type of Content object */
  Page = 'PAGE',
  /** The Type of Content object */
  Post = 'POST',
}

export enum ContentTypeIdTypeEnum {
  /** The globally unique ID */
  Id = 'ID',
  /** The name of the content type. */
  Name = 'NAME',
}

export type ContentTypeToContentNodeConnectionWhereArgs = {
  contentTypes?: InputMaybe<Array<InputMaybe<ContentTypeEnum>>>;
  dateQuery?: InputMaybe<DateQueryInput>;
  hasPassword?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  isSticky?: InputMaybe<Scalars['Boolean']['input']>;
  mimeType?: InputMaybe<MimeTypeEnum>;
  name?: InputMaybe<Scalars['String']['input']>;
  nameIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  orderby?: InputMaybe<Array<InputMaybe<PostObjectsConnectionOrderbyInput>>>;
  parent?: InputMaybe<Scalars['ID']['input']>;
  parentIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  parentNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  password?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  stati?: InputMaybe<Array<InputMaybe<PostStatusEnum>>>;
  status?: InputMaybe<PostStatusEnum>;
  template?: InputMaybe<ContentTemplateEnum>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export enum ContentTypesOfCategoryEnum {
  /** The Type of Content object */
  Post = 'POST',
}

export enum ContentTypesOfPostFormatEnum {
  /** The Type of Content object */
  Post = 'POST',
}

export enum ContentTypesOfTagEnum {
  /** The Type of Content object */
  Post = 'POST',
}

export type CreateCategoryInput = {
  aliasOf?: InputMaybe<Scalars['String']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  parentDatabaseId?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type CreateCommentInput = {
  approved?: InputMaybe<Scalars['String']['input']>;
  author?: InputMaybe<Scalars['String']['input']>;
  authorEmail?: InputMaybe<Scalars['String']['input']>;
  authorUrl?: InputMaybe<Scalars['String']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  commentOn?: InputMaybe<Scalars['Int']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  parent?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<CommentStatusEnum>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type CreateMediaItemInput = {
  altText?: InputMaybe<Scalars['String']['input']>;
  authorId?: InputMaybe<Scalars['ID']['input']>;
  caption?: InputMaybe<Scalars['String']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  commentStatus?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  dateGmt?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  filePath?: InputMaybe<Scalars['String']['input']>;
  fileType?: InputMaybe<MimeTypeEnum>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  pingStatus?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<MediaItemStatusEnum>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePageInput = {
  authorId?: InputMaybe<Scalars['ID']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  commentStatus?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  menuOrder?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<PostStatusEnum>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePostFormatInput = {
  aliasOf?: InputMaybe<Scalars['String']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePostInput = {
  authorId?: InputMaybe<Scalars['ID']['input']>;
  categories?: InputMaybe<PostCategoriesInput>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  commentStatus?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  excerpt?: InputMaybe<Scalars['String']['input']>;
  menuOrder?: InputMaybe<Scalars['Int']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  pingStatus?: InputMaybe<Scalars['String']['input']>;
  pinged?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  postFormats?: InputMaybe<PostPostFormatsInput>;
  slug?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<PostStatusEnum>;
  tags?: InputMaybe<PostTagsInput>;
  title?: InputMaybe<Scalars['String']['input']>;
  toPing?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type CreateTagInput = {
  aliasOf?: InputMaybe<Scalars['String']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type CreateUserInput = {
  aim?: InputMaybe<Scalars['String']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  jabber?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  nicename?: InputMaybe<Scalars['String']['input']>;
  nickname?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  registered?: InputMaybe<Scalars['String']['input']>;
  richEditing?: InputMaybe<Scalars['String']['input']>;
  roles?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  username: Scalars['String']['input'];
  websiteUrl?: InputMaybe<Scalars['String']['input']>;
  yim?: InputMaybe<Scalars['String']['input']>;
};

export type DateInput = {
  day?: InputMaybe<Scalars['Int']['input']>;
  hour?: InputMaybe<Scalars['Int']['input']>;
  minute?: InputMaybe<Scalars['Int']['input']>;
  month?: InputMaybe<Scalars['Int']['input']>;
  second?: InputMaybe<Scalars['Int']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type DateQueryInput = {
  after?: InputMaybe<DateInput>;
  before?: InputMaybe<DateInput>;
  column?: InputMaybe<PostObjectsConnectionDateColumnEnum>;
  compare?: InputMaybe<Scalars['String']['input']>;
  day?: InputMaybe<Scalars['Int']['input']>;
  hour?: InputMaybe<Scalars['Int']['input']>;
  inclusive?: InputMaybe<Scalars['Boolean']['input']>;
  minute?: InputMaybe<Scalars['Int']['input']>;
  month?: InputMaybe<Scalars['Int']['input']>;
  relation?: InputMaybe<RelationEnum>;
  second?: InputMaybe<Scalars['Int']['input']>;
  week?: InputMaybe<Scalars['Int']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type DeleteCategoryInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};

export type DeleteCommentInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  forceDelete?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['ID']['input'];
};

export type DeleteMediaItemInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  forceDelete?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['ID']['input'];
};

export type DeletePageInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  forceDelete?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['ID']['input'];
  ignoreEditLock?: InputMaybe<Scalars['Boolean']['input']>;
};

export type DeletePostFormatInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};

export type DeletePostInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  forceDelete?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['ID']['input'];
  ignoreEditLock?: InputMaybe<Scalars['Boolean']['input']>;
};

export type DeleteTagInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};

export type DeleteUserInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  reassignId?: InputMaybe<Scalars['ID']['input']>;
};

export type HierarchicalContentNodeToContentNodeAncestorsConnectionWhereArgs = {
  contentTypes?: InputMaybe<Array<InputMaybe<ContentTypeEnum>>>;
  dateQuery?: InputMaybe<DateQueryInput>;
  hasPassword?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  isSticky?: InputMaybe<Scalars['Boolean']['input']>;
  mimeType?: InputMaybe<MimeTypeEnum>;
  name?: InputMaybe<Scalars['String']['input']>;
  nameIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  orderby?: InputMaybe<Array<InputMaybe<PostObjectsConnectionOrderbyInput>>>;
  parent?: InputMaybe<Scalars['ID']['input']>;
  parentIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  parentNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  password?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  stati?: InputMaybe<Array<InputMaybe<PostStatusEnum>>>;
  status?: InputMaybe<PostStatusEnum>;
  template?: InputMaybe<ContentTemplateEnum>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type HierarchicalContentNodeToContentNodeChildrenConnectionWhereArgs = {
  contentTypes?: InputMaybe<Array<InputMaybe<ContentTypeEnum>>>;
  dateQuery?: InputMaybe<DateQueryInput>;
  hasPassword?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  isSticky?: InputMaybe<Scalars['Boolean']['input']>;
  mimeType?: InputMaybe<MimeTypeEnum>;
  name?: InputMaybe<Scalars['String']['input']>;
  nameIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  orderby?: InputMaybe<Array<InputMaybe<PostObjectsConnectionOrderbyInput>>>;
  parent?: InputMaybe<Scalars['ID']['input']>;
  parentIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  parentNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  password?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  stati?: InputMaybe<Array<InputMaybe<PostStatusEnum>>>;
  status?: InputMaybe<PostStatusEnum>;
  template?: InputMaybe<ContentTemplateEnum>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export enum MediaItemIdType {
  /** Identify a resource by the Database ID. */
  DatabaseId = 'DATABASE_ID',
  /** Identify a resource by the (hashed) Global ID. */
  Id = 'ID',
  /** Identify a resource by the slug. Available to non-hierarchcial Types where the slug is a unique identifier. */
  Slug = 'SLUG',
  /** Identify a media item by its source url */
  SourceUrl = 'SOURCE_URL',
  /** Identify a resource by the URI. */
  Uri = 'URI',
}

export enum MediaItemSizeEnum {
  /** Large image preview suitable for detail views. (1024x1024) */
  Large = 'LARGE',
  /** Medium image preview typically suitable for listings and detail views. (300x300) */
  Medium = 'MEDIUM',
  /** Medium-to-large image preview suitable for listings and detail views. (768x0) */
  MediumLarge = 'MEDIUM_LARGE',
  /** Small image preview suitable for thumbnails and listings. (150x150) */
  Thumbnail = 'THUMBNAIL',
  /** Custom Image Size. (1536x1536) */
  '1536X1536' = '_1536X1536',
  /** Custom Image Size. (2048x2048) */
  '2048X2048' = '_2048X2048',
}

export enum MediaItemStatusEnum {
  /** Automatically created media that has not been finalized */
  AutoDraft = 'AUTO_DRAFT',
  /** Media that inherits its publication status from the parent content */
  Inherit = 'INHERIT',
  /** Media visible only to users with appropriate permissions */
  Private = 'PRIVATE',
  /** Media marked for deletion but still recoverable */
  Trash = 'TRASH',
}

export type MediaItemToCommentConnectionWhereArgs = {
  authorEmail?: InputMaybe<Scalars['String']['input']>;
  authorIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  authorNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  authorUrl?: InputMaybe<Scalars['String']['input']>;
  commentIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  commentNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  commentType?: InputMaybe<Scalars['String']['input']>;
  commentTypeIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  commentTypeNotIn?: InputMaybe<Scalars['String']['input']>;
  contentAuthor?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contentAuthorIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contentAuthorNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contentId?: InputMaybe<Scalars['ID']['input']>;
  contentIdIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contentIdNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contentName?: InputMaybe<Scalars['String']['input']>;
  contentParent?: InputMaybe<Scalars['Int']['input']>;
  contentStatus?: InputMaybe<Array<InputMaybe<PostStatusEnum>>>;
  contentType?: InputMaybe<Array<InputMaybe<ContentTypeEnum>>>;
  includeUnapproved?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  karma?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<OrderEnum>;
  orderby?: InputMaybe<CommentsConnectionOrderbyEnum>;
  parent?: InputMaybe<Scalars['Int']['input']>;
  parentIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  parentNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  statusIn?: InputMaybe<Array<InputMaybe<CommentStatusEnum>>>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export enum MenuItemNodeIdTypeEnum {
  /** Identify a resource by the Database ID. */
  DatabaseId = 'DATABASE_ID',
  /** Identify a resource by the (hashed) Global ID. */
  Id = 'ID',
}

export type MenuItemToMenuItemConnectionWhereArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  location?: InputMaybe<MenuLocationEnum>;
  parentDatabaseId?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
};

export enum MenuLocationEnum {
  /** Put the menu in the blooikos_footer location */
  BlooikosFooter = 'BLOOIKOS_FOOTER',
  /** Put the menu in the blooikos_primary location */
  BlooikosPrimary = 'BLOOIKOS_PRIMARY',
}

export enum MenuNodeIdTypeEnum {
  /** Identify a menu node by the Database ID. */
  DatabaseId = 'DATABASE_ID',
  /** Identify a menu node by the (hashed) Global ID. */
  Id = 'ID',
  /** Identify a menu node by the slug of menu location to which it is assigned */
  Location = 'LOCATION',
  /** Identify a menu node by its name */
  Name = 'NAME',
  /** Identify a menu node by its slug */
  Slug = 'SLUG',
}

export type MenuToMenuItemConnectionWhereArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  location?: InputMaybe<MenuLocationEnum>;
  parentDatabaseId?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
};

export enum MimeTypeEnum {
  /** application/java mime type. */
  ApplicationJava = 'APPLICATION_JAVA',
  /** application/msword mime type. */
  ApplicationMsword = 'APPLICATION_MSWORD',
  /** application/octet-stream mime type. */
  ApplicationOctetStream = 'APPLICATION_OCTET_STREAM',
  /** application/onenote mime type. */
  ApplicationOnenote = 'APPLICATION_ONENOTE',
  /** application/oxps mime type. */
  ApplicationOxps = 'APPLICATION_OXPS',
  /** application/pdf mime type. */
  ApplicationPdf = 'APPLICATION_PDF',
  /** application/rar mime type. */
  ApplicationRar = 'APPLICATION_RAR',
  /** application/rtf mime type. */
  ApplicationRtf = 'APPLICATION_RTF',
  /** application/ttaf+xml mime type. */
  ApplicationTtafXml = 'APPLICATION_TTAF_XML',
  /** application/vnd.apple.keynote mime type. */
  ApplicationVndAppleKeynote = 'APPLICATION_VND_APPLE_KEYNOTE',
  /** application/vnd.apple.numbers mime type. */
  ApplicationVndAppleNumbers = 'APPLICATION_VND_APPLE_NUMBERS',
  /** application/vnd.apple.pages mime type. */
  ApplicationVndApplePages = 'APPLICATION_VND_APPLE_PAGES',
  /** application/vnd.ms-access mime type. */
  ApplicationVndMsAccess = 'APPLICATION_VND_MS_ACCESS',
  /** application/vnd.ms-excel mime type. */
  ApplicationVndMsExcel = 'APPLICATION_VND_MS_EXCEL',
  /** application/vnd.ms-excel.addin.macroEnabled.12 mime type. */
  ApplicationVndMsExcelAddinMacroenabled_12 = 'APPLICATION_VND_MS_EXCEL_ADDIN_MACROENABLED_12',
  /** application/vnd.ms-excel.sheet.binary.macroEnabled.12 mime type. */
  ApplicationVndMsExcelSheetBinaryMacroenabled_12 = 'APPLICATION_VND_MS_EXCEL_SHEET_BINARY_MACROENABLED_12',
  /** application/vnd.ms-excel.sheet.macroEnabled.12 mime type. */
  ApplicationVndMsExcelSheetMacroenabled_12 = 'APPLICATION_VND_MS_EXCEL_SHEET_MACROENABLED_12',
  /** application/vnd.ms-excel.template.macroEnabled.12 mime type. */
  ApplicationVndMsExcelTemplateMacroenabled_12 = 'APPLICATION_VND_MS_EXCEL_TEMPLATE_MACROENABLED_12',
  /** application/vnd.ms-powerpoint mime type. */
  ApplicationVndMsPowerpoint = 'APPLICATION_VND_MS_POWERPOINT',
  /** application/vnd.ms-powerpoint.addin.macroEnabled.12 mime type. */
  ApplicationVndMsPowerpointAddinMacroenabled_12 = 'APPLICATION_VND_MS_POWERPOINT_ADDIN_MACROENABLED_12',
  /** application/vnd.ms-powerpoint.presentation.macroEnabled.12 mime type. */
  ApplicationVndMsPowerpointPresentationMacroenabled_12 = 'APPLICATION_VND_MS_POWERPOINT_PRESENTATION_MACROENABLED_12',
  /** application/vnd.ms-powerpoint.slideshow.macroEnabled.12 mime type. */
  ApplicationVndMsPowerpointSlideshowMacroenabled_12 = 'APPLICATION_VND_MS_POWERPOINT_SLIDESHOW_MACROENABLED_12',
  /** application/vnd.ms-powerpoint.slide.macroEnabled.12 mime type. */
  ApplicationVndMsPowerpointSlideMacroenabled_12 = 'APPLICATION_VND_MS_POWERPOINT_SLIDE_MACROENABLED_12',
  /** application/vnd.ms-powerpoint.template.macroEnabled.12 mime type. */
  ApplicationVndMsPowerpointTemplateMacroenabled_12 = 'APPLICATION_VND_MS_POWERPOINT_TEMPLATE_MACROENABLED_12',
  /** application/vnd.ms-project mime type. */
  ApplicationVndMsProject = 'APPLICATION_VND_MS_PROJECT',
  /** application/vnd.ms-word.document.macroEnabled.12 mime type. */
  ApplicationVndMsWordDocumentMacroenabled_12 = 'APPLICATION_VND_MS_WORD_DOCUMENT_MACROENABLED_12',
  /** application/vnd.ms-word.template.macroEnabled.12 mime type. */
  ApplicationVndMsWordTemplateMacroenabled_12 = 'APPLICATION_VND_MS_WORD_TEMPLATE_MACROENABLED_12',
  /** application/vnd.ms-write mime type. */
  ApplicationVndMsWrite = 'APPLICATION_VND_MS_WRITE',
  /** application/vnd.ms-xpsdocument mime type. */
  ApplicationVndMsXpsdocument = 'APPLICATION_VND_MS_XPSDOCUMENT',
  /** application/vnd.oasis.opendocument.chart mime type. */
  ApplicationVndOasisOpendocumentChart = 'APPLICATION_VND_OASIS_OPENDOCUMENT_CHART',
  /** application/vnd.oasis.opendocument.database mime type. */
  ApplicationVndOasisOpendocumentDatabase = 'APPLICATION_VND_OASIS_OPENDOCUMENT_DATABASE',
  /** application/vnd.oasis.opendocument.formula mime type. */
  ApplicationVndOasisOpendocumentFormula = 'APPLICATION_VND_OASIS_OPENDOCUMENT_FORMULA',
  /** application/vnd.oasis.opendocument.graphics mime type. */
  ApplicationVndOasisOpendocumentGraphics = 'APPLICATION_VND_OASIS_OPENDOCUMENT_GRAPHICS',
  /** application/vnd.oasis.opendocument.presentation mime type. */
  ApplicationVndOasisOpendocumentPresentation = 'APPLICATION_VND_OASIS_OPENDOCUMENT_PRESENTATION',
  /** application/vnd.oasis.opendocument.spreadsheet mime type. */
  ApplicationVndOasisOpendocumentSpreadsheet = 'APPLICATION_VND_OASIS_OPENDOCUMENT_SPREADSHEET',
  /** application/vnd.oasis.opendocument.text mime type. */
  ApplicationVndOasisOpendocumentText = 'APPLICATION_VND_OASIS_OPENDOCUMENT_TEXT',
  /** application/vnd.openxmlformats-officedocument.presentationml.presentation mime type. */
  ApplicationVndOpenxmlformatsOfficedocumentPresentationmlPresentation = 'APPLICATION_VND_OPENXMLFORMATS_OFFICEDOCUMENT_PRESENTATIONML_PRESENTATION',
  /** application/vnd.openxmlformats-officedocument.presentationml.slide mime type. */
  ApplicationVndOpenxmlformatsOfficedocumentPresentationmlSlide = 'APPLICATION_VND_OPENXMLFORMATS_OFFICEDOCUMENT_PRESENTATIONML_SLIDE',
  /** application/vnd.openxmlformats-officedocument.presentationml.slideshow mime type. */
  ApplicationVndOpenxmlformatsOfficedocumentPresentationmlSlideshow = 'APPLICATION_VND_OPENXMLFORMATS_OFFICEDOCUMENT_PRESENTATIONML_SLIDESHOW',
  /** application/vnd.openxmlformats-officedocument.presentationml.template mime type. */
  ApplicationVndOpenxmlformatsOfficedocumentPresentationmlTemplate = 'APPLICATION_VND_OPENXMLFORMATS_OFFICEDOCUMENT_PRESENTATIONML_TEMPLATE',
  /** application/vnd.openxmlformats-officedocument.spreadsheetml.sheet mime type. */
  ApplicationVndOpenxmlformatsOfficedocumentSpreadsheetmlSheet = 'APPLICATION_VND_OPENXMLFORMATS_OFFICEDOCUMENT_SPREADSHEETML_SHEET',
  /** application/vnd.openxmlformats-officedocument.spreadsheetml.template mime type. */
  ApplicationVndOpenxmlformatsOfficedocumentSpreadsheetmlTemplate = 'APPLICATION_VND_OPENXMLFORMATS_OFFICEDOCUMENT_SPREADSHEETML_TEMPLATE',
  /** application/vnd.openxmlformats-officedocument.wordprocessingml.document mime type. */
  ApplicationVndOpenxmlformatsOfficedocumentWordprocessingmlDocument = 'APPLICATION_VND_OPENXMLFORMATS_OFFICEDOCUMENT_WORDPROCESSINGML_DOCUMENT',
  /** application/vnd.openxmlformats-officedocument.wordprocessingml.template mime type. */
  ApplicationVndOpenxmlformatsOfficedocumentWordprocessingmlTemplate = 'APPLICATION_VND_OPENXMLFORMATS_OFFICEDOCUMENT_WORDPROCESSINGML_TEMPLATE',
  /** application/wordperfect mime type. */
  ApplicationWordperfect = 'APPLICATION_WORDPERFECT',
  /** application/x-7z-compressed mime type. */
  ApplicationX_7ZCompressed = 'APPLICATION_X_7Z_COMPRESSED',
  /** application/x-gzip mime type. */
  ApplicationXGzip = 'APPLICATION_X_GZIP',
  /** application/x-tar mime type. */
  ApplicationXTar = 'APPLICATION_X_TAR',
  /** application/zip mime type. */
  ApplicationZip = 'APPLICATION_ZIP',
  /** audio/aac mime type. */
  AudioAac = 'AUDIO_AAC',
  /** audio/flac mime type. */
  AudioFlac = 'AUDIO_FLAC',
  /** audio/midi mime type. */
  AudioMidi = 'AUDIO_MIDI',
  /** audio/mpeg mime type. */
  AudioMpeg = 'AUDIO_MPEG',
  /** audio/ogg mime type. */
  AudioOgg = 'AUDIO_OGG',
  /** audio/wav mime type. */
  AudioWav = 'AUDIO_WAV',
  /** audio/x-matroska mime type. */
  AudioXMatroska = 'AUDIO_X_MATROSKA',
  /** audio/x-ms-wax mime type. */
  AudioXMsWax = 'AUDIO_X_MS_WAX',
  /** audio/x-ms-wma mime type. */
  AudioXMsWma = 'AUDIO_X_MS_WMA',
  /** audio/x-realaudio mime type. */
  AudioXRealaudio = 'AUDIO_X_REALAUDIO',
  /** image/avif mime type. */
  ImageAvif = 'IMAGE_AVIF',
  /** image/bmp mime type. */
  ImageBmp = 'IMAGE_BMP',
  /** image/gif mime type. */
  ImageGif = 'IMAGE_GIF',
  /** image/heic mime type. */
  ImageHeic = 'IMAGE_HEIC',
  /** image/heic-sequence mime type. */
  ImageHeicSequence = 'IMAGE_HEIC_SEQUENCE',
  /** image/heif mime type. */
  ImageHeif = 'IMAGE_HEIF',
  /** image/heif-sequence mime type. */
  ImageHeifSequence = 'IMAGE_HEIF_SEQUENCE',
  /** image/jpeg mime type. */
  ImageJpeg = 'IMAGE_JPEG',
  /** image/png mime type. */
  ImagePng = 'IMAGE_PNG',
  /** image/tiff mime type. */
  ImageTiff = 'IMAGE_TIFF',
  /** image/webp mime type. */
  ImageWebp = 'IMAGE_WEBP',
  /** image/x-icon mime type. */
  ImageXIcon = 'IMAGE_X_ICON',
  /** text/calendar mime type. */
  TextCalendar = 'TEXT_CALENDAR',
  /** text/css mime type. */
  TextCss = 'TEXT_CSS',
  /** text/csv mime type. */
  TextCsv = 'TEXT_CSV',
  /** text/plain mime type. */
  TextPlain = 'TEXT_PLAIN',
  /** text/richtext mime type. */
  TextRichtext = 'TEXT_RICHTEXT',
  /** text/tab-separated-values mime type. */
  TextTabSeparatedValues = 'TEXT_TAB_SEPARATED_VALUES',
  /** text/vtt mime type. */
  TextVtt = 'TEXT_VTT',
  /** video/3gpp mime type. */
  Video_3Gpp = 'VIDEO_3GPP',
  /** video/3gpp2 mime type. */
  Video_3Gpp2 = 'VIDEO_3GPP2',
  /** video/avi mime type. */
  VideoAvi = 'VIDEO_AVI',
  /** video/divx mime type. */
  VideoDivx = 'VIDEO_DIVX',
  /** video/mp4 mime type. */
  VideoMp4 = 'VIDEO_MP4',
  /** video/mpeg mime type. */
  VideoMpeg = 'VIDEO_MPEG',
  /** video/ogg mime type. */
  VideoOgg = 'VIDEO_OGG',
  /** video/quicktime mime type. */
  VideoQuicktime = 'VIDEO_QUICKTIME',
  /** video/webm mime type. */
  VideoWebm = 'VIDEO_WEBM',
  /** video/x-flv mime type. */
  VideoXFlv = 'VIDEO_X_FLV',
  /** video/x-matroska mime type. */
  VideoXMatroska = 'VIDEO_X_MATROSKA',
  /** video/x-ms-asf mime type. */
  VideoXMsAsf = 'VIDEO_X_MS_ASF',
  /** video/x-ms-wm mime type. */
  VideoXMsWm = 'VIDEO_X_MS_WM',
  /** video/x-ms-wmv mime type. */
  VideoXMsWmv = 'VIDEO_X_MS_WMV',
  /** video/x-ms-wmx mime type. */
  VideoXMsWmx = 'VIDEO_X_MS_WMX',
}

export enum OrderEnum {
  /** Results ordered from lowest to highest values (i.e. A-Z, oldest-newest) */
  Asc = 'ASC',
  /** Results ordered from highest to lowest values (i.e. Z-A, newest-oldest) */
  Desc = 'DESC',
}

export enum PageIdType {
  /** Identify a resource by the Database ID. */
  DatabaseId = 'DATABASE_ID',
  /** Identify a resource by the (hashed) Global ID. */
  Id = 'ID',
  /** Identify a resource by the URI. */
  Uri = 'URI',
}

export type PageToCommentConnectionWhereArgs = {
  authorEmail?: InputMaybe<Scalars['String']['input']>;
  authorIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  authorNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  authorUrl?: InputMaybe<Scalars['String']['input']>;
  commentIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  commentNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  commentType?: InputMaybe<Scalars['String']['input']>;
  commentTypeIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  commentTypeNotIn?: InputMaybe<Scalars['String']['input']>;
  contentAuthor?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contentAuthorIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contentAuthorNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contentId?: InputMaybe<Scalars['ID']['input']>;
  contentIdIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contentIdNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contentName?: InputMaybe<Scalars['String']['input']>;
  contentParent?: InputMaybe<Scalars['Int']['input']>;
  contentStatus?: InputMaybe<Array<InputMaybe<PostStatusEnum>>>;
  contentType?: InputMaybe<Array<InputMaybe<ContentTypeEnum>>>;
  includeUnapproved?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  karma?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<OrderEnum>;
  orderby?: InputMaybe<CommentsConnectionOrderbyEnum>;
  parent?: InputMaybe<Scalars['Int']['input']>;
  parentIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  parentNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  statusIn?: InputMaybe<Array<InputMaybe<CommentStatusEnum>>>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type PageToRevisionConnectionWhereArgs = {
  author?: InputMaybe<Scalars['Int']['input']>;
  authorIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  authorName?: InputMaybe<Scalars['String']['input']>;
  authorNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  dateQuery?: InputMaybe<DateQueryInput>;
  hasPassword?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  isSticky?: InputMaybe<Scalars['Boolean']['input']>;
  mimeType?: InputMaybe<MimeTypeEnum>;
  name?: InputMaybe<Scalars['String']['input']>;
  nameIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  orderby?: InputMaybe<Array<InputMaybe<PostObjectsConnectionOrderbyInput>>>;
  parent?: InputMaybe<Scalars['ID']['input']>;
  parentIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  parentNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  password?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  stati?: InputMaybe<Array<InputMaybe<PostStatusEnum>>>;
  status?: InputMaybe<PostStatusEnum>;
  template?: InputMaybe<ContentTemplateEnum>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export enum PluginStatusEnum {
  /** The plugin is currently active. */
  Active = 'ACTIVE',
  /** The plugin is a drop-in plugin. */
  DropIn = 'DROP_IN',
  /** The plugin is currently inactive. */
  Inactive = 'INACTIVE',
  /** The plugin is a must-use plugin. */
  MustUse = 'MUST_USE',
  /** The plugin is technically active but was paused while loading. */
  Paused = 'PAUSED',
  /** The plugin was active recently. */
  RecentlyActive = 'RECENTLY_ACTIVE',
  /** The plugin has an upgrade available. */
  Upgrade = 'UPGRADE',
}

export type PostCategoriesInput = {
  append?: InputMaybe<Scalars['Boolean']['input']>;
  nodes?: InputMaybe<Array<InputMaybe<PostCategoriesNodeInput>>>;
};

export type PostCategoriesNodeInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};

export enum PostFormatIdType {
  /** The Database ID for the node */
  DatabaseId = 'DATABASE_ID',
  /** The hashed Global ID */
  Id = 'ID',
  /** The name of the node */
  Name = 'NAME',
  /** Url friendly name of the node */
  Slug = 'SLUG',
  /** The URI for the node */
  Uri = 'URI',
}

export type PostFormatToContentNodeConnectionWhereArgs = {
  contentTypes?: InputMaybe<Array<InputMaybe<ContentTypesOfPostFormatEnum>>>;
  dateQuery?: InputMaybe<DateQueryInput>;
  hasPassword?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  isSticky?: InputMaybe<Scalars['Boolean']['input']>;
  mimeType?: InputMaybe<MimeTypeEnum>;
  name?: InputMaybe<Scalars['String']['input']>;
  nameIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  orderby?: InputMaybe<Array<InputMaybe<PostObjectsConnectionOrderbyInput>>>;
  parent?: InputMaybe<Scalars['ID']['input']>;
  parentIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  parentNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  password?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  stati?: InputMaybe<Array<InputMaybe<PostStatusEnum>>>;
  status?: InputMaybe<PostStatusEnum>;
  template?: InputMaybe<ContentTemplateEnum>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type PostFormatToPostConnectionWhereArgs = {
  author?: InputMaybe<Scalars['Int']['input']>;
  authorIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  authorName?: InputMaybe<Scalars['String']['input']>;
  authorNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  categoryIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  categoryName?: InputMaybe<Scalars['String']['input']>;
  categoryNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  dateQuery?: InputMaybe<DateQueryInput>;
  hasPassword?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  isSticky?: InputMaybe<Scalars['Boolean']['input']>;
  mimeType?: InputMaybe<MimeTypeEnum>;
  name?: InputMaybe<Scalars['String']['input']>;
  nameIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  orderby?: InputMaybe<Array<InputMaybe<PostObjectsConnectionOrderbyInput>>>;
  parent?: InputMaybe<Scalars['ID']['input']>;
  parentIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  parentNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  password?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  stati?: InputMaybe<Array<InputMaybe<PostStatusEnum>>>;
  status?: InputMaybe<PostStatusEnum>;
  tag?: InputMaybe<Scalars['String']['input']>;
  tagId?: InputMaybe<Scalars['String']['input']>;
  tagIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  tagNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  tagSlugAnd?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tagSlugIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  template?: InputMaybe<ContentTemplateEnum>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export enum PostIdType {
  /** Identify a resource by the Database ID. */
  DatabaseId = 'DATABASE_ID',
  /** Identify a resource by the (hashed) Global ID. */
  Id = 'ID',
  /** Identify a resource by the slug. Available to non-hierarchcial Types where the slug is a unique identifier. */
  Slug = 'SLUG',
  /** Identify a resource by the URI. */
  Uri = 'URI',
}

export enum PostObjectFieldFormatEnum {
  /** Unprocessed content exactly as stored in the database, requires appropriate permissions. */
  Raw = 'RAW',
  /** Content with all formatting and transformations applied, ready for display. */
  Rendered = 'RENDERED',
}

export enum PostObjectsConnectionDateColumnEnum {
  /** The date the comment was created in local time. */
  Date = 'DATE',
  /** The most recent modification date of the comment. */
  Modified = 'MODIFIED',
}

export enum PostObjectsConnectionOrderbyEnum {
  /** Ordering by content author (typically by author name). */
  Author = 'AUTHOR',
  /** Ordering by popularity based on number of comments. */
  CommentCount = 'COMMENT_COUNT',
  /** Chronological ordering by publication date. */
  Date = 'DATE',
  /** Maintain custom order of IDs exactly as specified in the query with the IN field. */
  In = 'IN',
  /** Ordering by manually defined sort position. */
  MenuOrder = 'MENU_ORDER',
  /** Chronological ordering by modified date. */
  Modified = 'MODIFIED',
  /** Maintain custom order of IDs exactly as specified in the query with the NAME_IN field. */
  NameIn = 'NAME_IN',
  /** Ordering by parent-child relationship in hierarchical content. */
  Parent = 'PARENT',
  /** Alphabetical ordering by URL-friendly name. */
  Slug = 'SLUG',
  /** Alphabetical ordering by content title */
  Title = 'TITLE',
}

export type PostObjectsConnectionOrderbyInput = {
  field: PostObjectsConnectionOrderbyEnum;
  order: OrderEnum;
};

export type PostPostFormatsInput = {
  append?: InputMaybe<Scalars['Boolean']['input']>;
  nodes?: InputMaybe<Array<InputMaybe<PostPostFormatsNodeInput>>>;
};

export type PostPostFormatsNodeInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};

export enum PostStatusEnum {
  /** Objects with the acf-disabled status */
  AcfDisabled = 'ACF_DISABLED',
  /** Automatically saved content that has not been manually saved */
  AutoDraft = 'AUTO_DRAFT',
  /** Content that is saved but not yet published or visible to the public */
  Draft = 'DRAFT',
  /** Objects with the future status */
  Future = 'FUTURE',
  /** Content that inherits its status from a parent object */
  Inherit = 'INHERIT',
  /** Content awaiting review before publication */
  Pending = 'PENDING',
  /** Content only visible to authorized users with appropriate permissions */
  Private = 'PRIVATE',
  /** Content that is publicly visible to all visitors */
  Publish = 'PUBLISH',
  /** Objects with the request-completed status */
  RequestCompleted = 'REQUEST_COMPLETED',
  /** Objects with the request-confirmed status */
  RequestConfirmed = 'REQUEST_CONFIRMED',
  /** Objects with the request-failed status */
  RequestFailed = 'REQUEST_FAILED',
  /** Objects with the request-pending status */
  RequestPending = 'REQUEST_PENDING',
  /** Content marked for deletion but still recoverable */
  Trash = 'TRASH',
}

export type PostTagsInput = {
  append?: InputMaybe<Scalars['Boolean']['input']>;
  nodes?: InputMaybe<Array<InputMaybe<PostTagsNodeInput>>>;
};

export type PostTagsNodeInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type PostToCategoryConnectionWhereArgs = {
  cacheDomain?: InputMaybe<Scalars['String']['input']>;
  childOf?: InputMaybe<Scalars['Int']['input']>;
  childless?: InputMaybe<Scalars['Boolean']['input']>;
  descriptionLike?: InputMaybe<Scalars['String']['input']>;
  exclude?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  excludeTree?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  hideEmpty?: InputMaybe<Scalars['Boolean']['input']>;
  hierarchical?: InputMaybe<Scalars['Boolean']['input']>;
  include?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  nameLike?: InputMaybe<Scalars['String']['input']>;
  objectIds?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  order?: InputMaybe<OrderEnum>;
  orderby?: InputMaybe<TermObjectsConnectionOrderbyEnum>;
  padCounts?: InputMaybe<Scalars['Boolean']['input']>;
  parent?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  termTaxonomId?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  termTaxonomyId?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  updateTermMetaCache?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PostToCommentConnectionWhereArgs = {
  authorEmail?: InputMaybe<Scalars['String']['input']>;
  authorIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  authorNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  authorUrl?: InputMaybe<Scalars['String']['input']>;
  commentIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  commentNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  commentType?: InputMaybe<Scalars['String']['input']>;
  commentTypeIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  commentTypeNotIn?: InputMaybe<Scalars['String']['input']>;
  contentAuthor?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contentAuthorIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contentAuthorNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contentId?: InputMaybe<Scalars['ID']['input']>;
  contentIdIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contentIdNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contentName?: InputMaybe<Scalars['String']['input']>;
  contentParent?: InputMaybe<Scalars['Int']['input']>;
  contentStatus?: InputMaybe<Array<InputMaybe<PostStatusEnum>>>;
  contentType?: InputMaybe<Array<InputMaybe<ContentTypeEnum>>>;
  includeUnapproved?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  karma?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<OrderEnum>;
  orderby?: InputMaybe<CommentsConnectionOrderbyEnum>;
  parent?: InputMaybe<Scalars['Int']['input']>;
  parentIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  parentNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  statusIn?: InputMaybe<Array<InputMaybe<CommentStatusEnum>>>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type PostToPostFormatConnectionWhereArgs = {
  cacheDomain?: InputMaybe<Scalars['String']['input']>;
  childOf?: InputMaybe<Scalars['Int']['input']>;
  childless?: InputMaybe<Scalars['Boolean']['input']>;
  descriptionLike?: InputMaybe<Scalars['String']['input']>;
  exclude?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  excludeTree?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  hideEmpty?: InputMaybe<Scalars['Boolean']['input']>;
  hierarchical?: InputMaybe<Scalars['Boolean']['input']>;
  include?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  nameLike?: InputMaybe<Scalars['String']['input']>;
  objectIds?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  order?: InputMaybe<OrderEnum>;
  orderby?: InputMaybe<TermObjectsConnectionOrderbyEnum>;
  padCounts?: InputMaybe<Scalars['Boolean']['input']>;
  parent?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  termTaxonomId?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  termTaxonomyId?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  updateTermMetaCache?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PostToRevisionConnectionWhereArgs = {
  author?: InputMaybe<Scalars['Int']['input']>;
  authorIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  authorName?: InputMaybe<Scalars['String']['input']>;
  authorNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  categoryIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  categoryName?: InputMaybe<Scalars['String']['input']>;
  categoryNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  dateQuery?: InputMaybe<DateQueryInput>;
  hasPassword?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  isSticky?: InputMaybe<Scalars['Boolean']['input']>;
  mimeType?: InputMaybe<MimeTypeEnum>;
  name?: InputMaybe<Scalars['String']['input']>;
  nameIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  orderby?: InputMaybe<Array<InputMaybe<PostObjectsConnectionOrderbyInput>>>;
  parent?: InputMaybe<Scalars['ID']['input']>;
  parentIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  parentNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  password?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  stati?: InputMaybe<Array<InputMaybe<PostStatusEnum>>>;
  status?: InputMaybe<PostStatusEnum>;
  tag?: InputMaybe<Scalars['String']['input']>;
  tagId?: InputMaybe<Scalars['String']['input']>;
  tagIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  tagNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  tagSlugAnd?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tagSlugIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  template?: InputMaybe<ContentTemplateEnum>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type PostToTagConnectionWhereArgs = {
  cacheDomain?: InputMaybe<Scalars['String']['input']>;
  childOf?: InputMaybe<Scalars['Int']['input']>;
  childless?: InputMaybe<Scalars['Boolean']['input']>;
  descriptionLike?: InputMaybe<Scalars['String']['input']>;
  exclude?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  excludeTree?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  hideEmpty?: InputMaybe<Scalars['Boolean']['input']>;
  hierarchical?: InputMaybe<Scalars['Boolean']['input']>;
  include?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  nameLike?: InputMaybe<Scalars['String']['input']>;
  objectIds?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  order?: InputMaybe<OrderEnum>;
  orderby?: InputMaybe<TermObjectsConnectionOrderbyEnum>;
  padCounts?: InputMaybe<Scalars['Boolean']['input']>;
  parent?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  termTaxonomId?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  termTaxonomyId?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  updateTermMetaCache?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PostToTermNodeConnectionWhereArgs = {
  cacheDomain?: InputMaybe<Scalars['String']['input']>;
  childOf?: InputMaybe<Scalars['Int']['input']>;
  childless?: InputMaybe<Scalars['Boolean']['input']>;
  descriptionLike?: InputMaybe<Scalars['String']['input']>;
  exclude?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  excludeTree?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  hideEmpty?: InputMaybe<Scalars['Boolean']['input']>;
  hierarchical?: InputMaybe<Scalars['Boolean']['input']>;
  include?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  nameLike?: InputMaybe<Scalars['String']['input']>;
  objectIds?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  order?: InputMaybe<OrderEnum>;
  orderby?: InputMaybe<TermObjectsConnectionOrderbyEnum>;
  padCounts?: InputMaybe<Scalars['Boolean']['input']>;
  parent?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  taxonomies?: InputMaybe<Array<InputMaybe<TaxonomyEnum>>>;
  termTaxonomId?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  termTaxonomyId?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  updateTermMetaCache?: InputMaybe<Scalars['Boolean']['input']>;
};

export type RegisterUserInput = {
  aim?: InputMaybe<Scalars['String']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  jabber?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  nicename?: InputMaybe<Scalars['String']['input']>;
  nickname?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  registered?: InputMaybe<Scalars['String']['input']>;
  richEditing?: InputMaybe<Scalars['String']['input']>;
  username: Scalars['String']['input'];
  websiteUrl?: InputMaybe<Scalars['String']['input']>;
  yim?: InputMaybe<Scalars['String']['input']>;
};

export enum RelationEnum {
  /** All conditions must match (more restrictive filtering) */
  And = 'AND',
  /** Any condition can match (more inclusive filtering) */
  Or = 'OR',
}

export type ResetUserPasswordInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
  login?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
};

export type RestoreCommentInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};

export type RootQueryToCategoryConnectionWhereArgs = {
  cacheDomain?: InputMaybe<Scalars['String']['input']>;
  childOf?: InputMaybe<Scalars['Int']['input']>;
  childless?: InputMaybe<Scalars['Boolean']['input']>;
  descriptionLike?: InputMaybe<Scalars['String']['input']>;
  exclude?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  excludeTree?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  hideEmpty?: InputMaybe<Scalars['Boolean']['input']>;
  hierarchical?: InputMaybe<Scalars['Boolean']['input']>;
  include?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  nameLike?: InputMaybe<Scalars['String']['input']>;
  objectIds?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  order?: InputMaybe<OrderEnum>;
  orderby?: InputMaybe<TermObjectsConnectionOrderbyEnum>;
  padCounts?: InputMaybe<Scalars['Boolean']['input']>;
  parent?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  termTaxonomId?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  termTaxonomyId?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  updateTermMetaCache?: InputMaybe<Scalars['Boolean']['input']>;
};

export type RootQueryToCommentConnectionWhereArgs = {
  authorEmail?: InputMaybe<Scalars['String']['input']>;
  authorIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  authorNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  authorUrl?: InputMaybe<Scalars['String']['input']>;
  commentIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  commentNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  commentType?: InputMaybe<Scalars['String']['input']>;
  commentTypeIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  commentTypeNotIn?: InputMaybe<Scalars['String']['input']>;
  contentAuthor?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contentAuthorIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contentAuthorNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contentId?: InputMaybe<Scalars['ID']['input']>;
  contentIdIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contentIdNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contentName?: InputMaybe<Scalars['String']['input']>;
  contentParent?: InputMaybe<Scalars['Int']['input']>;
  contentStatus?: InputMaybe<Array<InputMaybe<PostStatusEnum>>>;
  contentType?: InputMaybe<Array<InputMaybe<ContentTypeEnum>>>;
  includeUnapproved?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  karma?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<OrderEnum>;
  orderby?: InputMaybe<CommentsConnectionOrderbyEnum>;
  parent?: InputMaybe<Scalars['Int']['input']>;
  parentIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  parentNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  statusIn?: InputMaybe<Array<InputMaybe<CommentStatusEnum>>>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type RootQueryToContentNodeConnectionWhereArgs = {
  contentTypes?: InputMaybe<Array<InputMaybe<ContentTypeEnum>>>;
  dateQuery?: InputMaybe<DateQueryInput>;
  hasPassword?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  isSticky?: InputMaybe<Scalars['Boolean']['input']>;
  mimeType?: InputMaybe<MimeTypeEnum>;
  name?: InputMaybe<Scalars['String']['input']>;
  nameIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  orderby?: InputMaybe<Array<InputMaybe<PostObjectsConnectionOrderbyInput>>>;
  parent?: InputMaybe<Scalars['ID']['input']>;
  parentIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  parentNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  password?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  stati?: InputMaybe<Array<InputMaybe<PostStatusEnum>>>;
  status?: InputMaybe<PostStatusEnum>;
  template?: InputMaybe<ContentTemplateEnum>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type RootQueryToEnqueuedScriptConnectionWhereArgs = {
  handlesIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type RootQueryToEnqueuedStylesheetConnectionWhereArgs = {
  handlesIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type RootQueryToMediaItemConnectionWhereArgs = {
  author?: InputMaybe<Scalars['Int']['input']>;
  authorIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  authorName?: InputMaybe<Scalars['String']['input']>;
  authorNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  dateQuery?: InputMaybe<DateQueryInput>;
  hasPassword?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  isSticky?: InputMaybe<Scalars['Boolean']['input']>;
  mimeType?: InputMaybe<MimeTypeEnum>;
  name?: InputMaybe<Scalars['String']['input']>;
  nameIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  orderby?: InputMaybe<Array<InputMaybe<PostObjectsConnectionOrderbyInput>>>;
  parent?: InputMaybe<Scalars['ID']['input']>;
  parentIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  parentNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  password?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  stati?: InputMaybe<Array<InputMaybe<PostStatusEnum>>>;
  status?: InputMaybe<PostStatusEnum>;
  template?: InputMaybe<ContentTemplateEnum>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type RootQueryToMenuConnectionWhereArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  location?: InputMaybe<MenuLocationEnum>;
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type RootQueryToMenuItemConnectionWhereArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  location?: InputMaybe<MenuLocationEnum>;
  parentDatabaseId?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
};

export type RootQueryToPageConnectionWhereArgs = {
  author?: InputMaybe<Scalars['Int']['input']>;
  authorIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  authorName?: InputMaybe<Scalars['String']['input']>;
  authorNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  dateQuery?: InputMaybe<DateQueryInput>;
  hasPassword?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  isSticky?: InputMaybe<Scalars['Boolean']['input']>;
  mimeType?: InputMaybe<MimeTypeEnum>;
  name?: InputMaybe<Scalars['String']['input']>;
  nameIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  orderby?: InputMaybe<Array<InputMaybe<PostObjectsConnectionOrderbyInput>>>;
  parent?: InputMaybe<Scalars['ID']['input']>;
  parentIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  parentNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  password?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  stati?: InputMaybe<Array<InputMaybe<PostStatusEnum>>>;
  status?: InputMaybe<PostStatusEnum>;
  template?: InputMaybe<ContentTemplateEnum>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type RootQueryToPluginConnectionWhereArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
  stati?: InputMaybe<Array<InputMaybe<PluginStatusEnum>>>;
  status?: InputMaybe<PluginStatusEnum>;
};

export type RootQueryToPostConnectionWhereArgs = {
  author?: InputMaybe<Scalars['Int']['input']>;
  authorIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  authorName?: InputMaybe<Scalars['String']['input']>;
  authorNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  categoryIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  categoryName?: InputMaybe<Scalars['String']['input']>;
  categoryNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  dateQuery?: InputMaybe<DateQueryInput>;
  hasPassword?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  isSticky?: InputMaybe<Scalars['Boolean']['input']>;
  mimeType?: InputMaybe<MimeTypeEnum>;
  name?: InputMaybe<Scalars['String']['input']>;
  nameIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  orderby?: InputMaybe<Array<InputMaybe<PostObjectsConnectionOrderbyInput>>>;
  parent?: InputMaybe<Scalars['ID']['input']>;
  parentIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  parentNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  password?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  stati?: InputMaybe<Array<InputMaybe<PostStatusEnum>>>;
  status?: InputMaybe<PostStatusEnum>;
  tag?: InputMaybe<Scalars['String']['input']>;
  tagId?: InputMaybe<Scalars['String']['input']>;
  tagIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  tagNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  tagSlugAnd?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tagSlugIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  template?: InputMaybe<ContentTemplateEnum>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type RootQueryToPostFormatConnectionWhereArgs = {
  cacheDomain?: InputMaybe<Scalars['String']['input']>;
  childOf?: InputMaybe<Scalars['Int']['input']>;
  childless?: InputMaybe<Scalars['Boolean']['input']>;
  descriptionLike?: InputMaybe<Scalars['String']['input']>;
  exclude?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  excludeTree?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  hideEmpty?: InputMaybe<Scalars['Boolean']['input']>;
  hierarchical?: InputMaybe<Scalars['Boolean']['input']>;
  include?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  nameLike?: InputMaybe<Scalars['String']['input']>;
  objectIds?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  order?: InputMaybe<OrderEnum>;
  orderby?: InputMaybe<TermObjectsConnectionOrderbyEnum>;
  padCounts?: InputMaybe<Scalars['Boolean']['input']>;
  parent?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  termTaxonomId?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  termTaxonomyId?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  updateTermMetaCache?: InputMaybe<Scalars['Boolean']['input']>;
};

export type RootQueryToRevisionsConnectionWhereArgs = {
  contentTypes?: InputMaybe<Array<InputMaybe<ContentTypeEnum>>>;
  dateQuery?: InputMaybe<DateQueryInput>;
  hasPassword?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  isSticky?: InputMaybe<Scalars['Boolean']['input']>;
  mimeType?: InputMaybe<MimeTypeEnum>;
  name?: InputMaybe<Scalars['String']['input']>;
  nameIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  orderby?: InputMaybe<Array<InputMaybe<PostObjectsConnectionOrderbyInput>>>;
  parent?: InputMaybe<Scalars['ID']['input']>;
  parentIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  parentNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  password?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  stati?: InputMaybe<Array<InputMaybe<PostStatusEnum>>>;
  status?: InputMaybe<PostStatusEnum>;
  template?: InputMaybe<ContentTemplateEnum>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type RootQueryToTagConnectionWhereArgs = {
  cacheDomain?: InputMaybe<Scalars['String']['input']>;
  childOf?: InputMaybe<Scalars['Int']['input']>;
  childless?: InputMaybe<Scalars['Boolean']['input']>;
  descriptionLike?: InputMaybe<Scalars['String']['input']>;
  exclude?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  excludeTree?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  hideEmpty?: InputMaybe<Scalars['Boolean']['input']>;
  hierarchical?: InputMaybe<Scalars['Boolean']['input']>;
  include?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  nameLike?: InputMaybe<Scalars['String']['input']>;
  objectIds?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  order?: InputMaybe<OrderEnum>;
  orderby?: InputMaybe<TermObjectsConnectionOrderbyEnum>;
  padCounts?: InputMaybe<Scalars['Boolean']['input']>;
  parent?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  termTaxonomId?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  termTaxonomyId?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  updateTermMetaCache?: InputMaybe<Scalars['Boolean']['input']>;
};

export type RootQueryToTermNodeConnectionWhereArgs = {
  cacheDomain?: InputMaybe<Scalars['String']['input']>;
  childOf?: InputMaybe<Scalars['Int']['input']>;
  childless?: InputMaybe<Scalars['Boolean']['input']>;
  descriptionLike?: InputMaybe<Scalars['String']['input']>;
  exclude?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  excludeTree?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  hideEmpty?: InputMaybe<Scalars['Boolean']['input']>;
  hierarchical?: InputMaybe<Scalars['Boolean']['input']>;
  include?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  nameLike?: InputMaybe<Scalars['String']['input']>;
  objectIds?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  order?: InputMaybe<OrderEnum>;
  orderby?: InputMaybe<TermObjectsConnectionOrderbyEnum>;
  padCounts?: InputMaybe<Scalars['Boolean']['input']>;
  parent?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  taxonomies?: InputMaybe<Array<InputMaybe<TaxonomyEnum>>>;
  termTaxonomId?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  termTaxonomyId?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  updateTermMetaCache?: InputMaybe<Scalars['Boolean']['input']>;
};

export type RootQueryToUserConnectionWhereArgs = {
  exclude?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  hasPublishedPosts?: InputMaybe<Array<InputMaybe<ContentTypeEnum>>>;
  include?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  login?: InputMaybe<Scalars['String']['input']>;
  loginIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  loginNotIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  nicename?: InputMaybe<Scalars['String']['input']>;
  nicenameIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  nicenameNotIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  orderby?: InputMaybe<Array<InputMaybe<UsersConnectionOrderbyInput>>>;
  role?: InputMaybe<UserRoleEnum>;
  roleIn?: InputMaybe<Array<InputMaybe<UserRoleEnum>>>;
  roleNotIn?: InputMaybe<Array<InputMaybe<UserRoleEnum>>>;
  search?: InputMaybe<Scalars['String']['input']>;
  searchColumns?: InputMaybe<
    Array<InputMaybe<UsersConnectionSearchColumnEnum>>
  >;
};

/** Types of cards */
export enum SeoCardType {
  Summary = 'summary',
  SummaryLargeImage = 'summary_large_image',
}

export enum ScriptLoadingGroupLocationEnum {
  /** Delayed loading at end of document, right before the closing `<body>` tag. (allows content to render first) */
  Footer = 'FOOTER',
  /** Early loading in document `<head>` tag. (executes before page content renders) */
  Header = 'HEADER',
}

export enum ScriptLoadingStrategyEnum {
  /** Load script in parallel with page rendering, executing as soon as downloaded */
  Async = 'ASYNC',
  /** Download script in parallel but defer execution until page is fully parsed */
  Defer = 'DEFER',
}

export type SendPasswordResetEmailInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  username: Scalars['String']['input'];
};

export enum TagIdType {
  /** The Database ID for the node */
  DatabaseId = 'DATABASE_ID',
  /** The hashed Global ID */
  Id = 'ID',
  /** The name of the node */
  Name = 'NAME',
  /** Url friendly name of the node */
  Slug = 'SLUG',
  /** The URI for the node */
  Uri = 'URI',
}

export type TagToContentNodeConnectionWhereArgs = {
  contentTypes?: InputMaybe<Array<InputMaybe<ContentTypesOfTagEnum>>>;
  dateQuery?: InputMaybe<DateQueryInput>;
  hasPassword?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  isSticky?: InputMaybe<Scalars['Boolean']['input']>;
  mimeType?: InputMaybe<MimeTypeEnum>;
  name?: InputMaybe<Scalars['String']['input']>;
  nameIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  orderby?: InputMaybe<Array<InputMaybe<PostObjectsConnectionOrderbyInput>>>;
  parent?: InputMaybe<Scalars['ID']['input']>;
  parentIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  parentNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  password?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  stati?: InputMaybe<Array<InputMaybe<PostStatusEnum>>>;
  status?: InputMaybe<PostStatusEnum>;
  template?: InputMaybe<ContentTemplateEnum>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type TagToPostConnectionWhereArgs = {
  author?: InputMaybe<Scalars['Int']['input']>;
  authorIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  authorName?: InputMaybe<Scalars['String']['input']>;
  authorNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  categoryIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  categoryName?: InputMaybe<Scalars['String']['input']>;
  categoryNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  dateQuery?: InputMaybe<DateQueryInput>;
  hasPassword?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  isSticky?: InputMaybe<Scalars['Boolean']['input']>;
  mimeType?: InputMaybe<MimeTypeEnum>;
  name?: InputMaybe<Scalars['String']['input']>;
  nameIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  orderby?: InputMaybe<Array<InputMaybe<PostObjectsConnectionOrderbyInput>>>;
  parent?: InputMaybe<Scalars['ID']['input']>;
  parentIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  parentNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  password?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  stati?: InputMaybe<Array<InputMaybe<PostStatusEnum>>>;
  status?: InputMaybe<PostStatusEnum>;
  tag?: InputMaybe<Scalars['String']['input']>;
  tagId?: InputMaybe<Scalars['String']['input']>;
  tagIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  tagNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  tagSlugAnd?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tagSlugIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  template?: InputMaybe<ContentTemplateEnum>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export enum TaxonomyEnum {
  /** Taxonomy enum category */
  Category = 'CATEGORY',
  /** Taxonomy enum post_format */
  Postformat = 'POSTFORMAT',
  /** Taxonomy enum post_tag */
  Tag = 'TAG',
}

export enum TaxonomyIdTypeEnum {
  /** The globally unique ID */
  Id = 'ID',
  /** The name of the taxonomy */
  Name = 'NAME',
}

export enum TermNodeIdTypeEnum {
  /** The Database ID for the node */
  DatabaseId = 'DATABASE_ID',
  /** The hashed Global ID */
  Id = 'ID',
  /** The name of the node */
  Name = 'NAME',
  /** Url friendly name of the node */
  Slug = 'SLUG',
  /** The URI for the node */
  Uri = 'URI',
}

export type TermNodeToEnqueuedScriptConnectionWhereArgs = {
  handlesIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type TermNodeToEnqueuedStylesheetConnectionWhereArgs = {
  handlesIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export enum TermObjectsConnectionOrderbyEnum {
  /** Ordering by number of associated content items. */
  Count = 'COUNT',
  /** Alphabetical ordering by term description text. */
  Description = 'DESCRIPTION',
  /** Alphabetical ordering by term name. */
  Name = 'NAME',
  /** Alphabetical ordering by URL-friendly name. */
  Slug = 'SLUG',
  /** Ordering by assigned term grouping value. */
  TermGroup = 'TERM_GROUP',
  /** Ordering by internal identifier. */
  TermId = 'TERM_ID',
  /** Ordering by manually defined sort position. */
  TermOrder = 'TERM_ORDER',
}

export type UpdateCategoryInput = {
  aliasOf?: InputMaybe<Scalars['String']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  parentDatabaseId?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCommentInput = {
  approved?: InputMaybe<Scalars['String']['input']>;
  author?: InputMaybe<Scalars['String']['input']>;
  authorEmail?: InputMaybe<Scalars['String']['input']>;
  authorUrl?: InputMaybe<Scalars['String']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  commentOn?: InputMaybe<Scalars['Int']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  parent?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<CommentStatusEnum>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMediaItemInput = {
  altText?: InputMaybe<Scalars['String']['input']>;
  authorId?: InputMaybe<Scalars['ID']['input']>;
  caption?: InputMaybe<Scalars['String']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  commentStatus?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  dateGmt?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  filePath?: InputMaybe<Scalars['String']['input']>;
  fileType?: InputMaybe<MimeTypeEnum>;
  id: Scalars['ID']['input'];
  parentId?: InputMaybe<Scalars['ID']['input']>;
  pingStatus?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<MediaItemStatusEnum>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePageInput = {
  authorId?: InputMaybe<Scalars['ID']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  commentStatus?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  ignoreEditLock?: InputMaybe<Scalars['Boolean']['input']>;
  menuOrder?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<PostStatusEnum>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePostFormatInput = {
  aliasOf?: InputMaybe<Scalars['String']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePostInput = {
  authorId?: InputMaybe<Scalars['ID']['input']>;
  categories?: InputMaybe<PostCategoriesInput>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  commentStatus?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  excerpt?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  ignoreEditLock?: InputMaybe<Scalars['Boolean']['input']>;
  menuOrder?: InputMaybe<Scalars['Int']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  pingStatus?: InputMaybe<Scalars['String']['input']>;
  pinged?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  postFormats?: InputMaybe<PostPostFormatsInput>;
  slug?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<PostStatusEnum>;
  tags?: InputMaybe<PostTagsInput>;
  title?: InputMaybe<Scalars['String']['input']>;
  toPing?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type UpdateTagInput = {
  aliasOf?: InputMaybe<Scalars['String']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  aim?: InputMaybe<Scalars['String']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  jabber?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  nicename?: InputMaybe<Scalars['String']['input']>;
  nickname?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  registered?: InputMaybe<Scalars['String']['input']>;
  richEditing?: InputMaybe<Scalars['String']['input']>;
  roles?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  websiteUrl?: InputMaybe<Scalars['String']['input']>;
  yim?: InputMaybe<Scalars['String']['input']>;
};

export enum UserNodeIdTypeEnum {
  /** The Database ID for the node */
  DatabaseId = 'DATABASE_ID',
  /** The Email of the User */
  Email = 'EMAIL',
  /** The hashed Global ID */
  Id = 'ID',
  /** The slug of the User */
  Slug = 'SLUG',
  /** The URI for the node */
  Uri = 'URI',
  /** The username the User uses to login with */
  Username = 'USERNAME',
}

export enum UserRoleEnum {
  /** Full system access with ability to manage all aspects of the site. */
  Administrator = 'ADMINISTRATOR',
  /** Can publish and manage their own content. */
  Author = 'AUTHOR',
  /** Can write and manage their own content but cannot publish. */
  Contributor = 'CONTRIBUTOR',
  /** Content management access without administrative capabilities. */
  Editor = 'EDITOR',
  /** User role with specific capabilities */
  SeoEditor = 'SEO_EDITOR',
  /** User role with specific capabilities */
  SeoManager = 'SEO_MANAGER',
  /** Can only manage their profile and read content. */
  Subscriber = 'SUBSCRIBER',
}

export type UserToCommentConnectionWhereArgs = {
  authorEmail?: InputMaybe<Scalars['String']['input']>;
  authorIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  authorNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  authorUrl?: InputMaybe<Scalars['String']['input']>;
  commentIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  commentNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  commentType?: InputMaybe<Scalars['String']['input']>;
  commentTypeIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  commentTypeNotIn?: InputMaybe<Scalars['String']['input']>;
  contentAuthor?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contentAuthorIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contentAuthorNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contentId?: InputMaybe<Scalars['ID']['input']>;
  contentIdIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contentIdNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contentName?: InputMaybe<Scalars['String']['input']>;
  contentParent?: InputMaybe<Scalars['Int']['input']>;
  contentStatus?: InputMaybe<Array<InputMaybe<PostStatusEnum>>>;
  contentType?: InputMaybe<Array<InputMaybe<ContentTypeEnum>>>;
  includeUnapproved?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  karma?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<OrderEnum>;
  orderby?: InputMaybe<CommentsConnectionOrderbyEnum>;
  parent?: InputMaybe<Scalars['Int']['input']>;
  parentIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  parentNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  statusIn?: InputMaybe<Array<InputMaybe<CommentStatusEnum>>>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type UserToEnqueuedScriptConnectionWhereArgs = {
  handlesIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type UserToEnqueuedStylesheetConnectionWhereArgs = {
  handlesIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type UserToMediaItemConnectionWhereArgs = {
  author?: InputMaybe<Scalars['Int']['input']>;
  authorIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  authorName?: InputMaybe<Scalars['String']['input']>;
  authorNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  dateQuery?: InputMaybe<DateQueryInput>;
  hasPassword?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  isSticky?: InputMaybe<Scalars['Boolean']['input']>;
  mimeType?: InputMaybe<MimeTypeEnum>;
  name?: InputMaybe<Scalars['String']['input']>;
  nameIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  orderby?: InputMaybe<Array<InputMaybe<PostObjectsConnectionOrderbyInput>>>;
  parent?: InputMaybe<Scalars['ID']['input']>;
  parentIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  parentNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  password?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  stati?: InputMaybe<Array<InputMaybe<PostStatusEnum>>>;
  status?: InputMaybe<PostStatusEnum>;
  template?: InputMaybe<ContentTemplateEnum>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UserToPageConnectionWhereArgs = {
  author?: InputMaybe<Scalars['Int']['input']>;
  authorIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  authorName?: InputMaybe<Scalars['String']['input']>;
  authorNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  dateQuery?: InputMaybe<DateQueryInput>;
  hasPassword?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  isSticky?: InputMaybe<Scalars['Boolean']['input']>;
  mimeType?: InputMaybe<MimeTypeEnum>;
  name?: InputMaybe<Scalars['String']['input']>;
  nameIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  orderby?: InputMaybe<Array<InputMaybe<PostObjectsConnectionOrderbyInput>>>;
  parent?: InputMaybe<Scalars['ID']['input']>;
  parentIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  parentNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  password?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  stati?: InputMaybe<Array<InputMaybe<PostStatusEnum>>>;
  status?: InputMaybe<PostStatusEnum>;
  template?: InputMaybe<ContentTemplateEnum>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UserToPostConnectionWhereArgs = {
  author?: InputMaybe<Scalars['Int']['input']>;
  authorIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  authorName?: InputMaybe<Scalars['String']['input']>;
  authorNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  categoryIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  categoryName?: InputMaybe<Scalars['String']['input']>;
  categoryNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  dateQuery?: InputMaybe<DateQueryInput>;
  hasPassword?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  isSticky?: InputMaybe<Scalars['Boolean']['input']>;
  mimeType?: InputMaybe<MimeTypeEnum>;
  name?: InputMaybe<Scalars['String']['input']>;
  nameIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  orderby?: InputMaybe<Array<InputMaybe<PostObjectsConnectionOrderbyInput>>>;
  parent?: InputMaybe<Scalars['ID']['input']>;
  parentIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  parentNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  password?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  stati?: InputMaybe<Array<InputMaybe<PostStatusEnum>>>;
  status?: InputMaybe<PostStatusEnum>;
  tag?: InputMaybe<Scalars['String']['input']>;
  tagId?: InputMaybe<Scalars['String']['input']>;
  tagIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  tagNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  tagSlugAnd?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tagSlugIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  template?: InputMaybe<ContentTemplateEnum>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UserToRevisionsConnectionWhereArgs = {
  contentTypes?: InputMaybe<Array<InputMaybe<ContentTypeEnum>>>;
  dateQuery?: InputMaybe<DateQueryInput>;
  hasPassword?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  isSticky?: InputMaybe<Scalars['Boolean']['input']>;
  mimeType?: InputMaybe<MimeTypeEnum>;
  name?: InputMaybe<Scalars['String']['input']>;
  nameIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  orderby?: InputMaybe<Array<InputMaybe<PostObjectsConnectionOrderbyInput>>>;
  parent?: InputMaybe<Scalars['ID']['input']>;
  parentIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  parentNotIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  password?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  stati?: InputMaybe<Array<InputMaybe<PostStatusEnum>>>;
  status?: InputMaybe<PostStatusEnum>;
  template?: InputMaybe<ContentTemplateEnum>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export enum UsersConnectionOrderbyEnum {
  /** Order by display name */
  DisplayName = 'DISPLAY_NAME',
  /** Order by email address */
  Email = 'EMAIL',
  /** Order by login */
  Login = 'LOGIN',
  /** Preserve the login order given in the LOGIN_IN array */
  LoginIn = 'LOGIN_IN',
  /** Order by nice name */
  NiceName = 'NICE_NAME',
  /** Preserve the nice name order given in the NICE_NAME_IN array */
  NiceNameIn = 'NICE_NAME_IN',
  /** Order by registration date */
  Registered = 'REGISTERED',
  /** Order by URL */
  Url = 'URL',
}

export type UsersConnectionOrderbyInput = {
  field: UsersConnectionOrderbyEnum;
  order?: InputMaybe<OrderEnum>;
};

export enum UsersConnectionSearchColumnEnum {
  /** The user's email address. */
  Email = 'EMAIL',
  /** The globally unique ID. */
  Id = 'ID',
  /** The username the User uses to login with. */
  Login = 'LOGIN',
  /** A URL-friendly name for the user. The default is the user's username. */
  Nicename = 'NICENAME',
  /** The URL of the user's website. */
  Url = 'URL',
}

export type BlooikosHomeHeroQueryVariables = Exact<{ [key: string]: never }>;

export type BlooikosHomeHeroQuery = {
  blooikosSettings: {
    blooikosSiteIdentity: {
      brandName: string | null;
      logo: {
        node: {
          id: string;
          sourceUrl: string | null;
          altText: string | null;
          mimeType: string | null;
          srcSet: string | null;
          sizes: string | null;
          mediaDetails: { width: number | null; height: number | null } | null;
        };
      } | null;
      logoInverse: {
        node: {
          id: string;
          sourceUrl: string | null;
          altText: string | null;
          mimeType: string | null;
          srcSet: string | null;
          sizes: string | null;
          mediaDetails: { width: number | null; height: number | null } | null;
        };
      } | null;
    } | null;
    blooikosSiteContact: {
      phone: string | null;
      email: string | null;
      instagramUrl: string | null;
      address: string | null;
      contactCompany: {
        node: { id: string; title: string | null } | Record<PropertyKey, never>;
      } | null;
    } | null;
    blooikosSiteFooter: {
      footerDescription: string | null;
      copyrightHolder: string | null;
      footerCompanies: {
        nodes: Array<
          | {
              id: string;
              slug: string | null;
              title: string | null;
              blooikosCompanyFields: {
                shortName: string | null;
                cta: {
                  title: string | null;
                  url: string | null;
                  target: string | null;
                } | null;
              } | null;
            }
          | Record<PropertyKey, never>
        >;
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
      } | null;
    } | null;
  } | null;
  primaryMenu: {
    nodes: Array<{
      id: string;
      label: string | null;
      url: string | null;
      target: string | null;
      parentId: string | null;
      order: number | null;
    }>;
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
  } | null;
  footerMenu: {
    nodes: Array<{
      id: string;
      label: string | null;
      url: string | null;
      target: string | null;
      parentId: string | null;
      order: number | null;
    }>;
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
  } | null;
  home:
    | { __typename: 'BlooikosCompany' }
    | { __typename: 'Category' }
    | { __typename: 'Comment' }
    | { __typename: 'ContentType' }
    | { __typename: 'MediaItem' }
    | {
        __typename: 'Page';
        id: string;
        isFrontPage: boolean;
        blooikosHomeHero: {
          eyebrow: string | null;
          titleBefore: string | null;
          titleHighlight: string | null;
          titleAfter: string | null;
          description: string | null;
          background: {
            node: {
              id: string;
              sourceUrl: string | null;
              altText: string | null;
              mimeType: string | null;
              srcSet: string | null;
              sizes: string | null;
              mediaDetails: {
                width: number | null;
                height: number | null;
              } | null;
            };
          } | null;
          primaryCta: {
            title: string | null;
            url: string | null;
            target: string | null;
          } | null;
          secondaryCta: {
            title: string | null;
            url: string | null;
            target: string | null;
          } | null;
        } | null;
      }
    | { __typename: 'Post' }
    | { __typename: 'PostFormat' }
    | { __typename: 'Tag' }
    | { __typename: 'User' }
    | null;
};

export type BlooikosHeaderFooterQueryVariables = Exact<{
  [key: string]: never;
}>;

export type BlooikosHeaderFooterQuery = {
  blooikosSettings: {
    blooikosSiteIdentity: {
      brandName: string | null;
      logo: {
        node: {
          id: string;
          sourceUrl: string | null;
          altText: string | null;
          mimeType: string | null;
          srcSet: string | null;
          sizes: string | null;
          mediaDetails: { width: number | null; height: number | null } | null;
        };
      } | null;
      logoInverse: {
        node: {
          id: string;
          sourceUrl: string | null;
          altText: string | null;
          mimeType: string | null;
          srcSet: string | null;
          sizes: string | null;
          mediaDetails: { width: number | null; height: number | null } | null;
        };
      } | null;
    } | null;
    blooikosSiteContact: {
      phone: string | null;
      email: string | null;
      instagramUrl: string | null;
      address: string | null;
      contactCompany: {
        node: { id: string; title: string | null } | Record<PropertyKey, never>;
      } | null;
    } | null;
    blooikosSiteFooter: {
      footerDescription: string | null;
      copyrightHolder: string | null;
      footerCompanies: {
        nodes: Array<
          | {
              id: string;
              slug: string | null;
              title: string | null;
              blooikosCompanyFields: {
                shortName: string | null;
                cta: {
                  title: string | null;
                  url: string | null;
                  target: string | null;
                } | null;
              } | null;
            }
          | Record<PropertyKey, never>
        >;
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
      } | null;
    } | null;
  } | null;
  primaryMenu: {
    nodes: Array<{
      id: string;
      label: string | null;
      url: string | null;
      target: string | null;
      parentId: string | null;
      order: number | null;
    }>;
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
  } | null;
  footerMenu: {
    nodes: Array<{
      id: string;
      label: string | null;
      url: string | null;
      target: string | null;
      parentId: string | null;
      order: number | null;
    }>;
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
  } | null;
};

export type BlooikosHomeQueryVariables = Exact<{ [key: string]: never }>;

export type BlooikosHomeQuery = {
  blooikosSettings: {
    blooikosSiteIdentity: {
      brandName: string | null;
      logo: {
        node: {
          id: string;
          sourceUrl: string | null;
          altText: string | null;
          mimeType: string | null;
          srcSet: string | null;
          sizes: string | null;
          mediaDetails: { width: number | null; height: number | null } | null;
        };
      } | null;
      logoInverse: {
        node: {
          id: string;
          sourceUrl: string | null;
          altText: string | null;
          mimeType: string | null;
          srcSet: string | null;
          sizes: string | null;
          mediaDetails: { width: number | null; height: number | null } | null;
        };
      } | null;
    } | null;
    blooikosSiteContact: {
      phone: string | null;
      email: string | null;
      instagramUrl: string | null;
      address: string | null;
      contactCompany: {
        node: { id: string; title: string | null } | Record<PropertyKey, never>;
      } | null;
    } | null;
    blooikosSiteFooter: {
      footerDescription: string | null;
      copyrightHolder: string | null;
      footerCompanies: {
        nodes: Array<
          | {
              id: string;
              slug: string | null;
              title: string | null;
              blooikosCompanyFields: {
                shortName: string | null;
                cta: {
                  title: string | null;
                  url: string | null;
                  target: string | null;
                } | null;
              } | null;
            }
          | Record<PropertyKey, never>
        >;
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
      } | null;
    } | null;
  } | null;
  primaryMenu: {
    nodes: Array<{
      id: string;
      label: string | null;
      url: string | null;
      target: string | null;
      parentId: string | null;
      order: number | null;
    }>;
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
  } | null;
  footerMenu: {
    nodes: Array<{
      id: string;
      label: string | null;
      url: string | null;
      target: string | null;
      parentId: string | null;
      order: number | null;
    }>;
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
  } | null;
  home:
    | { __typename: 'BlooikosCompany' }
    | { __typename: 'Category' }
    | { __typename: 'Comment' }
    | { __typename: 'ContentType' }
    | { __typename: 'MediaItem' }
    | {
        __typename: 'Page';
        id: string;
        databaseId: number;
        isFrontPage: boolean;
        blooikosHomeHero: {
          eyebrow: string | null;
          titleBefore: string | null;
          titleHighlight: string | null;
          titleAfter: string | null;
          description: string | null;
          background: {
            node: {
              id: string;
              sourceUrl: string | null;
              altText: string | null;
              mimeType: string | null;
              srcSet: string | null;
              sizes: string | null;
              mediaDetails: {
                width: number | null;
                height: number | null;
              } | null;
            };
          } | null;
          primaryCta: {
            title: string | null;
            url: string | null;
            target: string | null;
          } | null;
          secondaryCta: {
            title: string | null;
            url: string | null;
            target: string | null;
          } | null;
        } | null;
        blooikosHomeAbout: {
          eyebrow: string | null;
          title: string | null;
          body: string | null;
          variant: Array<string | null> | null;
          cta: {
            title: string | null;
            url: string | null;
            target: string | null;
          } | null;
          companies: {
            nodes: Array<
              | {
                  id: string;
                  slug: string | null;
                  title: string | null;
                  blooikosCompanyFields: {
                    summary: string | null;
                    shortName: string | null;
                    cardIcon: {
                      node: {
                        id: string;
                        sourceUrl: string | null;
                        altText: string | null;
                        mimeType: string | null;
                        srcSet: string | null;
                        sizes: string | null;
                        mediaDetails: {
                          width: number | null;
                          height: number | null;
                        } | null;
                      };
                    } | null;
                    cta: {
                      title: string | null;
                      url: string | null;
                      target: string | null;
                    } | null;
                  } | null;
                }
              | Record<PropertyKey, never>
            >;
            pageInfo: { hasNextPage: boolean; endCursor: string | null };
          } | null;
        } | null;
        blooikosHomeInstitutional: {
          decorative: boolean | null;
          image: {
            node: {
              id: string;
              sourceUrl: string | null;
              altText: string | null;
              mimeType: string | null;
              srcSet: string | null;
              sizes: string | null;
              mediaDetails: {
                width: number | null;
                height: number | null;
              } | null;
            };
          } | null;
        } | null;
        blooikosHomeIndicators: {
          eyebrow: string | null;
          title: string | null;
          items: Array<{
            value: string | null;
            label: string | null;
            description: string | null;
          } | null> | null;
        } | null;
        blooikosHomeServices: {
          eyebrow: string | null;
          title: string | null;
          description: string | null;
          variant: Array<string | null> | null;
          items: Array<{
            title: string | null;
            description: string | null;
            icon: {
              node: {
                id: string;
                sourceUrl: string | null;
                altText: string | null;
                mimeType: string | null;
                srcSet: string | null;
                sizes: string | null;
                mediaDetails: {
                  width: number | null;
                  height: number | null;
                } | null;
              };
            } | null;
          } | null> | null;
        } | null;
        blooikosHomeCompanies: {
          featured: {
            nodes: Array<
              | {
                  id: string;
                  slug: string | null;
                  title: string | null;
                  blooikosCompanyFields: {
                    eyebrow: string | null;
                    heading: string | null;
                    body: string | null;
                    shortName: string | null;
                    logo: {
                      node: {
                        id: string;
                        sourceUrl: string | null;
                        altText: string | null;
                        mimeType: string | null;
                        srcSet: string | null;
                        sizes: string | null;
                        mediaDetails: {
                          width: number | null;
                          height: number | null;
                        } | null;
                      };
                    } | null;
                    image: {
                      node: {
                        id: string;
                        sourceUrl: string | null;
                        altText: string | null;
                        mimeType: string | null;
                        srcSet: string | null;
                        sizes: string | null;
                        mediaDetails: {
                          width: number | null;
                          height: number | null;
                        } | null;
                      };
                    } | null;
                    cta: {
                      title: string | null;
                      url: string | null;
                      target: string | null;
                    } | null;
                  } | null;
                }
              | Record<PropertyKey, never>
            >;
            pageInfo: { hasNextPage: boolean; endCursor: string | null };
          } | null;
        } | null;
        blooikosHomeContact: {
          eyebrow: string | null;
          title: string | null;
          variant: Array<string | null> | null;
        } | null;
      }
    | { __typename: 'Post' }
    | { __typename: 'PostFormat' }
    | { __typename: 'Tag' }
    | { __typename: 'User' }
    | null;
};

export type BlooikosGlobalSettingsFragment = {
  blooikosSiteIdentity: {
    brandName: string | null;
    logo: {
      node: {
        id: string;
        sourceUrl: string | null;
        altText: string | null;
        mimeType: string | null;
        srcSet: string | null;
        sizes: string | null;
        mediaDetails: { width: number | null; height: number | null } | null;
      };
    } | null;
    logoInverse: {
      node: {
        id: string;
        sourceUrl: string | null;
        altText: string | null;
        mimeType: string | null;
        srcSet: string | null;
        sizes: string | null;
        mediaDetails: { width: number | null; height: number | null } | null;
      };
    } | null;
  } | null;
  blooikosSiteContact: {
    phone: string | null;
    email: string | null;
    instagramUrl: string | null;
    address: string | null;
    contactCompany: {
      node: { id: string; title: string | null } | Record<PropertyKey, never>;
    } | null;
  } | null;
  blooikosSiteFooter: {
    footerDescription: string | null;
    copyrightHolder: string | null;
    footerCompanies: {
      nodes: Array<
        | {
            id: string;
            slug: string | null;
            title: string | null;
            blooikosCompanyFields: {
              shortName: string | null;
              cta: {
                title: string | null;
                url: string | null;
                target: string | null;
              } | null;
            } | null;
          }
        | Record<PropertyKey, never>
      >;
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
    } | null;
  } | null;
};

export type BlooikosCompanyIdentityFragment = {
  id: string;
  slug: string | null;
  title: string | null;
  blooikosCompanyFields: {
    shortName: string | null;
    cta: {
      title: string | null;
      url: string | null;
      target: string | null;
    } | null;
  } | null;
};

export type BlooikosCompanyCardFragment = {
  id: string;
  slug: string | null;
  title: string | null;
  blooikosCompanyFields: {
    summary: string | null;
    shortName: string | null;
    cardIcon: {
      node: {
        id: string;
        sourceUrl: string | null;
        altText: string | null;
        mimeType: string | null;
        srcSet: string | null;
        sizes: string | null;
        mediaDetails: { width: number | null; height: number | null } | null;
      };
    } | null;
    cta: {
      title: string | null;
      url: string | null;
      target: string | null;
    } | null;
  } | null;
};

export type BlooikosCompanySectionFragment = {
  id: string;
  slug: string | null;
  title: string | null;
  blooikosCompanyFields: {
    eyebrow: string | null;
    heading: string | null;
    body: string | null;
    shortName: string | null;
    logo: {
      node: {
        id: string;
        sourceUrl: string | null;
        altText: string | null;
        mimeType: string | null;
        srcSet: string | null;
        sizes: string | null;
        mediaDetails: { width: number | null; height: number | null } | null;
      };
    } | null;
    image: {
      node: {
        id: string;
        sourceUrl: string | null;
        altText: string | null;
        mimeType: string | null;
        srcSet: string | null;
        sizes: string | null;
        mediaDetails: { width: number | null; height: number | null } | null;
      };
    } | null;
    cta: {
      title: string | null;
      url: string | null;
      target: string | null;
    } | null;
  } | null;
};

export type BlooikosImageFragment = {
  id: string;
  sourceUrl: string | null;
  altText: string | null;
  mimeType: string | null;
  srcSet: string | null;
  sizes: string | null;
  mediaDetails: { width: number | null; height: number | null } | null;
};

export type BlooikosLinkFragment = {
  title: string | null;
  url: string | null;
  target: string | null;
};

export type BlooikosNavigationItemFragment = {
  id: string;
  label: string | null;
  url: string | null;
  target: string | null;
  parentId: string | null;
  order: number | null;
};

export type BlooikosFoundationSmokeQueryVariables = Exact<{
  [key: string]: never;
}>;

export type BlooikosFoundationSmokeQuery = { __typename: 'RootQuery' };

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigInt: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type Meta = {
  __typename?: 'Meta';
  status?: Maybe<Scalars['JSON']['output']>;
};

/** Information about pagination in a connection */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** Cursor pointing to the last record in the current page */
  endCursor?: Maybe<Scalars['String']['output']>;
  /** Whether there are more records after the current page */
  hasNextPage: Scalars['Boolean']['output'];
  /** Whether there are more records before the current page */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** Cursor pointing to the first record in the current page */
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  _meta?: Maybe<Meta>;
  actionPaused?: Maybe<ActionPaused>;
  actionPauseds: ActionPausedPage;
  aprSnapshot?: Maybe<AprSnapshot>;
  aprSnapshots: AprSnapshotPage;
  borrow?: Maybe<Borrow>;
  borrows: BorrowPage;
  delegateUpdated?: Maybe<DelegateUpdated>;
  delegateUpdateds: DelegateUpdatedPage;
  deposit?: Maybe<Deposit>;
  deposits: DepositPage;
  eMode?: Maybe<EMode>;
  eModes: EModePage;
  liquidateBorrow?: Maybe<LiquidateBorrow>;
  liquidateBorrows: LiquidateBorrowPage;
  marketEntered?: Maybe<MarketEntered>;
  marketEntereds: MarketEnteredPage;
  marketExited?: Maybe<MarketExited>;
  marketExiteds: MarketExitedPage;
  pToken?: Maybe<PToken>;
  pTokenEMode?: Maybe<PTokenEMode>;
  pTokenEModes: PTokenEModePage;
  pTokens: PTokenPage;
  priceSnapshot?: Maybe<PriceSnapshot>;
  priceSnapshots: PriceSnapshotPage;
  protocol?: Maybe<Protocol>;
  protocols: ProtocolPage;
  repayBorrow?: Maybe<RepayBorrow>;
  repayBorrows: RepayBorrowPage;
  transaction?: Maybe<Transaction>;
  transactions: TransactionPage;
  transfer?: Maybe<Transfer>;
  transfers: TransferPage;
  underlyingToken?: Maybe<UnderlyingToken>;
  underlyingTokens: UnderlyingTokenPage;
  user?: Maybe<User>;
  userBalance?: Maybe<UserBalance>;
  userBalances: UserBalancePage;
  userDelegation?: Maybe<UserDelegation>;
  userDelegations: UserDelegationPage;
  userEMode?: Maybe<UserEMode>;
  userEModes: UserEModePage;
  users: UserPage;
  withdraw?: Maybe<Withdraw>;
  withdraws: WithdrawPage;
};


export type QueryActionPausedArgs = {
  id: Scalars['String']['input'];
};


export type QueryActionPausedsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<ActionPausedFilter>;
};


export type QueryAprSnapshotArgs = {
  id: Scalars['String']['input'];
};


export type QueryAprSnapshotsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<AprSnapshotFilter>;
};


export type QueryBorrowArgs = {
  id: Scalars['String']['input'];
};


export type QueryBorrowsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<BorrowFilter>;
};


export type QueryDelegateUpdatedArgs = {
  id: Scalars['String']['input'];
};


export type QueryDelegateUpdatedsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<DelegateUpdatedFilter>;
};


export type QueryDepositArgs = {
  id: Scalars['String']['input'];
};


export type QueryDepositsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<DepositFilter>;
};


export type QueryEModeArgs = {
  id: Scalars['String']['input'];
};


export type QueryEModesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<EModeFilter>;
};


export type QueryLiquidateBorrowArgs = {
  id: Scalars['String']['input'];
};


export type QueryLiquidateBorrowsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<LiquidateBorrowFilter>;
};


export type QueryMarketEnteredArgs = {
  id: Scalars['String']['input'];
};


export type QueryMarketEnteredsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<MarketEnteredFilter>;
};


export type QueryMarketExitedArgs = {
  id: Scalars['String']['input'];
};


export type QueryMarketExitedsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<MarketExitedFilter>;
};


export type QueryPTokenArgs = {
  id: Scalars['String']['input'];
};


export type QueryPTokenEModeArgs = {
  id: Scalars['String']['input'];
};


export type QueryPTokenEModesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<PTokenEModeFilter>;
};


export type QueryPTokensArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<PTokenFilter>;
};


export type QueryPriceSnapshotArgs = {
  id: Scalars['String']['input'];
};


export type QueryPriceSnapshotsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<PriceSnapshotFilter>;
};


export type QueryProtocolArgs = {
  id: Scalars['String']['input'];
};


export type QueryProtocolsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<ProtocolFilter>;
};


export type QueryRepayBorrowArgs = {
  id: Scalars['String']['input'];
};


export type QueryRepayBorrowsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<RepayBorrowFilter>;
};


export type QueryTransactionArgs = {
  id: Scalars['String']['input'];
};


export type QueryTransactionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<TransactionFilter>;
};


export type QueryTransferArgs = {
  id: Scalars['String']['input'];
};


export type QueryTransfersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<TransferFilter>;
};


export type QueryUnderlyingTokenArgs = {
  id: Scalars['String']['input'];
};


export type QueryUnderlyingTokensArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<UnderlyingTokenFilter>;
};


export type QueryUserArgs = {
  id: Scalars['String']['input'];
};


export type QueryUserBalanceArgs = {
  id: Scalars['String']['input'];
};


export type QueryUserBalancesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<UserBalanceFilter>;
};


export type QueryUserDelegationArgs = {
  id: Scalars['String']['input'];
};


export type QueryUserDelegationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<UserDelegationFilter>;
};


export type QueryUserEModeArgs = {
  id: Scalars['String']['input'];
};


export type QueryUserEModesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<UserEModeFilter>;
};


export type QueryUsersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<UserFilter>;
};


export type QueryWithdrawArgs = {
  id: Scalars['String']['input'];
};


export type QueryWithdrawsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<WithdrawFilter>;
};

/** Get a single Types of actions that can be paused by address */
export type Action =
  | 'Borrow'
  | 'Mint'
  | 'Seize'
  | 'Transfer';

/** Get a single market pause action tracking by address */
export type ActionPaused = {
  __typename?: 'actionPaused';
  /** Type of action that is paused (exact match) */
  action: Action;
  /** The blockchain network identifier (exact match) */
  chainId: Scalars['BigInt']['output'];
  /** Unique identifier for the pause action (exact match) */
  id: Scalars['String']['output'];
  pToken?: Maybe<PToken>;
  /** Pike token (pToken) identifier (if token-specific pause) (exact match) */
  pTokenId?: Maybe<Scalars['String']['output']>;
  /** Whether the action is currently paused (exact match) */
  pauseState: Scalars['Boolean']['output'];
  protocol?: Maybe<Protocol>;
  /** Protocol identifier (if protocol-wide pause) (exact match) */
  protocolId?: Maybe<Scalars['String']['output']>;
  transaction?: Maybe<Transaction>;
  /** Transaction that triggered the pause state (exact match) */
  transactionId: Scalars['String']['output'];
};

export type ActionPausedFilter = {
  AND?: InputMaybe<Array<InputMaybe<ActionPausedFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<ActionPausedFilter>>>;
  action?: InputMaybe<Action>;
  action_in?: InputMaybe<Array<InputMaybe<Action>>>;
  action_not?: InputMaybe<Action>;
  action_not_in?: InputMaybe<Array<InputMaybe<Action>>>;
  chainId?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId?: InputMaybe<Scalars['String']['input']>;
  pTokenId_contains?: InputMaybe<Scalars['String']['input']>;
  pTokenId_ends_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  pTokenId_not?: InputMaybe<Scalars['String']['input']>;
  pTokenId_not_contains?: InputMaybe<Scalars['String']['input']>;
  pTokenId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  pTokenId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId_starts_with?: InputMaybe<Scalars['String']['input']>;
  pauseState?: InputMaybe<Scalars['Boolean']['input']>;
  pauseState_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  pauseState_not?: InputMaybe<Scalars['Boolean']['input']>;
  pauseState_not_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  protocolId?: InputMaybe<Scalars['String']['input']>;
  protocolId_contains?: InputMaybe<Scalars['String']['input']>;
  protocolId_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocolId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  protocolId_not?: InputMaybe<Scalars['String']['input']>;
  protocolId_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocolId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocolId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  protocolId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocolId_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
  transactionId_contains?: InputMaybe<Scalars['String']['input']>;
  transactionId_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionId_not?: InputMaybe<Scalars['String']['input']>;
  transactionId_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionId_starts_with?: InputMaybe<Scalars['String']['input']>;
};

/** Paginated list of market pause action tracking records */
export type ActionPausedPage = {
  __typename?: 'actionPausedPage';
  /** List of market pause action tracking records */
  items: Array<ActionPaused>;
  /** Information about pagination in a connection */
  pageInfo: PageInfo;
  /** Total number of records matching the query */
  totalCount: Scalars['Int']['output'];
};

/** Get a single interest rate history information by address */
export type AprSnapshot = {
  __typename?: 'aprSnapshot';
  /** Borrowing rate per second (exact match) */
  borrowRatePerSecond: Scalars['BigInt']['output'];
  /** The blockchain network identifier (exact match) */
  chainId: Scalars['BigInt']['output'];
  /** Unique identifier for the APR snapshot composed by <pTokenAddress>-<chainId>-<blockNumber> (exact match) */
  id: Scalars['String']['output'];
  /** Pike token (pToken) identifier (exact match) */
  pTokenId: Scalars['String']['output'];
  /** Supply rate per second (exact match) */
  supplyRatePerSecond: Scalars['BigInt']['output'];
  /** When the rates were recorded (exact match) */
  timestamp: Scalars['BigInt']['output'];
};

export type AprSnapshotFilter = {
  AND?: InputMaybe<Array<InputMaybe<AprSnapshotFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<AprSnapshotFilter>>>;
  borrowRatePerSecond?: InputMaybe<Scalars['BigInt']['input']>;
  borrowRatePerSecond_gt?: InputMaybe<Scalars['BigInt']['input']>;
  borrowRatePerSecond_gte?: InputMaybe<Scalars['BigInt']['input']>;
  borrowRatePerSecond_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  borrowRatePerSecond_lt?: InputMaybe<Scalars['BigInt']['input']>;
  borrowRatePerSecond_lte?: InputMaybe<Scalars['BigInt']['input']>;
  borrowRatePerSecond_not?: InputMaybe<Scalars['BigInt']['input']>;
  borrowRatePerSecond_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  chainId?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId?: InputMaybe<Scalars['String']['input']>;
  pTokenId_contains?: InputMaybe<Scalars['String']['input']>;
  pTokenId_ends_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  pTokenId_not?: InputMaybe<Scalars['String']['input']>;
  pTokenId_not_contains?: InputMaybe<Scalars['String']['input']>;
  pTokenId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  pTokenId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId_starts_with?: InputMaybe<Scalars['String']['input']>;
  supplyRatePerSecond?: InputMaybe<Scalars['BigInt']['input']>;
  supplyRatePerSecond_gt?: InputMaybe<Scalars['BigInt']['input']>;
  supplyRatePerSecond_gte?: InputMaybe<Scalars['BigInt']['input']>;
  supplyRatePerSecond_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  supplyRatePerSecond_lt?: InputMaybe<Scalars['BigInt']['input']>;
  supplyRatePerSecond_lte?: InputMaybe<Scalars['BigInt']['input']>;
  supplyRatePerSecond_not?: InputMaybe<Scalars['BigInt']['input']>;
  supplyRatePerSecond_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
};

/** Paginated list of interest rate history information records */
export type AprSnapshotPage = {
  __typename?: 'aprSnapshotPage';
  /** List of interest rate history information records */
  items: Array<AprSnapshot>;
  /** Information about pagination in a connection */
  pageInfo: PageInfo;
  /** Total number of records matching the query */
  totalCount: Scalars['Int']['output'];
};

/** Get a single borrow transaction information by address */
export type Borrow = {
  __typename?: 'borrow';
  /** Total borrows for the account in the market (underlying) (exact match) */
  accountBorrows: Scalars['BigInt']['output'];
  /** Amount of assets borrowed (underlying) (exact match) */
  borrowAssets: Scalars['BigInt']['output'];
  /** Address that performed the borrow (exact match) */
  borrower: Scalars['String']['output'];
  /** The blockchain network identifier (exact match) */
  chainId: Scalars['BigInt']['output'];
  /** Unique identifier for the borrow composed by <transactionHash>-<logIndex> (exact match) */
  id: Scalars['String']['output'];
  pToken?: Maybe<PToken>;
  /** Pike token (pToken) identifier (exact match) */
  pTokenId: Scalars['String']['output'];
  /** Total borrows for the market (underlying) (exact match) */
  totalBorrows: Scalars['BigInt']['output'];
  transaction?: Maybe<Transaction>;
  /** Associated transaction identifier (exact match) */
  transactionId: Scalars['String']['output'];
  /** USD value of the borrow (exact match) */
  usdValue: Scalars['String']['output'];
  user?: Maybe<User>;
  /** User identifier (exact match) */
  userId: Scalars['String']['output'];
};

export type BorrowFilter = {
  AND?: InputMaybe<Array<InputMaybe<BorrowFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<BorrowFilter>>>;
  accountBorrows?: InputMaybe<Scalars['BigInt']['input']>;
  accountBorrows_gt?: InputMaybe<Scalars['BigInt']['input']>;
  accountBorrows_gte?: InputMaybe<Scalars['BigInt']['input']>;
  accountBorrows_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  accountBorrows_lt?: InputMaybe<Scalars['BigInt']['input']>;
  accountBorrows_lte?: InputMaybe<Scalars['BigInt']['input']>;
  accountBorrows_not?: InputMaybe<Scalars['BigInt']['input']>;
  accountBorrows_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  borrowAssets?: InputMaybe<Scalars['BigInt']['input']>;
  borrowAssets_gt?: InputMaybe<Scalars['BigInt']['input']>;
  borrowAssets_gte?: InputMaybe<Scalars['BigInt']['input']>;
  borrowAssets_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  borrowAssets_lt?: InputMaybe<Scalars['BigInt']['input']>;
  borrowAssets_lte?: InputMaybe<Scalars['BigInt']['input']>;
  borrowAssets_not?: InputMaybe<Scalars['BigInt']['input']>;
  borrowAssets_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  borrower?: InputMaybe<Scalars['String']['input']>;
  borrower_contains?: InputMaybe<Scalars['String']['input']>;
  borrower_ends_with?: InputMaybe<Scalars['String']['input']>;
  borrower_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  borrower_not?: InputMaybe<Scalars['String']['input']>;
  borrower_not_contains?: InputMaybe<Scalars['String']['input']>;
  borrower_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  borrower_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  borrower_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  borrower_starts_with?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId?: InputMaybe<Scalars['String']['input']>;
  pTokenId_contains?: InputMaybe<Scalars['String']['input']>;
  pTokenId_ends_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  pTokenId_not?: InputMaybe<Scalars['String']['input']>;
  pTokenId_not_contains?: InputMaybe<Scalars['String']['input']>;
  pTokenId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  pTokenId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId_starts_with?: InputMaybe<Scalars['String']['input']>;
  totalBorrows?: InputMaybe<Scalars['BigInt']['input']>;
  totalBorrows_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalBorrows_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalBorrows_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  totalBorrows_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalBorrows_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalBorrows_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalBorrows_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
  transactionId_contains?: InputMaybe<Scalars['String']['input']>;
  transactionId_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionId_not?: InputMaybe<Scalars['String']['input']>;
  transactionId_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionId_starts_with?: InputMaybe<Scalars['String']['input']>;
  usdValue?: InputMaybe<Scalars['String']['input']>;
  usdValue_contains?: InputMaybe<Scalars['String']['input']>;
  usdValue_ends_with?: InputMaybe<Scalars['String']['input']>;
  usdValue_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  usdValue_not?: InputMaybe<Scalars['String']['input']>;
  usdValue_not_contains?: InputMaybe<Scalars['String']['input']>;
  usdValue_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  usdValue_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  usdValue_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  usdValue_starts_with?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
  userId_contains?: InputMaybe<Scalars['String']['input']>;
  userId_ends_with?: InputMaybe<Scalars['String']['input']>;
  userId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  userId_not?: InputMaybe<Scalars['String']['input']>;
  userId_not_contains?: InputMaybe<Scalars['String']['input']>;
  userId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  userId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  userId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  userId_starts_with?: InputMaybe<Scalars['String']['input']>;
};

/** Paginated list of borrow transaction information records */
export type BorrowPage = {
  __typename?: 'borrowPage';
  /** List of borrow transaction information records */
  items: Array<Borrow>;
  /** Information about pagination in a connection */
  pageInfo: PageInfo;
  /** Total number of records matching the query */
  totalCount: Scalars['Int']['output'];
};

/** Get a single delegation update events by address */
export type DelegateUpdated = {
  __typename?: 'delegateUpdated';
  /** Whether the delegation was approved (exact match) */
  approved: Scalars['Boolean']['output'];
  /** The blockchain network identifier (exact match) */
  chainId: Scalars['BigInt']['output'];
  /** Address of the delegate (exact match) */
  delegateAddress: Scalars['String']['output'];
  /** Unique identifier for the delegate update composed by <transactionHash>-<logIndex> (exact match) */
  id: Scalars['String']['output'];
  protocol?: Maybe<Protocol>;
  /** Protocol identifier (exact match) */
  protocolId: Scalars['String']['output'];
  transaction?: Maybe<Transaction>;
  /** Associated transaction identifier (exact match) */
  transactionId: Scalars['String']['output'];
  user?: Maybe<User>;
  /** User identifier (exact match) */
  userId: Scalars['String']['output'];
};

export type DelegateUpdatedFilter = {
  AND?: InputMaybe<Array<InputMaybe<DelegateUpdatedFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<DelegateUpdatedFilter>>>;
  approved?: InputMaybe<Scalars['Boolean']['input']>;
  approved_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  approved_not?: InputMaybe<Scalars['Boolean']['input']>;
  approved_not_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  chainId?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  delegateAddress?: InputMaybe<Scalars['String']['input']>;
  delegateAddress_contains?: InputMaybe<Scalars['String']['input']>;
  delegateAddress_ends_with?: InputMaybe<Scalars['String']['input']>;
  delegateAddress_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  delegateAddress_not?: InputMaybe<Scalars['String']['input']>;
  delegateAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
  delegateAddress_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  delegateAddress_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  delegateAddress_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  delegateAddress_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocolId?: InputMaybe<Scalars['String']['input']>;
  protocolId_contains?: InputMaybe<Scalars['String']['input']>;
  protocolId_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocolId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  protocolId_not?: InputMaybe<Scalars['String']['input']>;
  protocolId_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocolId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocolId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  protocolId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocolId_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
  transactionId_contains?: InputMaybe<Scalars['String']['input']>;
  transactionId_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionId_not?: InputMaybe<Scalars['String']['input']>;
  transactionId_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionId_starts_with?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
  userId_contains?: InputMaybe<Scalars['String']['input']>;
  userId_ends_with?: InputMaybe<Scalars['String']['input']>;
  userId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  userId_not?: InputMaybe<Scalars['String']['input']>;
  userId_not_contains?: InputMaybe<Scalars['String']['input']>;
  userId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  userId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  userId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  userId_starts_with?: InputMaybe<Scalars['String']['input']>;
};

/** Paginated list of delegation update events records */
export type DelegateUpdatedPage = {
  __typename?: 'delegateUpdatedPage';
  /** List of delegation update events records */
  items: Array<DelegateUpdated>;
  /** Information about pagination in a connection */
  pageInfo: PageInfo;
  /** Total number of records matching the query */
  totalCount: Scalars['Int']['output'];
};

/** Get a single deposit transaction information by address */
export type Deposit = {
  __typename?: 'deposit';
  /** Amount of assets deposited (underlying) (exact match) */
  assets: Scalars['BigInt']['output'];
  /** The blockchain network identifier (exact match) */
  chainId: Scalars['BigInt']['output'];
  /** Unique identifier for the deposit composed by <transactionHash>-<logIndex> (exact match) */
  id: Scalars['String']['output'];
  /** Address that performed the mint (exact match) */
  minter: Scalars['String']['output'];
  pToken?: Maybe<PToken>;
  /** Pike token (pToken) identifier (exact match) */
  pTokenId: Scalars['String']['output'];
  /** Number of shares minted (pTokens) (exact match) */
  shares: Scalars['BigInt']['output'];
  transaction?: Maybe<Transaction>;
  /** Associated transaction identifier (exact match) */
  transactionId: Scalars['String']['output'];
  /** USD value of the deposit (exact match) */
  usdValue: Scalars['String']['output'];
  user?: Maybe<User>;
  /** User identifier (exact match) */
  userId: Scalars['String']['output'];
};

export type DepositFilter = {
  AND?: InputMaybe<Array<InputMaybe<DepositFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<DepositFilter>>>;
  assets?: InputMaybe<Scalars['BigInt']['input']>;
  assets_gt?: InputMaybe<Scalars['BigInt']['input']>;
  assets_gte?: InputMaybe<Scalars['BigInt']['input']>;
  assets_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  assets_lt?: InputMaybe<Scalars['BigInt']['input']>;
  assets_lte?: InputMaybe<Scalars['BigInt']['input']>;
  assets_not?: InputMaybe<Scalars['BigInt']['input']>;
  assets_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  chainId?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  minter?: InputMaybe<Scalars['String']['input']>;
  minter_contains?: InputMaybe<Scalars['String']['input']>;
  minter_ends_with?: InputMaybe<Scalars['String']['input']>;
  minter_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  minter_not?: InputMaybe<Scalars['String']['input']>;
  minter_not_contains?: InputMaybe<Scalars['String']['input']>;
  minter_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  minter_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  minter_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  minter_starts_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId?: InputMaybe<Scalars['String']['input']>;
  pTokenId_contains?: InputMaybe<Scalars['String']['input']>;
  pTokenId_ends_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  pTokenId_not?: InputMaybe<Scalars['String']['input']>;
  pTokenId_not_contains?: InputMaybe<Scalars['String']['input']>;
  pTokenId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  pTokenId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId_starts_with?: InputMaybe<Scalars['String']['input']>;
  shares?: InputMaybe<Scalars['BigInt']['input']>;
  shares_gt?: InputMaybe<Scalars['BigInt']['input']>;
  shares_gte?: InputMaybe<Scalars['BigInt']['input']>;
  shares_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  shares_lt?: InputMaybe<Scalars['BigInt']['input']>;
  shares_lte?: InputMaybe<Scalars['BigInt']['input']>;
  shares_not?: InputMaybe<Scalars['BigInt']['input']>;
  shares_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
  transactionId_contains?: InputMaybe<Scalars['String']['input']>;
  transactionId_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionId_not?: InputMaybe<Scalars['String']['input']>;
  transactionId_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionId_starts_with?: InputMaybe<Scalars['String']['input']>;
  usdValue?: InputMaybe<Scalars['String']['input']>;
  usdValue_contains?: InputMaybe<Scalars['String']['input']>;
  usdValue_ends_with?: InputMaybe<Scalars['String']['input']>;
  usdValue_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  usdValue_not?: InputMaybe<Scalars['String']['input']>;
  usdValue_not_contains?: InputMaybe<Scalars['String']['input']>;
  usdValue_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  usdValue_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  usdValue_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  usdValue_starts_with?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
  userId_contains?: InputMaybe<Scalars['String']['input']>;
  userId_ends_with?: InputMaybe<Scalars['String']['input']>;
  userId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  userId_not?: InputMaybe<Scalars['String']['input']>;
  userId_not_contains?: InputMaybe<Scalars['String']['input']>;
  userId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  userId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  userId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  userId_starts_with?: InputMaybe<Scalars['String']['input']>;
};

/** Paginated list of deposit transaction information records */
export type DepositPage = {
  __typename?: 'depositPage';
  /** List of deposit transaction information records */
  items: Array<Deposit>;
  /** Information about pagination in a connection */
  pageInfo: PageInfo;
  /** Total number of records matching the query */
  totalCount: Scalars['Int']['output'];
};

/** Get a single efficiency mode configuration of one protocol by address */
export type EMode = {
  __typename?: 'eMode';
  /** Category identifier (exact match) */
  categoryId: Scalars['String']['output'];
  /** The blockchain network identifier (exact match) */
  chainId: Scalars['BigInt']['output'];
  /** Multiplier representing the most one can borrow against their collateral in this market. For instance, 0.9 to allow borrowing 90% of collateral value. If is active it overrides the pToken data. (exact match) */
  collateralFactor: Scalars['BigInt']['output'];
  /** Unique identifier for the e-mode composed by <protocolRiskEngineAddress>-<eModeCategoryId>-<chainId> (exact match) */
  id: Scalars['String']['output'];
  /** Multiplier representing the discount on collateral that a liquidator receives. If is active it overrides the pToken data (exact match) */
  liquidationIncentive: Scalars['BigInt']['output'];
  /** Multiplier representing the collateralization after which the borrow is eligible for liquidation. For instance, 0.8 liquidate when the borrow is 80% of collateral value. If is active it overrides the pToken data (exact match) */
  liquidationThreshold: Scalars['BigInt']['output'];
  pTokens?: Maybe<PTokenEModePage>;
  protocol?: Maybe<Protocol>;
  /** Protocol identifier (exact match) */
  protocolId: Scalars['String']['output'];
  users?: Maybe<UserEModePage>;
};


/** Get a single efficiency mode configuration of one protocol by address */
export type EModePTokensArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<PTokenEModeFilter>;
};


/** Get a single efficiency mode configuration of one protocol by address */
export type EModeUsersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<UserEModeFilter>;
};

export type EModeFilter = {
  AND?: InputMaybe<Array<InputMaybe<EModeFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<EModeFilter>>>;
  categoryId?: InputMaybe<Scalars['String']['input']>;
  categoryId_contains?: InputMaybe<Scalars['String']['input']>;
  categoryId_ends_with?: InputMaybe<Scalars['String']['input']>;
  categoryId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  categoryId_not?: InputMaybe<Scalars['String']['input']>;
  categoryId_not_contains?: InputMaybe<Scalars['String']['input']>;
  categoryId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  categoryId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  categoryId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  categoryId_starts_with?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  collateralFactor?: InputMaybe<Scalars['BigInt']['input']>;
  collateralFactor_gt?: InputMaybe<Scalars['BigInt']['input']>;
  collateralFactor_gte?: InputMaybe<Scalars['BigInt']['input']>;
  collateralFactor_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  collateralFactor_lt?: InputMaybe<Scalars['BigInt']['input']>;
  collateralFactor_lte?: InputMaybe<Scalars['BigInt']['input']>;
  collateralFactor_not?: InputMaybe<Scalars['BigInt']['input']>;
  collateralFactor_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  liquidationIncentive?: InputMaybe<Scalars['BigInt']['input']>;
  liquidationIncentive_gt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidationIncentive_gte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidationIncentive_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  liquidationIncentive_lt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidationIncentive_lte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidationIncentive_not?: InputMaybe<Scalars['BigInt']['input']>;
  liquidationIncentive_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  liquidationThreshold?: InputMaybe<Scalars['BigInt']['input']>;
  liquidationThreshold_gt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidationThreshold_gte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidationThreshold_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  liquidationThreshold_lt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidationThreshold_lte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidationThreshold_not?: InputMaybe<Scalars['BigInt']['input']>;
  liquidationThreshold_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  protocolId?: InputMaybe<Scalars['String']['input']>;
  protocolId_contains?: InputMaybe<Scalars['String']['input']>;
  protocolId_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocolId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  protocolId_not?: InputMaybe<Scalars['String']['input']>;
  protocolId_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocolId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocolId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  protocolId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocolId_starts_with?: InputMaybe<Scalars['String']['input']>;
};

/** Paginated list of efficiency mode configuration of one protocol records */
export type EModePage = {
  __typename?: 'eModePage';
  /** List of efficiency mode configuration of one protocol records */
  items: Array<EMode>;
  /** Information about pagination in a connection */
  pageInfo: PageInfo;
  /** Total number of records matching the query */
  totalCount: Scalars['Int']['output'];
};

/** Get a single liquidation transaction information by address */
export type LiquidateBorrow = {
  __typename?: 'liquidateBorrow';
  borrowPToken?: Maybe<PToken>;
  /** Borrowed token identifier (exact match) */
  borrowPTokenId: Scalars['String']['output'];
  borrower?: Maybe<User>;
  /** Borrower's identifier (exact match) */
  borrowerId: Scalars['String']['output'];
  /** The blockchain network identifier (exact match) */
  chainId: Scalars['BigInt']['output'];
  collateralPToken?: Maybe<PToken>;
  /** Collateral token identifier (exact match) */
  collateralPTokenId: Scalars['String']['output'];
  /** Unique identifier for the liquidation composed by <transactionHash>-<logIndex> (exact match) */
  id: Scalars['String']['output'];
  liquidator?: Maybe<User>;
  /** Liquidator's identifier (exact match) */
  liquidatorId: Scalars['String']['output'];
  /** Amount of assets repaid (underlying) (exact match) */
  repayAssets: Scalars['BigInt']['output'];
  /** USD value of the repayment (exact match) */
  repayUsdValue: Scalars['String']['output'];
  /** Amount of collateral seized (pTokens) (exact match) */
  seizeShares: Scalars['BigInt']['output'];
  /** USD value of the seized collateral (exact match) */
  seizeUsdValue: Scalars['String']['output'];
  transaction?: Maybe<Transaction>;
  /** Associated transaction identifier (exact match) */
  transactionId: Scalars['String']['output'];
};

export type LiquidateBorrowFilter = {
  AND?: InputMaybe<Array<InputMaybe<LiquidateBorrowFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<LiquidateBorrowFilter>>>;
  borrowPTokenId?: InputMaybe<Scalars['String']['input']>;
  borrowPTokenId_contains?: InputMaybe<Scalars['String']['input']>;
  borrowPTokenId_ends_with?: InputMaybe<Scalars['String']['input']>;
  borrowPTokenId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  borrowPTokenId_not?: InputMaybe<Scalars['String']['input']>;
  borrowPTokenId_not_contains?: InputMaybe<Scalars['String']['input']>;
  borrowPTokenId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  borrowPTokenId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  borrowPTokenId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  borrowPTokenId_starts_with?: InputMaybe<Scalars['String']['input']>;
  borrowerId?: InputMaybe<Scalars['String']['input']>;
  borrowerId_contains?: InputMaybe<Scalars['String']['input']>;
  borrowerId_ends_with?: InputMaybe<Scalars['String']['input']>;
  borrowerId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  borrowerId_not?: InputMaybe<Scalars['String']['input']>;
  borrowerId_not_contains?: InputMaybe<Scalars['String']['input']>;
  borrowerId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  borrowerId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  borrowerId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  borrowerId_starts_with?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  collateralPTokenId?: InputMaybe<Scalars['String']['input']>;
  collateralPTokenId_contains?: InputMaybe<Scalars['String']['input']>;
  collateralPTokenId_ends_with?: InputMaybe<Scalars['String']['input']>;
  collateralPTokenId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  collateralPTokenId_not?: InputMaybe<Scalars['String']['input']>;
  collateralPTokenId_not_contains?: InputMaybe<Scalars['String']['input']>;
  collateralPTokenId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  collateralPTokenId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  collateralPTokenId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  collateralPTokenId_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  liquidatorId?: InputMaybe<Scalars['String']['input']>;
  liquidatorId_contains?: InputMaybe<Scalars['String']['input']>;
  liquidatorId_ends_with?: InputMaybe<Scalars['String']['input']>;
  liquidatorId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  liquidatorId_not?: InputMaybe<Scalars['String']['input']>;
  liquidatorId_not_contains?: InputMaybe<Scalars['String']['input']>;
  liquidatorId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  liquidatorId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  liquidatorId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  liquidatorId_starts_with?: InputMaybe<Scalars['String']['input']>;
  repayAssets?: InputMaybe<Scalars['BigInt']['input']>;
  repayAssets_gt?: InputMaybe<Scalars['BigInt']['input']>;
  repayAssets_gte?: InputMaybe<Scalars['BigInt']['input']>;
  repayAssets_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  repayAssets_lt?: InputMaybe<Scalars['BigInt']['input']>;
  repayAssets_lte?: InputMaybe<Scalars['BigInt']['input']>;
  repayAssets_not?: InputMaybe<Scalars['BigInt']['input']>;
  repayAssets_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  repayUsdValue?: InputMaybe<Scalars['String']['input']>;
  repayUsdValue_contains?: InputMaybe<Scalars['String']['input']>;
  repayUsdValue_ends_with?: InputMaybe<Scalars['String']['input']>;
  repayUsdValue_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  repayUsdValue_not?: InputMaybe<Scalars['String']['input']>;
  repayUsdValue_not_contains?: InputMaybe<Scalars['String']['input']>;
  repayUsdValue_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  repayUsdValue_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  repayUsdValue_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  repayUsdValue_starts_with?: InputMaybe<Scalars['String']['input']>;
  seizeShares?: InputMaybe<Scalars['BigInt']['input']>;
  seizeShares_gt?: InputMaybe<Scalars['BigInt']['input']>;
  seizeShares_gte?: InputMaybe<Scalars['BigInt']['input']>;
  seizeShares_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  seizeShares_lt?: InputMaybe<Scalars['BigInt']['input']>;
  seizeShares_lte?: InputMaybe<Scalars['BigInt']['input']>;
  seizeShares_not?: InputMaybe<Scalars['BigInt']['input']>;
  seizeShares_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  seizeUsdValue?: InputMaybe<Scalars['String']['input']>;
  seizeUsdValue_contains?: InputMaybe<Scalars['String']['input']>;
  seizeUsdValue_ends_with?: InputMaybe<Scalars['String']['input']>;
  seizeUsdValue_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  seizeUsdValue_not?: InputMaybe<Scalars['String']['input']>;
  seizeUsdValue_not_contains?: InputMaybe<Scalars['String']['input']>;
  seizeUsdValue_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  seizeUsdValue_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  seizeUsdValue_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  seizeUsdValue_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
  transactionId_contains?: InputMaybe<Scalars['String']['input']>;
  transactionId_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionId_not?: InputMaybe<Scalars['String']['input']>;
  transactionId_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionId_starts_with?: InputMaybe<Scalars['String']['input']>;
};

/** Paginated list of liquidation transaction information records */
export type LiquidateBorrowPage = {
  __typename?: 'liquidateBorrowPage';
  /** List of liquidation transaction information records */
  items: Array<LiquidateBorrow>;
  /** Information about pagination in a connection */
  pageInfo: PageInfo;
  /** Total number of records matching the query */
  totalCount: Scalars['Int']['output'];
};

/** Get a single market entry events by address */
export type MarketEntered = {
  __typename?: 'marketEntered';
  /** The blockchain network identifier (exact match) */
  chainId: Scalars['BigInt']['output'];
  /** Unique identifier for the market entry composed by <transactionHash>-<logIndex> (exact match) */
  id: Scalars['String']['output'];
  pToken?: Maybe<PToken>;
  /** Pike token (pToken) identifier (exact match) */
  pTokenId: Scalars['String']['output'];
  transaction?: Maybe<Transaction>;
  /** Associated transaction identifier (exact match) */
  transactionId: Scalars['String']['output'];
  user?: Maybe<User>;
  /** User identifier who entered the market (exact match) */
  userId: Scalars['String']['output'];
};

export type MarketEnteredFilter = {
  AND?: InputMaybe<Array<InputMaybe<MarketEnteredFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<MarketEnteredFilter>>>;
  chainId?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId?: InputMaybe<Scalars['String']['input']>;
  pTokenId_contains?: InputMaybe<Scalars['String']['input']>;
  pTokenId_ends_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  pTokenId_not?: InputMaybe<Scalars['String']['input']>;
  pTokenId_not_contains?: InputMaybe<Scalars['String']['input']>;
  pTokenId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  pTokenId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
  transactionId_contains?: InputMaybe<Scalars['String']['input']>;
  transactionId_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionId_not?: InputMaybe<Scalars['String']['input']>;
  transactionId_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionId_starts_with?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
  userId_contains?: InputMaybe<Scalars['String']['input']>;
  userId_ends_with?: InputMaybe<Scalars['String']['input']>;
  userId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  userId_not?: InputMaybe<Scalars['String']['input']>;
  userId_not_contains?: InputMaybe<Scalars['String']['input']>;
  userId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  userId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  userId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  userId_starts_with?: InputMaybe<Scalars['String']['input']>;
};

/** Paginated list of market entry events records */
export type MarketEnteredPage = {
  __typename?: 'marketEnteredPage';
  /** List of market entry events records */
  items: Array<MarketEntered>;
  /** Information about pagination in a connection */
  pageInfo: PageInfo;
  /** Total number of records matching the query */
  totalCount: Scalars['Int']['output'];
};

/** Get a single market exit events by address */
export type MarketExited = {
  __typename?: 'marketExited';
  /** The blockchain network identifier (exact match) */
  chainId: Scalars['BigInt']['output'];
  /** Unique identifier for the market exit composed by <transactionHash>-<logIndex> (exact match) */
  id: Scalars['String']['output'];
  pToken?: Maybe<PToken>;
  /** Pike token (pToken) identifier (exact match) */
  pTokenId: Scalars['String']['output'];
  transaction?: Maybe<Transaction>;
  /** Associated transaction identifier (exact match) */
  transactionId: Scalars['String']['output'];
  user?: Maybe<User>;
  /** User identifier who exited the market (exact match) */
  userId: Scalars['String']['output'];
};

export type MarketExitedFilter = {
  AND?: InputMaybe<Array<InputMaybe<MarketExitedFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<MarketExitedFilter>>>;
  chainId?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId?: InputMaybe<Scalars['String']['input']>;
  pTokenId_contains?: InputMaybe<Scalars['String']['input']>;
  pTokenId_ends_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  pTokenId_not?: InputMaybe<Scalars['String']['input']>;
  pTokenId_not_contains?: InputMaybe<Scalars['String']['input']>;
  pTokenId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  pTokenId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
  transactionId_contains?: InputMaybe<Scalars['String']['input']>;
  transactionId_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionId_not?: InputMaybe<Scalars['String']['input']>;
  transactionId_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionId_starts_with?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
  userId_contains?: InputMaybe<Scalars['String']['input']>;
  userId_ends_with?: InputMaybe<Scalars['String']['input']>;
  userId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  userId_not?: InputMaybe<Scalars['String']['input']>;
  userId_not_contains?: InputMaybe<Scalars['String']['input']>;
  userId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  userId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  userId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  userId_starts_with?: InputMaybe<Scalars['String']['input']>;
};

/** Paginated list of market exit events records */
export type MarketExitedPage = {
  __typename?: 'marketExitedPage';
  /** List of market exit events records */
  items: Array<MarketExited>;
  /** Information about pagination in a connection */
  pageInfo: PageInfo;
  /** Total number of records matching the query */
  totalCount: Scalars['Int']['output'];
};

/** Get a single pike token market information and state by address */
export type PToken = {
  __typename?: 'pToken';
  actionsPaused?: Maybe<ActionPausedPage>;
  /** Contract address of the token (exact match) */
  address: Scalars['String']['output'];
  aprSnapshots?: Maybe<PriceSnapshotPage>;
  /** Base interest rate per second (exact match) */
  baseRatePerSecond: Scalars['BigInt']['output'];
  /** Maximum amount that can be borrowed (exact match) */
  borrowCap: Scalars['BigInt']['output'];
  /** Latest interest accumulation index for borrows saved (exact match) */
  borrowIndex: Scalars['BigInt']['output'];
  borrowLiquidations?: Maybe<LiquidateBorrowPage>;
  /** Annual borrowing interest rate, derived from per-second rate (exact match) */
  borrowRateAPY: Scalars['String']['output'];
  /** Per-second borrowing rate dependent of the rate model (exact match) */
  borrowRatePerSecond: Scalars['BigInt']['output'];
  borrows?: Maybe<BorrowPage>;
  /** Current amount of underlying asset (exact match) */
  cash: Scalars['BigInt']['output'];
  chainId: Scalars['BigInt']['output'];
  /** How close the account must be to liquidation (exact match) */
  closeFactor: Scalars['BigInt']['output'];
  /**  Multiplier representing the most one can borrow against their collateral in this market. For instance, 0.9 to allow borrowing 90% of collateral value. Can be override by the e-mode. (exact match) */
  collateralFactor: Scalars['BigInt']['output'];
  collateralLiquidations?: Maybe<LiquidateBorrowPage>;
  creationTransaction?: Maybe<Transaction>;
  creationTransactionId: Scalars['String']['output'];
  /** Number of decimal places (exact match) */
  decimals: Scalars['String']['output'];
  deposits?: Maybe<DepositPage>;
  eModes?: Maybe<PTokenEModePage>;
  /** The latest stored exchange rate to underlying (exact match) */
  exchangeRateStored: Scalars['BigInt']['output'];
  /** First jump rate multiplier (exact match) */
  firstJumpMultiplierPerSecond: Scalars['BigInt']['output'];
  /** Utilization point of first rate jump (exact match) */
  firstKink: Scalars['BigInt']['output'];
  /** Latest price of underlying asset in numeric format (exact match) */
  formattedUnderlyingPriceCurrent: Scalars['String']['output'];
  /** Unique identifier for the protocol token composed by <pTokenAddress>-<chainId> (exact match) */
  id: Scalars['String']['output'];
  index?: Maybe<Scalars['BigInt']['output']>;
  isBorrowPaused: Scalars['Boolean']['output'];
  isMintPaused: Scalars['Boolean']['output'];
  isSeizePaused: Scalars['Boolean']['output'];
  isTransferPaused: Scalars['Boolean']['output'];
  /** Multiplier representing the discount on collateral that a liquidator receives. Can be override by the e-mode. (exact match) */
  liquidationIncentive: Scalars['BigInt']['output'];
  /** Multiplier representing the collateralization after which the borrow is eligible for liquidation. For instance, 0.8 liquidate when the borrow is 80% of collateral value. This can be override by the e-mode. (exact match) */
  liquidationThreshold: Scalars['BigInt']['output'];
  marketsEntered?: Maybe<MarketEnteredPage>;
  marketsExited?: Maybe<MarketExitedPage>;
  /** Interest rate multiplier per second (exact match) */
  multiplierPerSecond: Scalars['BigInt']['output'];
  /** Token name (exact match) */
  name: Scalars['String']['output'];
  priceSnapshots?: Maybe<PriceSnapshotPage>;
  protocol?: Maybe<Protocol>;
  protocolId: Scalars['String']['output'];
  /** Protocol's share of liquidation proceeds (exact match) */
  protocolSeizeShare: Scalars['BigInt']['output'];
  repayBorrows?: Maybe<RepayBorrowPage>;
  /** Reserve factor percentage (exact match) */
  reserveFactor: Scalars['BigInt']['output'];
  /** Second jump rate multiplier (exact match) */
  secondJumpMultiplierPerSecond: Scalars['BigInt']['output'];
  /** Utilization point of second rate jump (exact match) */
  secondKink: Scalars['BigInt']['output'];
  /** Maximum amount that can be supplied (exact match) */
  supplyCap: Scalars['BigInt']['output'];
  /** Annual supply interest rate, derived from per-second rate (exact match) */
  supplyRateAPY: Scalars['String']['output'];
  /** Per-second supply rate dependent of the rate model (exact match) */
  supplyRatePerSecond: Scalars['BigInt']['output'];
  /** Token symbol (exact match) */
  symbol: Scalars['String']['output'];
  /** Total USD value of borrows (exact match) */
  totalBorrowUsdValue: Scalars['String']['output'];
  /** Total amount borrowed of the underlying asset (exact match) */
  totalBorrows: Scalars['BigInt']['output'];
  /** Total reserves of underlying asset (exact match) */
  totalReserves: Scalars['BigInt']['output'];
  /** Total supply of pTokens (exact match) */
  totalSupply: Scalars['BigInt']['output'];
  /** Total USD value of supply (exact match) */
  totalSupplyUsdValue: Scalars['String']['output'];
  transfers?: Maybe<TransferPage>;
  underlyingId: Scalars['String']['output'];
  /** Latest price of underlying asset using the protocol oracle engine. This is periodically updated. The price is a bigint that if fixed point multiplied by the underlying token balance gives the USD value with 18 decimals. In instance, if the underlying token has 18 decimals the price is also in 18 decimals, if the underlying token has 6 decimals the price is in 30 decimals. (exact match) */
  underlyingPriceCurrent: Scalars['BigInt']['output'];
  underlyingToken?: Maybe<UnderlyingToken>;
  updatedAt: Scalars['BigInt']['output'];
  userBalances?: Maybe<UserBalancePage>;
  /** Current utilization rate between borrow and supply (exact match) */
  utilization: Scalars['BigInt']['output'];
  withdraws?: Maybe<WithdrawPage>;
};


/** Get a single pike token market information and state by address */
export type PTokenActionsPausedArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<ActionPausedFilter>;
};


/** Get a single pike token market information and state by address */
export type PTokenAprSnapshotsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<PriceSnapshotFilter>;
};


/** Get a single pike token market information and state by address */
export type PTokenBorrowLiquidationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<LiquidateBorrowFilter>;
};


/** Get a single pike token market information and state by address */
export type PTokenBorrowsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<BorrowFilter>;
};


/** Get a single pike token market information and state by address */
export type PTokenCollateralLiquidationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<LiquidateBorrowFilter>;
};


/** Get a single pike token market information and state by address */
export type PTokenDepositsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<DepositFilter>;
};


/** Get a single pike token market information and state by address */
export type PTokenEModesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<PTokenEModeFilter>;
};


/** Get a single pike token market information and state by address */
export type PTokenMarketsEnteredArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<MarketEnteredFilter>;
};


/** Get a single pike token market information and state by address */
export type PTokenMarketsExitedArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<MarketExitedFilter>;
};


/** Get a single pike token market information and state by address */
export type PTokenPriceSnapshotsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<PriceSnapshotFilter>;
};


/** Get a single pike token market information and state by address */
export type PTokenRepayBorrowsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<RepayBorrowFilter>;
};


/** Get a single pike token market information and state by address */
export type PTokenTransfersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<TransferFilter>;
};


/** Get a single pike token market information and state by address */
export type PTokenUserBalancesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<UserBalanceFilter>;
};


/** Get a single pike token market information and state by address */
export type PTokenWithdrawsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<WithdrawFilter>;
};

/** Get a single protocol token e-mode settings by address */
export type PTokenEMode = {
  __typename?: 'pTokenEMode';
  /** Whether borrowing is enabled in this e-mode (exact match) */
  borrowEnabled: Scalars['Boolean']['output'];
  /** The blockchain network identifier (exact match) */
  chainId: Scalars['BigInt']['output'];
  /** Whether collateral usage is enabled in this e-mode (exact match) */
  collateralEnabled: Scalars['Boolean']['output'];
  eMode?: Maybe<EMode>;
  /** E-mode identifier (exact match) */
  eModeId: Scalars['String']['output'];
  /** Unique identifier for the token e-mode composed by <pTokenAddress>-<protocolRiskEngineAddress>-<eModeCategoryId>-<chainId> (exact match) */
  id: Scalars['String']['output'];
  pToken?: Maybe<PToken>;
  /** Pike token (pToken) identifier (exact match) */
  pTokenId: Scalars['String']['output'];
};

export type PTokenEModeFilter = {
  AND?: InputMaybe<Array<InputMaybe<PTokenEModeFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<PTokenEModeFilter>>>;
  borrowEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  borrowEnabled_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  borrowEnabled_not?: InputMaybe<Scalars['Boolean']['input']>;
  borrowEnabled_not_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  chainId?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  collateralEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  collateralEnabled_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  collateralEnabled_not?: InputMaybe<Scalars['Boolean']['input']>;
  collateralEnabled_not_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  eModeId?: InputMaybe<Scalars['String']['input']>;
  eModeId_contains?: InputMaybe<Scalars['String']['input']>;
  eModeId_ends_with?: InputMaybe<Scalars['String']['input']>;
  eModeId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  eModeId_not?: InputMaybe<Scalars['String']['input']>;
  eModeId_not_contains?: InputMaybe<Scalars['String']['input']>;
  eModeId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  eModeId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  eModeId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  eModeId_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId?: InputMaybe<Scalars['String']['input']>;
  pTokenId_contains?: InputMaybe<Scalars['String']['input']>;
  pTokenId_ends_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  pTokenId_not?: InputMaybe<Scalars['String']['input']>;
  pTokenId_not_contains?: InputMaybe<Scalars['String']['input']>;
  pTokenId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  pTokenId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId_starts_with?: InputMaybe<Scalars['String']['input']>;
};

/** Paginated list of protocol token e-mode settings records */
export type PTokenEModePage = {
  __typename?: 'pTokenEModePage';
  /** List of protocol token e-mode settings records */
  items: Array<PTokenEMode>;
  /** Information about pagination in a connection */
  pageInfo: PageInfo;
  /** Total number of records matching the query */
  totalCount: Scalars['Int']['output'];
};

export type PTokenFilter = {
  AND?: InputMaybe<Array<InputMaybe<PTokenFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<PTokenFilter>>>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
  baseRatePerSecond?: InputMaybe<Scalars['BigInt']['input']>;
  baseRatePerSecond_gt?: InputMaybe<Scalars['BigInt']['input']>;
  baseRatePerSecond_gte?: InputMaybe<Scalars['BigInt']['input']>;
  baseRatePerSecond_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  baseRatePerSecond_lt?: InputMaybe<Scalars['BigInt']['input']>;
  baseRatePerSecond_lte?: InputMaybe<Scalars['BigInt']['input']>;
  baseRatePerSecond_not?: InputMaybe<Scalars['BigInt']['input']>;
  baseRatePerSecond_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  borrowCap?: InputMaybe<Scalars['BigInt']['input']>;
  borrowCap_gt?: InputMaybe<Scalars['BigInt']['input']>;
  borrowCap_gte?: InputMaybe<Scalars['BigInt']['input']>;
  borrowCap_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  borrowCap_lt?: InputMaybe<Scalars['BigInt']['input']>;
  borrowCap_lte?: InputMaybe<Scalars['BigInt']['input']>;
  borrowCap_not?: InputMaybe<Scalars['BigInt']['input']>;
  borrowCap_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  borrowIndex?: InputMaybe<Scalars['BigInt']['input']>;
  borrowIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  borrowIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  borrowIndex_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  borrowIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  borrowIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  borrowIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  borrowIndex_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  borrowRateAPY?: InputMaybe<Scalars['String']['input']>;
  borrowRateAPY_contains?: InputMaybe<Scalars['String']['input']>;
  borrowRateAPY_ends_with?: InputMaybe<Scalars['String']['input']>;
  borrowRateAPY_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  borrowRateAPY_not?: InputMaybe<Scalars['String']['input']>;
  borrowRateAPY_not_contains?: InputMaybe<Scalars['String']['input']>;
  borrowRateAPY_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  borrowRateAPY_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  borrowRateAPY_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  borrowRateAPY_starts_with?: InputMaybe<Scalars['String']['input']>;
  borrowRatePerSecond?: InputMaybe<Scalars['BigInt']['input']>;
  borrowRatePerSecond_gt?: InputMaybe<Scalars['BigInt']['input']>;
  borrowRatePerSecond_gte?: InputMaybe<Scalars['BigInt']['input']>;
  borrowRatePerSecond_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  borrowRatePerSecond_lt?: InputMaybe<Scalars['BigInt']['input']>;
  borrowRatePerSecond_lte?: InputMaybe<Scalars['BigInt']['input']>;
  borrowRatePerSecond_not?: InputMaybe<Scalars['BigInt']['input']>;
  borrowRatePerSecond_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  cash?: InputMaybe<Scalars['BigInt']['input']>;
  cash_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cash_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cash_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  cash_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cash_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cash_not?: InputMaybe<Scalars['BigInt']['input']>;
  cash_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  chainId?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  closeFactor?: InputMaybe<Scalars['BigInt']['input']>;
  closeFactor_gt?: InputMaybe<Scalars['BigInt']['input']>;
  closeFactor_gte?: InputMaybe<Scalars['BigInt']['input']>;
  closeFactor_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  closeFactor_lt?: InputMaybe<Scalars['BigInt']['input']>;
  closeFactor_lte?: InputMaybe<Scalars['BigInt']['input']>;
  closeFactor_not?: InputMaybe<Scalars['BigInt']['input']>;
  closeFactor_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  collateralFactor?: InputMaybe<Scalars['BigInt']['input']>;
  collateralFactor_gt?: InputMaybe<Scalars['BigInt']['input']>;
  collateralFactor_gte?: InputMaybe<Scalars['BigInt']['input']>;
  collateralFactor_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  collateralFactor_lt?: InputMaybe<Scalars['BigInt']['input']>;
  collateralFactor_lte?: InputMaybe<Scalars['BigInt']['input']>;
  collateralFactor_not?: InputMaybe<Scalars['BigInt']['input']>;
  collateralFactor_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  creationTransactionId?: InputMaybe<Scalars['String']['input']>;
  creationTransactionId_contains?: InputMaybe<Scalars['String']['input']>;
  creationTransactionId_ends_with?: InputMaybe<Scalars['String']['input']>;
  creationTransactionId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  creationTransactionId_not?: InputMaybe<Scalars['String']['input']>;
  creationTransactionId_not_contains?: InputMaybe<Scalars['String']['input']>;
  creationTransactionId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  creationTransactionId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  creationTransactionId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  creationTransactionId_starts_with?: InputMaybe<Scalars['String']['input']>;
  decimals?: InputMaybe<Scalars['String']['input']>;
  decimals_contains?: InputMaybe<Scalars['String']['input']>;
  decimals_ends_with?: InputMaybe<Scalars['String']['input']>;
  decimals_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  decimals_not?: InputMaybe<Scalars['String']['input']>;
  decimals_not_contains?: InputMaybe<Scalars['String']['input']>;
  decimals_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  decimals_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  decimals_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  decimals_starts_with?: InputMaybe<Scalars['String']['input']>;
  exchangeRateStored?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRateStored_gt?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRateStored_gte?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRateStored_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  exchangeRateStored_lt?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRateStored_lte?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRateStored_not?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRateStored_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  firstJumpMultiplierPerSecond?: InputMaybe<Scalars['BigInt']['input']>;
  firstJumpMultiplierPerSecond_gt?: InputMaybe<Scalars['BigInt']['input']>;
  firstJumpMultiplierPerSecond_gte?: InputMaybe<Scalars['BigInt']['input']>;
  firstJumpMultiplierPerSecond_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  firstJumpMultiplierPerSecond_lt?: InputMaybe<Scalars['BigInt']['input']>;
  firstJumpMultiplierPerSecond_lte?: InputMaybe<Scalars['BigInt']['input']>;
  firstJumpMultiplierPerSecond_not?: InputMaybe<Scalars['BigInt']['input']>;
  firstJumpMultiplierPerSecond_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  firstKink?: InputMaybe<Scalars['BigInt']['input']>;
  firstKink_gt?: InputMaybe<Scalars['BigInt']['input']>;
  firstKink_gte?: InputMaybe<Scalars['BigInt']['input']>;
  firstKink_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  firstKink_lt?: InputMaybe<Scalars['BigInt']['input']>;
  firstKink_lte?: InputMaybe<Scalars['BigInt']['input']>;
  firstKink_not?: InputMaybe<Scalars['BigInt']['input']>;
  firstKink_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  formattedUnderlyingPriceCurrent?: InputMaybe<Scalars['String']['input']>;
  formattedUnderlyingPriceCurrent_contains?: InputMaybe<Scalars['String']['input']>;
  formattedUnderlyingPriceCurrent_ends_with?: InputMaybe<Scalars['String']['input']>;
  formattedUnderlyingPriceCurrent_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  formattedUnderlyingPriceCurrent_not?: InputMaybe<Scalars['String']['input']>;
  formattedUnderlyingPriceCurrent_not_contains?: InputMaybe<Scalars['String']['input']>;
  formattedUnderlyingPriceCurrent_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  formattedUnderlyingPriceCurrent_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  formattedUnderlyingPriceCurrent_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  formattedUnderlyingPriceCurrent_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  index?: InputMaybe<Scalars['BigInt']['input']>;
  index_gt?: InputMaybe<Scalars['BigInt']['input']>;
  index_gte?: InputMaybe<Scalars['BigInt']['input']>;
  index_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  index_lt?: InputMaybe<Scalars['BigInt']['input']>;
  index_lte?: InputMaybe<Scalars['BigInt']['input']>;
  index_not?: InputMaybe<Scalars['BigInt']['input']>;
  index_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  isBorrowPaused?: InputMaybe<Scalars['Boolean']['input']>;
  isBorrowPaused_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  isBorrowPaused_not?: InputMaybe<Scalars['Boolean']['input']>;
  isBorrowPaused_not_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  isMintPaused?: InputMaybe<Scalars['Boolean']['input']>;
  isMintPaused_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  isMintPaused_not?: InputMaybe<Scalars['Boolean']['input']>;
  isMintPaused_not_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  isSeizePaused?: InputMaybe<Scalars['Boolean']['input']>;
  isSeizePaused_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  isSeizePaused_not?: InputMaybe<Scalars['Boolean']['input']>;
  isSeizePaused_not_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  isTransferPaused?: InputMaybe<Scalars['Boolean']['input']>;
  isTransferPaused_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  isTransferPaused_not?: InputMaybe<Scalars['Boolean']['input']>;
  isTransferPaused_not_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  liquidationIncentive?: InputMaybe<Scalars['BigInt']['input']>;
  liquidationIncentive_gt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidationIncentive_gte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidationIncentive_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  liquidationIncentive_lt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidationIncentive_lte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidationIncentive_not?: InputMaybe<Scalars['BigInt']['input']>;
  liquidationIncentive_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  liquidationThreshold?: InputMaybe<Scalars['BigInt']['input']>;
  liquidationThreshold_gt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidationThreshold_gte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidationThreshold_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  liquidationThreshold_lt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidationThreshold_lte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidationThreshold_not?: InputMaybe<Scalars['BigInt']['input']>;
  liquidationThreshold_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  multiplierPerSecond?: InputMaybe<Scalars['BigInt']['input']>;
  multiplierPerSecond_gt?: InputMaybe<Scalars['BigInt']['input']>;
  multiplierPerSecond_gte?: InputMaybe<Scalars['BigInt']['input']>;
  multiplierPerSecond_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  multiplierPerSecond_lt?: InputMaybe<Scalars['BigInt']['input']>;
  multiplierPerSecond_lte?: InputMaybe<Scalars['BigInt']['input']>;
  multiplierPerSecond_not?: InputMaybe<Scalars['BigInt']['input']>;
  multiplierPerSecond_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocolId?: InputMaybe<Scalars['String']['input']>;
  protocolId_contains?: InputMaybe<Scalars['String']['input']>;
  protocolId_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocolId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  protocolId_not?: InputMaybe<Scalars['String']['input']>;
  protocolId_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocolId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocolId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  protocolId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocolId_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocolSeizeShare?: InputMaybe<Scalars['BigInt']['input']>;
  protocolSeizeShare_gt?: InputMaybe<Scalars['BigInt']['input']>;
  protocolSeizeShare_gte?: InputMaybe<Scalars['BigInt']['input']>;
  protocolSeizeShare_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  protocolSeizeShare_lt?: InputMaybe<Scalars['BigInt']['input']>;
  protocolSeizeShare_lte?: InputMaybe<Scalars['BigInt']['input']>;
  protocolSeizeShare_not?: InputMaybe<Scalars['BigInt']['input']>;
  protocolSeizeShare_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  reserveFactor?: InputMaybe<Scalars['BigInt']['input']>;
  reserveFactor_gt?: InputMaybe<Scalars['BigInt']['input']>;
  reserveFactor_gte?: InputMaybe<Scalars['BigInt']['input']>;
  reserveFactor_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  reserveFactor_lt?: InputMaybe<Scalars['BigInt']['input']>;
  reserveFactor_lte?: InputMaybe<Scalars['BigInt']['input']>;
  reserveFactor_not?: InputMaybe<Scalars['BigInt']['input']>;
  reserveFactor_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  secondJumpMultiplierPerSecond?: InputMaybe<Scalars['BigInt']['input']>;
  secondJumpMultiplierPerSecond_gt?: InputMaybe<Scalars['BigInt']['input']>;
  secondJumpMultiplierPerSecond_gte?: InputMaybe<Scalars['BigInt']['input']>;
  secondJumpMultiplierPerSecond_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  secondJumpMultiplierPerSecond_lt?: InputMaybe<Scalars['BigInt']['input']>;
  secondJumpMultiplierPerSecond_lte?: InputMaybe<Scalars['BigInt']['input']>;
  secondJumpMultiplierPerSecond_not?: InputMaybe<Scalars['BigInt']['input']>;
  secondJumpMultiplierPerSecond_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  secondKink?: InputMaybe<Scalars['BigInt']['input']>;
  secondKink_gt?: InputMaybe<Scalars['BigInt']['input']>;
  secondKink_gte?: InputMaybe<Scalars['BigInt']['input']>;
  secondKink_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  secondKink_lt?: InputMaybe<Scalars['BigInt']['input']>;
  secondKink_lte?: InputMaybe<Scalars['BigInt']['input']>;
  secondKink_not?: InputMaybe<Scalars['BigInt']['input']>;
  secondKink_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  supplyCap?: InputMaybe<Scalars['BigInt']['input']>;
  supplyCap_gt?: InputMaybe<Scalars['BigInt']['input']>;
  supplyCap_gte?: InputMaybe<Scalars['BigInt']['input']>;
  supplyCap_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  supplyCap_lt?: InputMaybe<Scalars['BigInt']['input']>;
  supplyCap_lte?: InputMaybe<Scalars['BigInt']['input']>;
  supplyCap_not?: InputMaybe<Scalars['BigInt']['input']>;
  supplyCap_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  supplyRateAPY?: InputMaybe<Scalars['String']['input']>;
  supplyRateAPY_contains?: InputMaybe<Scalars['String']['input']>;
  supplyRateAPY_ends_with?: InputMaybe<Scalars['String']['input']>;
  supplyRateAPY_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  supplyRateAPY_not?: InputMaybe<Scalars['String']['input']>;
  supplyRateAPY_not_contains?: InputMaybe<Scalars['String']['input']>;
  supplyRateAPY_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  supplyRateAPY_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  supplyRateAPY_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  supplyRateAPY_starts_with?: InputMaybe<Scalars['String']['input']>;
  supplyRatePerSecond?: InputMaybe<Scalars['BigInt']['input']>;
  supplyRatePerSecond_gt?: InputMaybe<Scalars['BigInt']['input']>;
  supplyRatePerSecond_gte?: InputMaybe<Scalars['BigInt']['input']>;
  supplyRatePerSecond_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  supplyRatePerSecond_lt?: InputMaybe<Scalars['BigInt']['input']>;
  supplyRatePerSecond_lte?: InputMaybe<Scalars['BigInt']['input']>;
  supplyRatePerSecond_not?: InputMaybe<Scalars['BigInt']['input']>;
  supplyRatePerSecond_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  symbol?: InputMaybe<Scalars['String']['input']>;
  symbol_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  symbol_not?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with?: InputMaybe<Scalars['String']['input']>;
  totalBorrowUsdValue?: InputMaybe<Scalars['String']['input']>;
  totalBorrowUsdValue_contains?: InputMaybe<Scalars['String']['input']>;
  totalBorrowUsdValue_ends_with?: InputMaybe<Scalars['String']['input']>;
  totalBorrowUsdValue_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  totalBorrowUsdValue_not?: InputMaybe<Scalars['String']['input']>;
  totalBorrowUsdValue_not_contains?: InputMaybe<Scalars['String']['input']>;
  totalBorrowUsdValue_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  totalBorrowUsdValue_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  totalBorrowUsdValue_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  totalBorrowUsdValue_starts_with?: InputMaybe<Scalars['String']['input']>;
  totalBorrows?: InputMaybe<Scalars['BigInt']['input']>;
  totalBorrows_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalBorrows_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalBorrows_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  totalBorrows_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalBorrows_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalBorrows_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalBorrows_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  totalReserves?: InputMaybe<Scalars['BigInt']['input']>;
  totalReserves_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalReserves_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalReserves_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  totalReserves_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalReserves_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalReserves_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalReserves_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  totalSupply?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupplyUsdValue?: InputMaybe<Scalars['String']['input']>;
  totalSupplyUsdValue_contains?: InputMaybe<Scalars['String']['input']>;
  totalSupplyUsdValue_ends_with?: InputMaybe<Scalars['String']['input']>;
  totalSupplyUsdValue_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  totalSupplyUsdValue_not?: InputMaybe<Scalars['String']['input']>;
  totalSupplyUsdValue_not_contains?: InputMaybe<Scalars['String']['input']>;
  totalSupplyUsdValue_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  totalSupplyUsdValue_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  totalSupplyUsdValue_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  totalSupplyUsdValue_starts_with?: InputMaybe<Scalars['String']['input']>;
  totalSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  totalSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  underlyingId?: InputMaybe<Scalars['String']['input']>;
  underlyingId_contains?: InputMaybe<Scalars['String']['input']>;
  underlyingId_ends_with?: InputMaybe<Scalars['String']['input']>;
  underlyingId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  underlyingId_not?: InputMaybe<Scalars['String']['input']>;
  underlyingId_not_contains?: InputMaybe<Scalars['String']['input']>;
  underlyingId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  underlyingId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  underlyingId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  underlyingId_starts_with?: InputMaybe<Scalars['String']['input']>;
  underlyingPriceCurrent?: InputMaybe<Scalars['BigInt']['input']>;
  underlyingPriceCurrent_gt?: InputMaybe<Scalars['BigInt']['input']>;
  underlyingPriceCurrent_gte?: InputMaybe<Scalars['BigInt']['input']>;
  underlyingPriceCurrent_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  underlyingPriceCurrent_lt?: InputMaybe<Scalars['BigInt']['input']>;
  underlyingPriceCurrent_lte?: InputMaybe<Scalars['BigInt']['input']>;
  underlyingPriceCurrent_not?: InputMaybe<Scalars['BigInt']['input']>;
  underlyingPriceCurrent_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  utilization?: InputMaybe<Scalars['BigInt']['input']>;
  utilization_gt?: InputMaybe<Scalars['BigInt']['input']>;
  utilization_gte?: InputMaybe<Scalars['BigInt']['input']>;
  utilization_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  utilization_lt?: InputMaybe<Scalars['BigInt']['input']>;
  utilization_lte?: InputMaybe<Scalars['BigInt']['input']>;
  utilization_not?: InputMaybe<Scalars['BigInt']['input']>;
  utilization_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
};

/** Paginated list of pike token market information and state records */
export type PTokenPage = {
  __typename?: 'pTokenPage';
  /** List of pike token market information and state records */
  items: Array<PToken>;
  /** Information about pagination in a connection */
  pageInfo: PageInfo;
  /** Total number of records matching the query */
  totalCount: Scalars['Int']['output'];
};

/** Get a single price history information by address */
export type PriceSnapshot = {
  __typename?: 'priceSnapshot';
  /** The blockchain network identifier (exact match) */
  chainId: Scalars['BigInt']['output'];
  /** The recorded price value in numeric format (exact match) */
  formattedPrice: Scalars['String']['output'];
  /** Unique identifier for the price snapshot composed by <pTokenAddress>-<chainId>-<blockNumber> (exact match) */
  id: Scalars['String']['output'];
  pToken?: Maybe<PToken>;
  /** Pike token (pToken) identifier (exact match) */
  pTokenId: Scalars['String']['output'];
  /** The recorded price value. The price is a bigint that if fixed point multiplied by the underlying token balance gives the USD value with 18 decimals. This meas that the price has 36 - D, where D is the token decimals. In instance, if the underlying token has 18 decimals the price is also in 18 decimals, if the underlying token has 6 decimals the price is in 30 decimals. (exact match) */
  price: Scalars['BigInt']['output'];
  /** When the price was recorded (exact match) */
  timestamp: Scalars['BigInt']['output'];
};

export type PriceSnapshotFilter = {
  AND?: InputMaybe<Array<InputMaybe<PriceSnapshotFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<PriceSnapshotFilter>>>;
  chainId?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  formattedPrice?: InputMaybe<Scalars['String']['input']>;
  formattedPrice_contains?: InputMaybe<Scalars['String']['input']>;
  formattedPrice_ends_with?: InputMaybe<Scalars['String']['input']>;
  formattedPrice_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  formattedPrice_not?: InputMaybe<Scalars['String']['input']>;
  formattedPrice_not_contains?: InputMaybe<Scalars['String']['input']>;
  formattedPrice_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  formattedPrice_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  formattedPrice_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  formattedPrice_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId?: InputMaybe<Scalars['String']['input']>;
  pTokenId_contains?: InputMaybe<Scalars['String']['input']>;
  pTokenId_ends_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  pTokenId_not?: InputMaybe<Scalars['String']['input']>;
  pTokenId_not_contains?: InputMaybe<Scalars['String']['input']>;
  pTokenId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  pTokenId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId_starts_with?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['BigInt']['input']>;
  price_gt?: InputMaybe<Scalars['BigInt']['input']>;
  price_gte?: InputMaybe<Scalars['BigInt']['input']>;
  price_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  price_lt?: InputMaybe<Scalars['BigInt']['input']>;
  price_lte?: InputMaybe<Scalars['BigInt']['input']>;
  price_not?: InputMaybe<Scalars['BigInt']['input']>;
  price_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
};

/** Paginated list of price history information records */
export type PriceSnapshotPage = {
  __typename?: 'priceSnapshotPage';
  /** List of price history information records */
  items: Array<PriceSnapshot>;
  /** Information about pagination in a connection */
  pageInfo: PageInfo;
  /** Total number of records matching the query */
  totalCount: Scalars['Int']['output'];
};

/** Get a single core protocol configuration and state by address */
export type Protocol = {
  __typename?: 'protocol';
  actionsPaused?: Maybe<ActionPausedPage>;
  /** The blockchain network identifier (exact match) */
  chainId: Scalars['BigInt']['output'];
  /** Share allocated to protocol configurator with 18 decimals (exact match) */
  configuratorShare: Scalars['BigInt']['output'];
  creationTransaction?: Maybe<Transaction>;
  creationTransactionId: Scalars['String']['output'];
  delegates?: Maybe<UserDelegationPage>;
  delegatesUpdated?: Maybe<DelegateUpdatedPage>;
  eModes?: Maybe<EModePage>;
  /** Unique identifier for the protocol composed by <riskEngineAddress>-<chainId> (exact match) */
  id: Scalars['String']['output'];
  initOracleEngineBeaconProxy: Scalars['String']['output'];
  /** Address of the initial protocol governor (exact match) */
  initialGovernor: Scalars['String']['output'];
  /** Indicates if borrowing is paused (exact match) */
  isBorrowPaused: Scalars['Boolean']['output'];
  /** Indicates if minting is paused (exact match) */
  isMintPaused: Scalars['Boolean']['output'];
  /** Indicates if seizing collateral is paused (exact match) */
  isSeizePaused: Scalars['Boolean']['output'];
  /** Indicates if transfers are paused (exact match) */
  isTransferPaused: Scalars['Boolean']['output'];
  /** Address of the price oracle engine contract (exact match) */
  oracle: Scalars['String']['output'];
  /** Share allocated to protocol owner with 18 decimals (exact match) */
  ownerShare: Scalars['BigInt']['output'];
  pTokenBeaconProxy: Scalars['String']['output'];
  pTokens?: Maybe<PTokenPage>;
  /** Protocol-specific identifier on the factory address (exact match) */
  protocolId: Scalars['BigInt']['output'];
  /** Address of the risk engine (exact match) */
  riskEngine: Scalars['String']['output'];
  riskEngineBeaconProxy: Scalars['String']['output'];
  /** Address of the timelock contract (exact match) */
  timelock: Scalars['String']['output'];
  timelockBeaconProxy: Scalars['String']['output'];
};


/** Get a single core protocol configuration and state by address */
export type ProtocolActionsPausedArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<ActionPausedFilter>;
};


/** Get a single core protocol configuration and state by address */
export type ProtocolDelegatesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<UserDelegationFilter>;
};


/** Get a single core protocol configuration and state by address */
export type ProtocolDelegatesUpdatedArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<DelegateUpdatedFilter>;
};


/** Get a single core protocol configuration and state by address */
export type ProtocolEModesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<EModeFilter>;
};


/** Get a single core protocol configuration and state by address */
export type ProtocolPTokensArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<PTokenFilter>;
};

export type ProtocolFilter = {
  AND?: InputMaybe<Array<InputMaybe<ProtocolFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<ProtocolFilter>>>;
  chainId?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  configuratorShare?: InputMaybe<Scalars['BigInt']['input']>;
  configuratorShare_gt?: InputMaybe<Scalars['BigInt']['input']>;
  configuratorShare_gte?: InputMaybe<Scalars['BigInt']['input']>;
  configuratorShare_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  configuratorShare_lt?: InputMaybe<Scalars['BigInt']['input']>;
  configuratorShare_lte?: InputMaybe<Scalars['BigInt']['input']>;
  configuratorShare_not?: InputMaybe<Scalars['BigInt']['input']>;
  configuratorShare_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  creationTransactionId?: InputMaybe<Scalars['String']['input']>;
  creationTransactionId_contains?: InputMaybe<Scalars['String']['input']>;
  creationTransactionId_ends_with?: InputMaybe<Scalars['String']['input']>;
  creationTransactionId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  creationTransactionId_not?: InputMaybe<Scalars['String']['input']>;
  creationTransactionId_not_contains?: InputMaybe<Scalars['String']['input']>;
  creationTransactionId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  creationTransactionId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  creationTransactionId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  creationTransactionId_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  initOracleEngineBeaconProxy?: InputMaybe<Scalars['String']['input']>;
  initOracleEngineBeaconProxy_contains?: InputMaybe<Scalars['String']['input']>;
  initOracleEngineBeaconProxy_ends_with?: InputMaybe<Scalars['String']['input']>;
  initOracleEngineBeaconProxy_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  initOracleEngineBeaconProxy_not?: InputMaybe<Scalars['String']['input']>;
  initOracleEngineBeaconProxy_not_contains?: InputMaybe<Scalars['String']['input']>;
  initOracleEngineBeaconProxy_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  initOracleEngineBeaconProxy_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  initOracleEngineBeaconProxy_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  initOracleEngineBeaconProxy_starts_with?: InputMaybe<Scalars['String']['input']>;
  initialGovernor?: InputMaybe<Scalars['String']['input']>;
  initialGovernor_contains?: InputMaybe<Scalars['String']['input']>;
  initialGovernor_ends_with?: InputMaybe<Scalars['String']['input']>;
  initialGovernor_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  initialGovernor_not?: InputMaybe<Scalars['String']['input']>;
  initialGovernor_not_contains?: InputMaybe<Scalars['String']['input']>;
  initialGovernor_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  initialGovernor_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  initialGovernor_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  initialGovernor_starts_with?: InputMaybe<Scalars['String']['input']>;
  isBorrowPaused?: InputMaybe<Scalars['Boolean']['input']>;
  isBorrowPaused_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  isBorrowPaused_not?: InputMaybe<Scalars['Boolean']['input']>;
  isBorrowPaused_not_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  isMintPaused?: InputMaybe<Scalars['Boolean']['input']>;
  isMintPaused_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  isMintPaused_not?: InputMaybe<Scalars['Boolean']['input']>;
  isMintPaused_not_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  isSeizePaused?: InputMaybe<Scalars['Boolean']['input']>;
  isSeizePaused_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  isSeizePaused_not?: InputMaybe<Scalars['Boolean']['input']>;
  isSeizePaused_not_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  isTransferPaused?: InputMaybe<Scalars['Boolean']['input']>;
  isTransferPaused_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  isTransferPaused_not?: InputMaybe<Scalars['Boolean']['input']>;
  isTransferPaused_not_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  oracle?: InputMaybe<Scalars['String']['input']>;
  oracle_contains?: InputMaybe<Scalars['String']['input']>;
  oracle_ends_with?: InputMaybe<Scalars['String']['input']>;
  oracle_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  oracle_not?: InputMaybe<Scalars['String']['input']>;
  oracle_not_contains?: InputMaybe<Scalars['String']['input']>;
  oracle_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  oracle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  oracle_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  oracle_starts_with?: InputMaybe<Scalars['String']['input']>;
  ownerShare?: InputMaybe<Scalars['BigInt']['input']>;
  ownerShare_gt?: InputMaybe<Scalars['BigInt']['input']>;
  ownerShare_gte?: InputMaybe<Scalars['BigInt']['input']>;
  ownerShare_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  ownerShare_lt?: InputMaybe<Scalars['BigInt']['input']>;
  ownerShare_lte?: InputMaybe<Scalars['BigInt']['input']>;
  ownerShare_not?: InputMaybe<Scalars['BigInt']['input']>;
  ownerShare_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  pTokenBeaconProxy?: InputMaybe<Scalars['String']['input']>;
  pTokenBeaconProxy_contains?: InputMaybe<Scalars['String']['input']>;
  pTokenBeaconProxy_ends_with?: InputMaybe<Scalars['String']['input']>;
  pTokenBeaconProxy_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  pTokenBeaconProxy_not?: InputMaybe<Scalars['String']['input']>;
  pTokenBeaconProxy_not_contains?: InputMaybe<Scalars['String']['input']>;
  pTokenBeaconProxy_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pTokenBeaconProxy_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  pTokenBeaconProxy_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pTokenBeaconProxy_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocolId?: InputMaybe<Scalars['BigInt']['input']>;
  protocolId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  protocolId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  protocolId_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  protocolId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  protocolId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  protocolId_not?: InputMaybe<Scalars['BigInt']['input']>;
  protocolId_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  riskEngine?: InputMaybe<Scalars['String']['input']>;
  riskEngineBeaconProxy?: InputMaybe<Scalars['String']['input']>;
  riskEngineBeaconProxy_contains?: InputMaybe<Scalars['String']['input']>;
  riskEngineBeaconProxy_ends_with?: InputMaybe<Scalars['String']['input']>;
  riskEngineBeaconProxy_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  riskEngineBeaconProxy_not?: InputMaybe<Scalars['String']['input']>;
  riskEngineBeaconProxy_not_contains?: InputMaybe<Scalars['String']['input']>;
  riskEngineBeaconProxy_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  riskEngineBeaconProxy_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  riskEngineBeaconProxy_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  riskEngineBeaconProxy_starts_with?: InputMaybe<Scalars['String']['input']>;
  riskEngine_contains?: InputMaybe<Scalars['String']['input']>;
  riskEngine_ends_with?: InputMaybe<Scalars['String']['input']>;
  riskEngine_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  riskEngine_not?: InputMaybe<Scalars['String']['input']>;
  riskEngine_not_contains?: InputMaybe<Scalars['String']['input']>;
  riskEngine_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  riskEngine_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  riskEngine_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  riskEngine_starts_with?: InputMaybe<Scalars['String']['input']>;
  timelock?: InputMaybe<Scalars['String']['input']>;
  timelockBeaconProxy?: InputMaybe<Scalars['String']['input']>;
  timelockBeaconProxy_contains?: InputMaybe<Scalars['String']['input']>;
  timelockBeaconProxy_ends_with?: InputMaybe<Scalars['String']['input']>;
  timelockBeaconProxy_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  timelockBeaconProxy_not?: InputMaybe<Scalars['String']['input']>;
  timelockBeaconProxy_not_contains?: InputMaybe<Scalars['String']['input']>;
  timelockBeaconProxy_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  timelockBeaconProxy_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  timelockBeaconProxy_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  timelockBeaconProxy_starts_with?: InputMaybe<Scalars['String']['input']>;
  timelock_contains?: InputMaybe<Scalars['String']['input']>;
  timelock_ends_with?: InputMaybe<Scalars['String']['input']>;
  timelock_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  timelock_not?: InputMaybe<Scalars['String']['input']>;
  timelock_not_contains?: InputMaybe<Scalars['String']['input']>;
  timelock_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  timelock_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  timelock_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  timelock_starts_with?: InputMaybe<Scalars['String']['input']>;
};

/** Paginated list of core protocol configuration and state records */
export type ProtocolPage = {
  __typename?: 'protocolPage';
  /** List of core protocol configuration and state records */
  items: Array<Protocol>;
  /** Information about pagination in a connection */
  pageInfo: PageInfo;
  /** Total number of records matching the query */
  totalCount: Scalars['Int']['output'];
};

/** Get a single repayment transaction information by address */
export type RepayBorrow = {
  __typename?: 'repayBorrow';
  /** Remaining borrows for the account in the market (underlying) (exact match) */
  accountBorrows: Scalars['BigInt']['output'];
  /** The blockchain network identifier (exact match) */
  chainId: Scalars['BigInt']['output'];
  /** Unique identifier for the repayment composed by <transactionHash>-<logIndex> (exact match) */
  id: Scalars['String']['output'];
  pToken?: Maybe<PToken>;
  /** Pike token (pToken) identifier (exact match) */
  pTokenId: Scalars['String']['output'];
  /** Address that performed the repayment (exact match) */
  payer: Scalars['String']['output'];
  /** Amount of assets repaid (underlying) (exact match) */
  repayAssets: Scalars['BigInt']['output'];
  /** Updated total borrows for the market (underlying) (exact match) */
  totalBorrows: Scalars['BigInt']['output'];
  transaction?: Maybe<Transaction>;
  /** Associated transaction identifier (exact match) */
  transactionId: Scalars['String']['output'];
  /** USD value of the repayment (exact match) */
  usdValue: Scalars['String']['output'];
  user?: Maybe<User>;
  /** User identifier (exact match) */
  userId: Scalars['String']['output'];
};

export type RepayBorrowFilter = {
  AND?: InputMaybe<Array<InputMaybe<RepayBorrowFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<RepayBorrowFilter>>>;
  accountBorrows?: InputMaybe<Scalars['BigInt']['input']>;
  accountBorrows_gt?: InputMaybe<Scalars['BigInt']['input']>;
  accountBorrows_gte?: InputMaybe<Scalars['BigInt']['input']>;
  accountBorrows_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  accountBorrows_lt?: InputMaybe<Scalars['BigInt']['input']>;
  accountBorrows_lte?: InputMaybe<Scalars['BigInt']['input']>;
  accountBorrows_not?: InputMaybe<Scalars['BigInt']['input']>;
  accountBorrows_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  chainId?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId?: InputMaybe<Scalars['String']['input']>;
  pTokenId_contains?: InputMaybe<Scalars['String']['input']>;
  pTokenId_ends_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  pTokenId_not?: InputMaybe<Scalars['String']['input']>;
  pTokenId_not_contains?: InputMaybe<Scalars['String']['input']>;
  pTokenId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  pTokenId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId_starts_with?: InputMaybe<Scalars['String']['input']>;
  payer?: InputMaybe<Scalars['String']['input']>;
  payer_contains?: InputMaybe<Scalars['String']['input']>;
  payer_ends_with?: InputMaybe<Scalars['String']['input']>;
  payer_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  payer_not?: InputMaybe<Scalars['String']['input']>;
  payer_not_contains?: InputMaybe<Scalars['String']['input']>;
  payer_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  payer_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  payer_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  payer_starts_with?: InputMaybe<Scalars['String']['input']>;
  repayAssets?: InputMaybe<Scalars['BigInt']['input']>;
  repayAssets_gt?: InputMaybe<Scalars['BigInt']['input']>;
  repayAssets_gte?: InputMaybe<Scalars['BigInt']['input']>;
  repayAssets_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  repayAssets_lt?: InputMaybe<Scalars['BigInt']['input']>;
  repayAssets_lte?: InputMaybe<Scalars['BigInt']['input']>;
  repayAssets_not?: InputMaybe<Scalars['BigInt']['input']>;
  repayAssets_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  totalBorrows?: InputMaybe<Scalars['BigInt']['input']>;
  totalBorrows_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalBorrows_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalBorrows_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  totalBorrows_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalBorrows_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalBorrows_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalBorrows_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
  transactionId_contains?: InputMaybe<Scalars['String']['input']>;
  transactionId_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionId_not?: InputMaybe<Scalars['String']['input']>;
  transactionId_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionId_starts_with?: InputMaybe<Scalars['String']['input']>;
  usdValue?: InputMaybe<Scalars['String']['input']>;
  usdValue_contains?: InputMaybe<Scalars['String']['input']>;
  usdValue_ends_with?: InputMaybe<Scalars['String']['input']>;
  usdValue_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  usdValue_not?: InputMaybe<Scalars['String']['input']>;
  usdValue_not_contains?: InputMaybe<Scalars['String']['input']>;
  usdValue_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  usdValue_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  usdValue_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  usdValue_starts_with?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
  userId_contains?: InputMaybe<Scalars['String']['input']>;
  userId_ends_with?: InputMaybe<Scalars['String']['input']>;
  userId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  userId_not?: InputMaybe<Scalars['String']['input']>;
  userId_not_contains?: InputMaybe<Scalars['String']['input']>;
  userId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  userId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  userId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  userId_starts_with?: InputMaybe<Scalars['String']['input']>;
};

/** Paginated list of repayment transaction information records */
export type RepayBorrowPage = {
  __typename?: 'repayBorrowPage';
  /** List of repayment transaction information records */
  items: Array<RepayBorrow>;
  /** Information about pagination in a connection */
  pageInfo: PageInfo;
  /** Total number of records matching the query */
  totalCount: Scalars['Int']['output'];
};

/** Get a single blockchain transaction metadata information by address */
export type Transaction = {
  __typename?: 'transaction';
  actionsPaused?: Maybe<ActionPausedPage>;
  /** Hash of the block (exact match) */
  blockHash: Scalars['String']['output'];
  /** Block number containing the transaction (exact match) */
  blockNumber: Scalars['BigInt']['output'];
  borrows?: Maybe<BorrowPage>;
  /** The blockchain network identifier (exact match) */
  chainId: Scalars['BigInt']['output'];
  delegateUpdated?: Maybe<DelegateUpdatedPage>;
  deposits?: Maybe<DepositPage>;
  /** Transaction sender address (exact match) */
  from: Scalars['String']['output'];
  /** Gas used by the transaction (exact match) */
  gas?: Maybe<Scalars['BigInt']['output']>;
  /** Gas price for the transaction (exact match) */
  gasPrice?: Maybe<Scalars['BigInt']['output']>;
  /** Unique identifier for the transaction composed by <transactionHash>-<chainId> (exact match) */
  id: Scalars['String']['output'];
  liquidations?: Maybe<LiquidateBorrowPage>;
  marketsEntered?: Maybe<MarketEnteredPage>;
  marketsExited?: Maybe<MarketExitedPage>;
  pTokensCreation?: Maybe<PTokenPage>;
  protocolsCreation?: Maybe<ProtocolPage>;
  repayBorrows?: Maybe<RepayBorrowPage>;
  /** Transaction timestamp (exact match) */
  timestamp: Scalars['BigInt']['output'];
  /** Transaction recipient address (exact match) */
  to?: Maybe<Scalars['String']['output']>;
  /** Transaction hash (exact match) */
  transactionHash: Scalars['String']['output'];
  transfers?: Maybe<TransferPage>;
  withdraws?: Maybe<WithdrawPage>;
};


/** Get a single blockchain transaction metadata information by address */
export type TransactionActionsPausedArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<ActionPausedFilter>;
};


/** Get a single blockchain transaction metadata information by address */
export type TransactionBorrowsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<BorrowFilter>;
};


/** Get a single blockchain transaction metadata information by address */
export type TransactionDelegateUpdatedArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<DelegateUpdatedFilter>;
};


/** Get a single blockchain transaction metadata information by address */
export type TransactionDepositsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<DepositFilter>;
};


/** Get a single blockchain transaction metadata information by address */
export type TransactionLiquidationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<LiquidateBorrowFilter>;
};


/** Get a single blockchain transaction metadata information by address */
export type TransactionMarketsEnteredArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<MarketEnteredFilter>;
};


/** Get a single blockchain transaction metadata information by address */
export type TransactionMarketsExitedArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<MarketExitedFilter>;
};


/** Get a single blockchain transaction metadata information by address */
export type TransactionPTokensCreationArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<PTokenFilter>;
};


/** Get a single blockchain transaction metadata information by address */
export type TransactionProtocolsCreationArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<ProtocolFilter>;
};


/** Get a single blockchain transaction metadata information by address */
export type TransactionRepayBorrowsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<RepayBorrowFilter>;
};


/** Get a single blockchain transaction metadata information by address */
export type TransactionTransfersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<TransferFilter>;
};


/** Get a single blockchain transaction metadata information by address */
export type TransactionWithdrawsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<WithdrawFilter>;
};

export type TransactionFilter = {
  AND?: InputMaybe<Array<InputMaybe<TransactionFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<TransactionFilter>>>;
  blockHash?: InputMaybe<Scalars['String']['input']>;
  blockHash_contains?: InputMaybe<Scalars['String']['input']>;
  blockHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  blockHash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  blockHash_not?: InputMaybe<Scalars['String']['input']>;
  blockHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  blockHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  blockHash_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  blockHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  blockHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  chainId?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  from?: InputMaybe<Scalars['String']['input']>;
  from_contains?: InputMaybe<Scalars['String']['input']>;
  from_ends_with?: InputMaybe<Scalars['String']['input']>;
  from_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  from_not?: InputMaybe<Scalars['String']['input']>;
  from_not_contains?: InputMaybe<Scalars['String']['input']>;
  from_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  from_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  from_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  from_starts_with?: InputMaybe<Scalars['String']['input']>;
  gas?: InputMaybe<Scalars['BigInt']['input']>;
  gasPrice?: InputMaybe<Scalars['BigInt']['input']>;
  gasPrice_gt?: InputMaybe<Scalars['BigInt']['input']>;
  gasPrice_gte?: InputMaybe<Scalars['BigInt']['input']>;
  gasPrice_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  gasPrice_lt?: InputMaybe<Scalars['BigInt']['input']>;
  gasPrice_lte?: InputMaybe<Scalars['BigInt']['input']>;
  gasPrice_not?: InputMaybe<Scalars['BigInt']['input']>;
  gasPrice_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  gas_gt?: InputMaybe<Scalars['BigInt']['input']>;
  gas_gte?: InputMaybe<Scalars['BigInt']['input']>;
  gas_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  gas_lt?: InputMaybe<Scalars['BigInt']['input']>;
  gas_lte?: InputMaybe<Scalars['BigInt']['input']>;
  gas_not?: InputMaybe<Scalars['BigInt']['input']>;
  gas_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  to?: InputMaybe<Scalars['String']['input']>;
  to_contains?: InputMaybe<Scalars['String']['input']>;
  to_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  to_not?: InputMaybe<Scalars['String']['input']>;
  to_not_contains?: InputMaybe<Scalars['String']['input']>;
  to_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  to_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  to_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash?: InputMaybe<Scalars['String']['input']>;
  transactionHash_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionHash_not?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with?: InputMaybe<Scalars['String']['input']>;
};

/** Paginated list of blockchain transaction metadata information records */
export type TransactionPage = {
  __typename?: 'transactionPage';
  /** List of blockchain transaction metadata information records */
  items: Array<Transaction>;
  /** Information about pagination in a connection */
  pageInfo: PageInfo;
  /** Total number of records matching the query */
  totalCount: Scalars['Int']['output'];
};

/** Get a single ERC-20 pToken transfer information by address */
export type Transfer = {
  __typename?: 'transfer';
  /** The blockchain network identifier (exact match) */
  chainId: Scalars['BigInt']['output'];
  from?: Maybe<User>;
  /** Sender's identifier (exact match) */
  fromId: Scalars['String']['output'];
  /** Unique identifier for the transfer composed by <transactionHash>-<logIndex> (exact match) */
  id: Scalars['String']['output'];
  pToken?: Maybe<PToken>;
  /** Pike token (pToken) identifier (exact match) */
  pTokenId: Scalars['String']['output'];
  /** Number of shares transferred (pTokens) (exact match) */
  shares: Scalars['BigInt']['output'];
  to?: Maybe<User>;
  /** Recipient's identifier (exact match) */
  toId: Scalars['String']['output'];
  transaction?: Maybe<Transaction>;
  /** Associated transaction identifier (exact match) */
  transactionId: Scalars['String']['output'];
  /** USD value of the transfer (exact match) */
  usdValue: Scalars['String']['output'];
};

export type TransferFilter = {
  AND?: InputMaybe<Array<InputMaybe<TransferFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<TransferFilter>>>;
  chainId?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  fromId?: InputMaybe<Scalars['String']['input']>;
  fromId_contains?: InputMaybe<Scalars['String']['input']>;
  fromId_ends_with?: InputMaybe<Scalars['String']['input']>;
  fromId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  fromId_not?: InputMaybe<Scalars['String']['input']>;
  fromId_not_contains?: InputMaybe<Scalars['String']['input']>;
  fromId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  fromId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  fromId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  fromId_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId?: InputMaybe<Scalars['String']['input']>;
  pTokenId_contains?: InputMaybe<Scalars['String']['input']>;
  pTokenId_ends_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  pTokenId_not?: InputMaybe<Scalars['String']['input']>;
  pTokenId_not_contains?: InputMaybe<Scalars['String']['input']>;
  pTokenId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  pTokenId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId_starts_with?: InputMaybe<Scalars['String']['input']>;
  shares?: InputMaybe<Scalars['BigInt']['input']>;
  shares_gt?: InputMaybe<Scalars['BigInt']['input']>;
  shares_gte?: InputMaybe<Scalars['BigInt']['input']>;
  shares_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  shares_lt?: InputMaybe<Scalars['BigInt']['input']>;
  shares_lte?: InputMaybe<Scalars['BigInt']['input']>;
  shares_not?: InputMaybe<Scalars['BigInt']['input']>;
  shares_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  toId?: InputMaybe<Scalars['String']['input']>;
  toId_contains?: InputMaybe<Scalars['String']['input']>;
  toId_ends_with?: InputMaybe<Scalars['String']['input']>;
  toId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  toId_not?: InputMaybe<Scalars['String']['input']>;
  toId_not_contains?: InputMaybe<Scalars['String']['input']>;
  toId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  toId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  toId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  toId_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
  transactionId_contains?: InputMaybe<Scalars['String']['input']>;
  transactionId_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionId_not?: InputMaybe<Scalars['String']['input']>;
  transactionId_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionId_starts_with?: InputMaybe<Scalars['String']['input']>;
  usdValue?: InputMaybe<Scalars['String']['input']>;
  usdValue_contains?: InputMaybe<Scalars['String']['input']>;
  usdValue_ends_with?: InputMaybe<Scalars['String']['input']>;
  usdValue_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  usdValue_not?: InputMaybe<Scalars['String']['input']>;
  usdValue_not_contains?: InputMaybe<Scalars['String']['input']>;
  usdValue_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  usdValue_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  usdValue_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  usdValue_starts_with?: InputMaybe<Scalars['String']['input']>;
};

/** Paginated list of ERC-20 pToken transfer information records */
export type TransferPage = {
  __typename?: 'transferPage';
  /** List of ERC-20 pToken transfer information records */
  items: Array<Transfer>;
  /** Information about pagination in a connection */
  pageInfo: PageInfo;
  /** Total number of records matching the query */
  totalCount: Scalars['Int']['output'];
};

/** Get a single base ERC20 underlying token information by address */
export type UnderlyingToken = {
  __typename?: 'underlyingToken';
  /** Contract address of the token (exact match) */
  address: Scalars['String']['output'];
  /** The blockchain network identifier (exact match) */
  chainId: Scalars['BigInt']['output'];
  /** Number of decimal places (exact match) */
  decimals: Scalars['String']['output'];
  /** Unique identifier for the underlying token composed by <underlyingTokenAddress>-<chainId> (exact match) */
  id: Scalars['String']['output'];
  /** Token name (exact match) */
  name: Scalars['String']['output'];
  pTokens?: Maybe<PTokenPage>;
  /** Token symbol (exact match) */
  symbol: Scalars['String']['output'];
};


/** Get a single base ERC20 underlying token information by address */
export type UnderlyingTokenPTokensArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<PTokenFilter>;
};

export type UnderlyingTokenFilter = {
  AND?: InputMaybe<Array<InputMaybe<UnderlyingTokenFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<UnderlyingTokenFilter>>>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  decimals?: InputMaybe<Scalars['String']['input']>;
  decimals_contains?: InputMaybe<Scalars['String']['input']>;
  decimals_ends_with?: InputMaybe<Scalars['String']['input']>;
  decimals_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  decimals_not?: InputMaybe<Scalars['String']['input']>;
  decimals_not_contains?: InputMaybe<Scalars['String']['input']>;
  decimals_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  decimals_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  decimals_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  decimals_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol?: InputMaybe<Scalars['String']['input']>;
  symbol_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  symbol_not?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with?: InputMaybe<Scalars['String']['input']>;
};

/** Paginated list of base ERC20 underlying token information records */
export type UnderlyingTokenPage = {
  __typename?: 'underlyingTokenPage';
  /** List of base ERC20 underlying token information records */
  items: Array<UnderlyingToken>;
  /** Information about pagination in a connection */
  pageInfo: PageInfo;
  /** Total number of records matching the query */
  totalCount: Scalars['Int']['output'];
};

/** Get a single user account information by address */
export type User = {
  __typename?: 'user';
  /** User's blockchain address (exact match) */
  address: Scalars['String']['output'];
  balances?: Maybe<UserBalancePage>;
  borrows?: Maybe<BorrowPage>;
  /** The blockchain network identifier (exact match) */
  chainId: Scalars['BigInt']['output'];
  delegateUpdated?: Maybe<DelegateUpdatedPage>;
  delegates?: Maybe<UserDelegationPage>;
  deposits?: Maybe<DepositPage>;
  eModes?: Maybe<UserEModePage>;
  /** Unique identifier for the user composed by its address (exact match) */
  id: Scalars['String']['output'];
  liquidationsExecuted?: Maybe<LiquidateBorrowPage>;
  liquidationsSuffered?: Maybe<LiquidateBorrowPage>;
  marketsEntered?: Maybe<MarketEnteredPage>;
  marketsExited?: Maybe<MarketExitedPage>;
  repayBorrows?: Maybe<RepayBorrowPage>;
  transfersReceived?: Maybe<TransferPage>;
  transfersSent?: Maybe<TransferPage>;
  withdraws?: Maybe<WithdrawPage>;
};


/** Get a single user account information by address */
export type UserBalancesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<UserBalanceFilter>;
};


/** Get a single user account information by address */
export type UserBorrowsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<BorrowFilter>;
};


/** Get a single user account information by address */
export type UserDelegateUpdatedArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<DelegateUpdatedFilter>;
};


/** Get a single user account information by address */
export type UserDelegatesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<UserDelegationFilter>;
};


/** Get a single user account information by address */
export type UserDepositsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<DepositFilter>;
};


/** Get a single user account information by address */
export type UserEModesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<UserEModeFilter>;
};


/** Get a single user account information by address */
export type UserLiquidationsExecutedArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<LiquidateBorrowFilter>;
};


/** Get a single user account information by address */
export type UserLiquidationsSufferedArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<LiquidateBorrowFilter>;
};


/** Get a single user account information by address */
export type UserMarketsEnteredArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<MarketEnteredFilter>;
};


/** Get a single user account information by address */
export type UserMarketsExitedArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<MarketExitedFilter>;
};


/** Get a single user account information by address */
export type UserRepayBorrowsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<RepayBorrowFilter>;
};


/** Get a single user account information by address */
export type UserTransfersReceivedArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<TransferFilter>;
};


/** Get a single user account information by address */
export type UserTransfersSentArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<TransferFilter>;
};


/** Get a single user account information by address */
export type UserWithdrawsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<WithdrawFilter>;
};

/** Get a single user position in one pToken market by address */
export type UserBalance = {
  __typename?: 'userBalance';
  /** Amount of assets borrowed (underlying) (exact match) */
  borrowAssets: Scalars['BigInt']['output'];
  /** The blockchain network identifier (exact match) */
  chainId: Scalars['BigInt']['output'];
  /** Unique identifier for the balance record composed by <userAddress>-<pTokenAddress>-<chainId> (exact match) */
  id: Scalars['String']['output'];
  /** Latest saved interest accumulation index (exact match) */
  interestIndex: Scalars['BigInt']['output'];
  /** Whether the position is used as collateral (exact match) */
  isCollateral: Scalars['Boolean']['output'];
  pToken?: Maybe<PToken>;
  /** Pike token (pToken) identifier (exact match) */
  pTokenId: Scalars['String']['output'];
  /** Number of supply shares owned (pTokens) (exact match) */
  supplyShares: Scalars['BigInt']['output'];
  /** Last update timestamp (exact match) */
  updatedAt: Scalars['BigInt']['output'];
  user?: Maybe<User>;
  /** User identifier (exact match) */
  userId: Scalars['String']['output'];
};

export type UserBalanceFilter = {
  AND?: InputMaybe<Array<InputMaybe<UserBalanceFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<UserBalanceFilter>>>;
  borrowAssets?: InputMaybe<Scalars['BigInt']['input']>;
  borrowAssets_gt?: InputMaybe<Scalars['BigInt']['input']>;
  borrowAssets_gte?: InputMaybe<Scalars['BigInt']['input']>;
  borrowAssets_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  borrowAssets_lt?: InputMaybe<Scalars['BigInt']['input']>;
  borrowAssets_lte?: InputMaybe<Scalars['BigInt']['input']>;
  borrowAssets_not?: InputMaybe<Scalars['BigInt']['input']>;
  borrowAssets_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  chainId?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  interestIndex?: InputMaybe<Scalars['BigInt']['input']>;
  interestIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  interestIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  interestIndex_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  interestIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  interestIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  interestIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  interestIndex_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  isCollateral?: InputMaybe<Scalars['Boolean']['input']>;
  isCollateral_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  isCollateral_not?: InputMaybe<Scalars['Boolean']['input']>;
  isCollateral_not_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  pTokenId?: InputMaybe<Scalars['String']['input']>;
  pTokenId_contains?: InputMaybe<Scalars['String']['input']>;
  pTokenId_ends_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  pTokenId_not?: InputMaybe<Scalars['String']['input']>;
  pTokenId_not_contains?: InputMaybe<Scalars['String']['input']>;
  pTokenId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  pTokenId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId_starts_with?: InputMaybe<Scalars['String']['input']>;
  supplyShares?: InputMaybe<Scalars['BigInt']['input']>;
  supplyShares_gt?: InputMaybe<Scalars['BigInt']['input']>;
  supplyShares_gte?: InputMaybe<Scalars['BigInt']['input']>;
  supplyShares_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  supplyShares_lt?: InputMaybe<Scalars['BigInt']['input']>;
  supplyShares_lte?: InputMaybe<Scalars['BigInt']['input']>;
  supplyShares_not?: InputMaybe<Scalars['BigInt']['input']>;
  supplyShares_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  userId?: InputMaybe<Scalars['String']['input']>;
  userId_contains?: InputMaybe<Scalars['String']['input']>;
  userId_ends_with?: InputMaybe<Scalars['String']['input']>;
  userId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  userId_not?: InputMaybe<Scalars['String']['input']>;
  userId_not_contains?: InputMaybe<Scalars['String']['input']>;
  userId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  userId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  userId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  userId_starts_with?: InputMaybe<Scalars['String']['input']>;
};

/** Paginated list of user position in one pToken market records */
export type UserBalancePage = {
  __typename?: 'userBalancePage';
  /** List of user position in one pToken market records */
  items: Array<UserBalance>;
  /** Information about pagination in a connection */
  pageInfo: PageInfo;
  /** Total number of records matching the query */
  totalCount: Scalars['Int']['output'];
};

/** Get a single user delegation relationships by address */
export type UserDelegation = {
  __typename?: 'userDelegation';
  /** The blockchain network identifier (exact match) */
  chainId: Scalars['BigInt']['output'];
  /** Address of the delegate (exact match) */
  delegateAddress: Scalars['String']['output'];
  /** Unique identifier for the delegation composed by <userAddress>-<delegateAddress>-<chainId> (exact match) */
  id: Scalars['String']['output'];
  protocol?: Maybe<Protocol>;
  /** Protocol identifier (exact match) */
  protocolId: Scalars['String']['output'];
  user?: Maybe<User>;
  /** User identifier (exact match) */
  userId: Scalars['String']['output'];
};

export type UserDelegationFilter = {
  AND?: InputMaybe<Array<InputMaybe<UserDelegationFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<UserDelegationFilter>>>;
  chainId?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  delegateAddress?: InputMaybe<Scalars['String']['input']>;
  delegateAddress_contains?: InputMaybe<Scalars['String']['input']>;
  delegateAddress_ends_with?: InputMaybe<Scalars['String']['input']>;
  delegateAddress_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  delegateAddress_not?: InputMaybe<Scalars['String']['input']>;
  delegateAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
  delegateAddress_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  delegateAddress_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  delegateAddress_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  delegateAddress_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocolId?: InputMaybe<Scalars['String']['input']>;
  protocolId_contains?: InputMaybe<Scalars['String']['input']>;
  protocolId_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocolId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  protocolId_not?: InputMaybe<Scalars['String']['input']>;
  protocolId_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocolId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocolId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  protocolId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocolId_starts_with?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
  userId_contains?: InputMaybe<Scalars['String']['input']>;
  userId_ends_with?: InputMaybe<Scalars['String']['input']>;
  userId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  userId_not?: InputMaybe<Scalars['String']['input']>;
  userId_not_contains?: InputMaybe<Scalars['String']['input']>;
  userId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  userId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  userId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  userId_starts_with?: InputMaybe<Scalars['String']['input']>;
};

/** Paginated list of user delegation relationships records */
export type UserDelegationPage = {
  __typename?: 'userDelegationPage';
  /** List of user delegation relationships records */
  items: Array<UserDelegation>;
  /** Information about pagination in a connection */
  pageInfo: PageInfo;
  /** Total number of records matching the query */
  totalCount: Scalars['Int']['output'];
};

/** Get a single user e-mode settings by address */
export type UserEMode = {
  __typename?: 'userEMode';
  /** The blockchain network identifier (exact match) */
  chainId: Scalars['BigInt']['output'];
  eMode?: Maybe<EMode>;
  /** E-mode identifier (exact match) */
  eModeId: Scalars['String']['output'];
  /** Unique identifier for the user e-mode composed by <userAddress>-<eModeCategoryId>-<chainId> (exact match) */
  id: Scalars['String']['output'];
  user?: Maybe<User>;
  /** User identifier (exact match) */
  userId: Scalars['String']['output'];
};

export type UserEModeFilter = {
  AND?: InputMaybe<Array<InputMaybe<UserEModeFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<UserEModeFilter>>>;
  chainId?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  eModeId?: InputMaybe<Scalars['String']['input']>;
  eModeId_contains?: InputMaybe<Scalars['String']['input']>;
  eModeId_ends_with?: InputMaybe<Scalars['String']['input']>;
  eModeId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  eModeId_not?: InputMaybe<Scalars['String']['input']>;
  eModeId_not_contains?: InputMaybe<Scalars['String']['input']>;
  eModeId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  eModeId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  eModeId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  eModeId_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
  userId_contains?: InputMaybe<Scalars['String']['input']>;
  userId_ends_with?: InputMaybe<Scalars['String']['input']>;
  userId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  userId_not?: InputMaybe<Scalars['String']['input']>;
  userId_not_contains?: InputMaybe<Scalars['String']['input']>;
  userId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  userId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  userId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  userId_starts_with?: InputMaybe<Scalars['String']['input']>;
};

/** Paginated list of user e-mode settings records */
export type UserEModePage = {
  __typename?: 'userEModePage';
  /** List of user e-mode settings records */
  items: Array<UserEMode>;
  /** Information about pagination in a connection */
  pageInfo: PageInfo;
  /** Total number of records matching the query */
  totalCount: Scalars['Int']['output'];
};

export type UserFilter = {
  AND?: InputMaybe<Array<InputMaybe<UserFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<UserFilter>>>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
};

/** Paginated list of user account information records */
export type UserPage = {
  __typename?: 'userPage';
  /** List of user account information records */
  items: Array<User>;
  /** Information about pagination in a connection */
  pageInfo: PageInfo;
  /** Total number of records matching the query */
  totalCount: Scalars['Int']['output'];
};

/** Get a single withdrawal transaction information by address */
export type Withdraw = {
  __typename?: 'withdraw';
  /** Amount of assets withdrawn (underlying) (exact match) */
  assets: Scalars['BigInt']['output'];
  /** The blockchain network identifier (exact match) */
  chainId: Scalars['BigInt']['output'];
  /** Unique identifier for the withdrawal composed by <transactionHash>-<logIndex> (exact match) */
  id: Scalars['String']['output'];
  pToken?: Maybe<PToken>;
  /** Pike token (pToken) identifier (exact match) */
  pTokenId: Scalars['String']['output'];
  /** Address receiving the assets (exact match) */
  receiver: Scalars['String']['output'];
  /** Address initiating the withdrawal (exact match) */
  sender: Scalars['String']['output'];
  /** Number of shares burned (pTokens) (exact match) */
  shares: Scalars['BigInt']['output'];
  transaction?: Maybe<Transaction>;
  /** Associated transaction identifier (exact match) */
  transactionId: Scalars['String']['output'];
  /** USD value of the withdrawal (exact match) */
  usdValue: Scalars['String']['output'];
  user?: Maybe<User>;
  /** User identifier (exact match) */
  userId: Scalars['String']['output'];
};

export type WithdrawFilter = {
  AND?: InputMaybe<Array<InputMaybe<WithdrawFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<WithdrawFilter>>>;
  assets?: InputMaybe<Scalars['BigInt']['input']>;
  assets_gt?: InputMaybe<Scalars['BigInt']['input']>;
  assets_gte?: InputMaybe<Scalars['BigInt']['input']>;
  assets_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  assets_lt?: InputMaybe<Scalars['BigInt']['input']>;
  assets_lte?: InputMaybe<Scalars['BigInt']['input']>;
  assets_not?: InputMaybe<Scalars['BigInt']['input']>;
  assets_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  chainId?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId?: InputMaybe<Scalars['String']['input']>;
  pTokenId_contains?: InputMaybe<Scalars['String']['input']>;
  pTokenId_ends_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  pTokenId_not?: InputMaybe<Scalars['String']['input']>;
  pTokenId_not_contains?: InputMaybe<Scalars['String']['input']>;
  pTokenId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  pTokenId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pTokenId_starts_with?: InputMaybe<Scalars['String']['input']>;
  receiver?: InputMaybe<Scalars['String']['input']>;
  receiver_contains?: InputMaybe<Scalars['String']['input']>;
  receiver_ends_with?: InputMaybe<Scalars['String']['input']>;
  receiver_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  receiver_not?: InputMaybe<Scalars['String']['input']>;
  receiver_not_contains?: InputMaybe<Scalars['String']['input']>;
  receiver_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  receiver_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  receiver_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  receiver_starts_with?: InputMaybe<Scalars['String']['input']>;
  sender?: InputMaybe<Scalars['String']['input']>;
  sender_contains?: InputMaybe<Scalars['String']['input']>;
  sender_ends_with?: InputMaybe<Scalars['String']['input']>;
  sender_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  sender_not?: InputMaybe<Scalars['String']['input']>;
  sender_not_contains?: InputMaybe<Scalars['String']['input']>;
  sender_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  sender_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  sender_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  sender_starts_with?: InputMaybe<Scalars['String']['input']>;
  shares?: InputMaybe<Scalars['BigInt']['input']>;
  shares_gt?: InputMaybe<Scalars['BigInt']['input']>;
  shares_gte?: InputMaybe<Scalars['BigInt']['input']>;
  shares_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  shares_lt?: InputMaybe<Scalars['BigInt']['input']>;
  shares_lte?: InputMaybe<Scalars['BigInt']['input']>;
  shares_not?: InputMaybe<Scalars['BigInt']['input']>;
  shares_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
  transactionId_contains?: InputMaybe<Scalars['String']['input']>;
  transactionId_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionId_not?: InputMaybe<Scalars['String']['input']>;
  transactionId_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionId_starts_with?: InputMaybe<Scalars['String']['input']>;
  usdValue?: InputMaybe<Scalars['String']['input']>;
  usdValue_contains?: InputMaybe<Scalars['String']['input']>;
  usdValue_ends_with?: InputMaybe<Scalars['String']['input']>;
  usdValue_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  usdValue_not?: InputMaybe<Scalars['String']['input']>;
  usdValue_not_contains?: InputMaybe<Scalars['String']['input']>;
  usdValue_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  usdValue_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  usdValue_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  usdValue_starts_with?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
  userId_contains?: InputMaybe<Scalars['String']['input']>;
  userId_ends_with?: InputMaybe<Scalars['String']['input']>;
  userId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  userId_not?: InputMaybe<Scalars['String']['input']>;
  userId_not_contains?: InputMaybe<Scalars['String']['input']>;
  userId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  userId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  userId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  userId_starts_with?: InputMaybe<Scalars['String']['input']>;
};

/** Paginated list of withdrawal transaction information records */
export type WithdrawPage = {
  __typename?: 'withdrawPage';
  /** List of withdrawal transaction information records */
  items: Array<Withdraw>;
  /** Information about pagination in a connection */
  pageInfo: PageInfo;
  /** Total number of records matching the query */
  totalCount: Scalars['Int']['output'];
};

export type GetProtocolDataQueryVariables = Exact<{
  protocolId: Scalars['String']['input'];
}>;


export type GetProtocolDataQuery = { __typename?: 'Query', protocol?: { __typename?: 'protocol', oracle: string, pTokens?: { __typename?: 'pTokenPage', items: Array<{ __typename?: 'pToken', id: string, address: string, decimals: string, liquidationThreshold: any, liquidationIncentive: any, reserveFactor: any, collateralFactor: any, closeFactor: any, supplyCap: any, borrowCap: any, exchangeRateStored: any, borrowIndex: any, underlyingPriceCurrent: any, userBalances?: { __typename?: 'userBalancePage', items: Array<{ __typename?: 'userBalance', id: string, chainId: any, userId: string, pTokenId: string, supplyShares: any, borrowAssets: any, isCollateral: boolean, interestIndex: any, updatedAt: any }> } | null }> } | null, eModes?: { __typename?: 'eModePage', items: Array<{ __typename?: 'eMode', id: string, chainId: any, protocolId: string, categoryId: string, collateralFactor: any, liquidationThreshold: any, liquidationIncentive: any, users?: { __typename?: 'userEModePage', items: Array<{ __typename?: 'userEMode', userId: string, eModeId: string, chainId: any, id: string }> } | null }> } | null } | null };

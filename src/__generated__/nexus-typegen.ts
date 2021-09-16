/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import { Context } from "./../context"
import { core } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    datetime<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "DateTime";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    datetime<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "DateTime";
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  AlternativeInput: { // input type
    id: string; // String!
    text: string; // String!
  }
  CreateMeetingInput: { // input type
    description?: string | null; // String
    organization: string; // String!
    startTime: NexusGenScalars['DateTime']; // DateTime!
    title: string; // String!
  }
  CreateVotationInput: { // input type
    alternatives?: string[] | null; // [String!]
    blankVotes: boolean; // Boolean!
    description?: string | null; // String
    hiddenVotes: boolean; // Boolean!
    index: number; // Int!
    majorityThreshold: number; // Int!
    numberOfWinners: number; // Int!
    title: string; // String!
    type: NexusGenEnums['VotationType']; // VotationType!
  }
  ParticipantInput: { // input type
    email: string; // String!
    isVotingEligible: boolean; // Boolean!
    role: NexusGenEnums['Role']; // Role!
  }
  StvVoteAlternativeInput: { // input type
    alternativeId: string; // String!
    ranking: number; // Int!
  }
  UpdateMeetingInput: { // input type
    description?: string | null; // String
    id: string; // String!
    organization?: string | null; // String
    startTime?: NexusGenScalars['DateTime'] | null; // DateTime
    status?: NexusGenEnums['MeetingStatus'] | null; // MeetingStatus
    title?: string | null; // String
  }
  UpdateParticipantInput: { // input type
    email: string; // String!
    isVotingEligible: boolean; // Boolean!
    role: NexusGenEnums['Role']; // Role!
    userExists: boolean; // Boolean!
  }
  UpdateVotationInput: { // input type
    alternatives?: NexusGenInputs['AlternativeInput'][] | null; // [AlternativeInput!]
    blankVotes: boolean; // Boolean!
    description?: string | null; // String
    hiddenVotes: boolean; // Boolean!
    id: string; // String!
    index: number; // Int!
    majorityThreshold: number; // Int!
    numberOfWinners: number; // Int!
    title: string; // String!
    type: NexusGenEnums['VotationType']; // VotationType!
  }
}

export interface NexusGenEnums {
  MeetingStatus: "ENDED" | "ONGOING" | "UPCOMING"
  Role: "ADMIN" | "COUNTER" | "PARTICIPANT"
  ViewState: "CLOSED" | "ENDED" | "LOADING" | "ONGOING"
  VotationStatus: "CHECKING_RESULT" | "INVALID" | "OPEN" | "PUBLISHED_RESULT" | "UPCOMING"
  VotationType: "QUALIFIED" | "SIMPLE" | "STV"
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  DateTime: any
}

export interface NexusGenObjects {
  Alternative: { // root type
    id: string; // ID!
    text: string; // String!
    votationId: string; // String!
  }
  AlternativeResult: { // root type
    id: string; // ID!
    isWinner: boolean; // Boolean!
    text: string; // String!
    votationId: string; // String!
  }
  AlternativeWithWinner: { // root type
    id: string; // ID!
    isWinner: boolean; // Boolean!
    text: string; // String!
  }
  MaxOneOpenVotationError: { // root type
    message: string; // String!
  }
  Meeting: { // root type
    description?: string | null; // String
    id: string; // ID!
    organization: string; // String!
    startTime: NexusGenScalars['DateTime']; // DateTime!
    status: NexusGenEnums['MeetingStatus']; // MeetingStatus!
    title: string; // String!
  }
  Mutation: {};
  OwnerCannotBeRemovedFromParticipantError: { // root type
    message: string; // String!
  }
  Participant: { // root type
    isVotingEligible: boolean; // Boolean!
    role: NexusGenEnums['Role']; // Role!
  }
  ParticipantOrInvite: { // root type
    email: string; // String!
    isVotingEligible: boolean; // Boolean!
    role: NexusGenEnums['Role']; // Role!
  }
  Query: {};
  Subscription: {};
  User: { // root type
    email: string; // String!
    emailVerified: boolean; // Boolean!
    id: string; // ID!
  }
  UserNotFoundError: { // root type
    message: string; // String!
  }
  ViewChangedPayload: { // root type
    viewState: NexusGenEnums['ViewState']; // ViewState!
  }
  Votation: { // root type
    blankVotes: boolean; // Boolean!
    description?: string | null; // String
    hiddenVotes: boolean; // Boolean!
    id: string; // ID!
    index: number; // Int!
    majorityThreshold: number; // Int!
    meetingId: string; // String!
    numberOfWinners: number; // Int!
    order?: number | null; // Int
    status: NexusGenEnums['VotationStatus']; // VotationStatus!
    title: string; // String!
    type: NexusGenEnums['VotationType']; // VotationType!
  }
  VotationResults: { // root type
    blankVoteCount: number; // Int!
    blankVotes: boolean; // Boolean!
  }
  VotationWithWinner: { // root type
    id: string; // ID!
  }
  Vote: { // root type
    alternativeId: string; // String!
    id: string; // ID!
  }
  VoteCountResult: { // root type
    voteCount: number; // Int!
    votingEligibleCount: number; // Int!
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
  DeleteParticipantResult: core.Discriminate<'OwnerCannotBeRemovedFromParticipantError', 'required'> | core.Discriminate<'Participant', 'required'>;
  GetUserResult: core.Discriminate<'User', 'required'> | core.Discriminate<'UserNotFoundError', 'required'>;
  UpdateVotationStatusResult: core.Discriminate<'MaxOneOpenVotationError', 'required'> | core.Discriminate<'Votation', 'required'>;
}

export type NexusGenRootTypes = NexusGenObjects & NexusGenUnions

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  Alternative: { // field return type
    id: string; // ID!
    text: string; // String!
    votationId: string; // String!
  }
  AlternativeResult: { // field return type
    id: string; // ID!
    isWinner: boolean; // Boolean!
    text: string; // String!
    votationId: string; // String!
    votes: number; // Int!
  }
  AlternativeWithWinner: { // field return type
    id: string; // ID!
    isWinner: boolean; // Boolean!
    text: string; // String!
  }
  MaxOneOpenVotationError: { // field return type
    message: string; // String!
  }
  Meeting: { // field return type
    description: string | null; // String
    id: string; // ID!
    organization: string; // String!
    owner: NexusGenRootTypes['User'] | null; // User
    participants: Array<NexusGenRootTypes['Participant'] | null>; // [Participant]!
    startTime: NexusGenScalars['DateTime']; // DateTime!
    status: NexusGenEnums['MeetingStatus']; // MeetingStatus!
    title: string; // String!
    votations: Array<NexusGenRootTypes['Votation'] | null> | null; // [Votation]
  }
  Mutation: { // field return type
    addParticipants: Array<NexusGenRootTypes['ParticipantOrInvite'] | null> | null; // [ParticipantOrInvite]
    castBlankVote: number | null; // Int
    castStvVote: string | null; // String
    castVote: NexusGenRootTypes['Vote'] | null; // Vote
    changeView: NexusGenEnums['ViewState'] | null; // ViewState
    createAlternative: NexusGenRootTypes['Alternative'] | null; // Alternative
    createMeeting: NexusGenRootTypes['Meeting'] | null; // Meeting
    createVotations: Array<NexusGenRootTypes['Votation'] | null> | null; // [Votation]
    deleteAlternatives: Array<string | null> | null; // [String]
    deleteMeeting: NexusGenRootTypes['Meeting'] | null; // Meeting
    deleteParticipants: Array<string | null> | null; // [String]
    deleteVotations: Array<string | null> | null; // [String]
    emailParticipants: Array<string | null> | null; // [String]
    updateAlternative: NexusGenRootTypes['Alternative'] | null; // Alternative
    updateMeeting: NexusGenRootTypes['Meeting'] | null; // Meeting
    updateVotationStatus: NexusGenRootTypes['UpdateVotationStatusResult'] | null; // UpdateVotationStatusResult
    updateVotations: Array<NexusGenRootTypes['Votation'] | null> | null; // [Votation]
  }
  OwnerCannotBeRemovedFromParticipantError: { // field return type
    message: string; // String!
  }
  Participant: { // field return type
    isVotingEligible: boolean; // Boolean!
    role: NexusGenEnums['Role']; // Role!
    user: NexusGenRootTypes['User'] | null; // User
  }
  ParticipantOrInvite: { // field return type
    email: string; // String!
    isVotingEligible: boolean; // Boolean!
    role: NexusGenEnums['Role']; // Role!
  }
  Query: { // field return type
    alternativesByVotation: Array<NexusGenRootTypes['Alternative'] | null> | null; // [Alternative]
    getOpenVotation: string | null; // String
    getVotationResults: NexusGenRootTypes['VotationResults'] | null; // VotationResults
    getVoteCount: NexusGenRootTypes['VoteCountResult'] | null; // VoteCountResult
    getWinnerOfVotation: Array<NexusGenRootTypes['Alternative'] | null> | null; // [Alternative]
    meetingById: NexusGenRootTypes['Meeting'] | null; // Meeting
    meetings: Array<NexusGenRootTypes['Meeting'] | null>; // [Meeting]!
    participants: Array<NexusGenRootTypes['ParticipantOrInvite'] | null> | null; // [ParticipantOrInvite]
    resultsOfPublishedVotations: Array<NexusGenRootTypes['VotationWithWinner'] | null> | null; // [VotationWithWinner]
    user: NexusGenRootTypes['GetUserResult'] | null; // GetUserResult
    votationById: NexusGenRootTypes['Votation'] | null; // Votation
  }
  Subscription: { // field return type
    newVoteRegistered: number | null; // Int
    viewChanged: NexusGenEnums['ViewState'] | null; // ViewState
    votationOpenedForMeeting: string | null; // String
    votationStatusUpdated: NexusGenEnums['VotationStatus'] | null; // VotationStatus
  }
  User: { // field return type
    email: string; // String!
    emailVerified: boolean; // Boolean!
    id: string; // ID!
  }
  UserNotFoundError: { // field return type
    message: string; // String!
  }
  ViewChangedPayload: { // field return type
    viewState: NexusGenEnums['ViewState']; // ViewState!
  }
  Votation: { // field return type
    alternatives: Array<NexusGenRootTypes['Alternative'] | null> | null; // [Alternative]
    blankVotes: boolean; // Boolean!
    description: string | null; // String
    hasVoted: Array<string | null> | null; // [String]
    hiddenVotes: boolean; // Boolean!
    id: string; // ID!
    index: number; // Int!
    majorityThreshold: number; // Int!
    meetingId: string; // String!
    numberOfWinners: number; // Int!
    order: number | null; // Int
    status: NexusGenEnums['VotationStatus']; // VotationStatus!
    title: string; // String!
    type: NexusGenEnums['VotationType']; // VotationType!
  }
  VotationResults: { // field return type
    alternatives: Array<NexusGenRootTypes['AlternativeResult'] | null>; // [AlternativeResult]!
    blankVoteCount: number; // Int!
    blankVotes: boolean; // Boolean!
    voteCount: number; // Int!
    votingEligibleCount: number; // Int!
  }
  VotationWithWinner: { // field return type
    alternatives: Array<NexusGenRootTypes['AlternativeWithWinner'] | null>; // [AlternativeWithWinner]!
    id: string; // ID!
  }
  Vote: { // field return type
    alternative: NexusGenRootTypes['Alternative'] | null; // Alternative
    alternativeId: string; // String!
    id: string; // ID!
  }
  VoteCountResult: { // field return type
    voteCount: number; // Int!
    votingEligibleCount: number; // Int!
  }
}

export interface NexusGenFieldTypeNames {
  Alternative: { // field return type name
    id: 'ID'
    text: 'String'
    votationId: 'String'
  }
  AlternativeResult: { // field return type name
    id: 'ID'
    isWinner: 'Boolean'
    text: 'String'
    votationId: 'String'
    votes: 'Int'
  }
  AlternativeWithWinner: { // field return type name
    id: 'ID'
    isWinner: 'Boolean'
    text: 'String'
  }
  MaxOneOpenVotationError: { // field return type name
    message: 'String'
  }
  Meeting: { // field return type name
    description: 'String'
    id: 'ID'
    organization: 'String'
    owner: 'User'
    participants: 'Participant'
    startTime: 'DateTime'
    status: 'MeetingStatus'
    title: 'String'
    votations: 'Votation'
  }
  Mutation: { // field return type name
    addParticipants: 'ParticipantOrInvite'
    castBlankVote: 'Int'
    castStvVote: 'String'
    castVote: 'Vote'
    changeView: 'ViewState'
    createAlternative: 'Alternative'
    createMeeting: 'Meeting'
    createVotations: 'Votation'
    deleteAlternatives: 'String'
    deleteMeeting: 'Meeting'
    deleteParticipants: 'String'
    deleteVotations: 'String'
    emailParticipants: 'String'
    updateAlternative: 'Alternative'
    updateMeeting: 'Meeting'
    updateVotationStatus: 'UpdateVotationStatusResult'
    updateVotations: 'Votation'
  }
  OwnerCannotBeRemovedFromParticipantError: { // field return type name
    message: 'String'
  }
  Participant: { // field return type name
    isVotingEligible: 'Boolean'
    role: 'Role'
    user: 'User'
  }
  ParticipantOrInvite: { // field return type name
    email: 'String'
    isVotingEligible: 'Boolean'
    role: 'Role'
  }
  Query: { // field return type name
    alternativesByVotation: 'Alternative'
    getOpenVotation: 'String'
    getVotationResults: 'VotationResults'
    getVoteCount: 'VoteCountResult'
    getWinnerOfVotation: 'Alternative'
    meetingById: 'Meeting'
    meetings: 'Meeting'
    participants: 'ParticipantOrInvite'
    resultsOfPublishedVotations: 'VotationWithWinner'
    user: 'GetUserResult'
    votationById: 'Votation'
  }
  Subscription: { // field return type name
    newVoteRegistered: 'Int'
    viewChanged: 'ViewState'
    votationOpenedForMeeting: 'String'
    votationStatusUpdated: 'VotationStatus'
  }
  User: { // field return type name
    email: 'String'
    emailVerified: 'Boolean'
    id: 'ID'
  }
  UserNotFoundError: { // field return type name
    message: 'String'
  }
  ViewChangedPayload: { // field return type name
    viewState: 'ViewState'
  }
  Votation: { // field return type name
    alternatives: 'Alternative'
    blankVotes: 'Boolean'
    description: 'String'
    hasVoted: 'String'
    hiddenVotes: 'Boolean'
    id: 'ID'
    index: 'Int'
    majorityThreshold: 'Int'
    meetingId: 'String'
    numberOfWinners: 'Int'
    order: 'Int'
    status: 'VotationStatus'
    title: 'String'
    type: 'VotationType'
  }
  VotationResults: { // field return type name
    alternatives: 'AlternativeResult'
    blankVoteCount: 'Int'
    blankVotes: 'Boolean'
    voteCount: 'Int'
    votingEligibleCount: 'Int'
  }
  VotationWithWinner: { // field return type name
    alternatives: 'AlternativeWithWinner'
    id: 'ID'
  }
  Vote: { // field return type name
    alternative: 'Alternative'
    alternativeId: 'String'
    id: 'ID'
  }
  VoteCountResult: { // field return type name
    voteCount: 'Int'
    votingEligibleCount: 'Int'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    addParticipants: { // args
      meetingId: string; // String!
      participants: NexusGenInputs['ParticipantInput'][]; // [ParticipantInput!]!
    }
    castBlankVote: { // args
      votationId: string; // String!
    }
    castStvVote: { // args
      alternatives: NexusGenInputs['StvVoteAlternativeInput'][]; // [StvVoteAlternativeInput!]!
      votationId: string; // String!
    }
    castVote: { // args
      alternativeId: string; // String!
    }
    changeView: { // args
      state: NexusGenEnums['ViewState']; // ViewState!
    }
    createAlternative: { // args
      text: string; // String!
      votationId: string; // String!
    }
    createMeeting: { // args
      meeting: NexusGenInputs['CreateMeetingInput']; // CreateMeetingInput!
    }
    createVotations: { // args
      meetingId: string; // String!
      votations: NexusGenInputs['CreateVotationInput'][]; // [CreateVotationInput!]!
    }
    deleteAlternatives: { // args
      ids: string[]; // [String!]!
    }
    deleteMeeting: { // args
      id: string; // String!
    }
    deleteParticipants: { // args
      emails: string[]; // [String!]!
      meetingId: string; // String!
    }
    deleteVotations: { // args
      ids: string[]; // [String!]!
    }
    emailParticipants: { // args
      meetingId: string; // String!
    }
    updateAlternative: { // args
      id: string; // String!
      text: string; // String!
    }
    updateMeeting: { // args
      meeting: NexusGenInputs['UpdateMeetingInput']; // UpdateMeetingInput!
    }
    updateVotationStatus: { // args
      status: NexusGenEnums['VotationStatus']; // VotationStatus!
      votationId: string; // String!
    }
    updateVotations: { // args
      votations: NexusGenInputs['UpdateVotationInput'][]; // [UpdateVotationInput!]!
    }
  }
  Query: {
    alternativesByVotation: { // args
      votationId: string; // String!
    }
    getOpenVotation: { // args
      meetingId: string; // String!
    }
    getVotationResults: { // args
      votationId: string; // String!
    }
    getVoteCount: { // args
      votationId: string; // String!
    }
    getWinnerOfVotation: { // args
      votationId: string; // String!
    }
    meetingById: { // args
      meetingId: string; // String!
    }
    participants: { // args
      meetingId: string; // String!
    }
    resultsOfPublishedVotations: { // args
      meetingId: string; // String!
    }
    votationById: { // args
      votationId: string; // String!
    }
  }
  Subscription: {
    newVoteRegistered: { // args
      votationId: string; // String!
    }
    votationOpenedForMeeting: { // args
      meetingId: string; // String!
    }
    votationStatusUpdated: { // args
      id: string; // String!
    }
  }
}

export interface NexusGenAbstractTypeMembers {
  DeleteParticipantResult: "OwnerCannotBeRemovedFromParticipantError" | "Participant"
  GetUserResult: "User" | "UserNotFoundError"
  UpdateVotationStatusResult: "MaxOneOpenVotationError" | "Votation"
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = keyof NexusGenUnions;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    __typename: true
    isTypeOf: false
    resolveType: false
  }
}

export interface NexusGenTypes {
  context: Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}
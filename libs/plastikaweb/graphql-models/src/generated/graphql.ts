import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type Query = {
  __typename?: 'Query';
  skills?: Maybe<Skills>;
};

export type SkillData = {
  __typename?: 'SkillData';
  skillMainUrl?: Maybe<Scalars['String']['output']>;
};

export type SkillNode = {
  __typename?: 'SkillNode';
  excerpt?: Maybe<Scalars['String']['output']>;
  skillsData?: Maybe<SkillData>;
  title?: Maybe<Scalars['String']['output']>;
};

export type Skills = {
  __typename?: 'Skills';
  nodes?: Maybe<Array<Maybe<SkillNode>>>;
};

export type GetSkillsQueryVariables = Exact<{ [key: string]: never }>;

export type GetSkillsQuery = {
  __typename?: 'Query';
  skills?: {
    __typename?: 'Skills';
    nodes?: Array<{
      __typename?: 'SkillNode';
      title?: string | null;
      excerpt?: string | null;
      skillsData?: { __typename?: 'SkillData'; skillMainUrl?: string | null } | null;
    } | null> | null;
  } | null;
};

export const GetSkillsDocument = gql`
  query GetSkills {
    skills {
      nodes {
        title
        excerpt
        skillsData {
          skillMainUrl
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetSkillsGQL extends Apollo.Query<GetSkillsQuery, GetSkillsQueryVariables> {
  document = GetSkillsDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}

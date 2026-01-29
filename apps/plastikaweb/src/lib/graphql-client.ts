import { GraphQLClient, gql } from 'graphql-request';

const endpoint = 'http://plastikaweb.local/graphql';
const client = new GraphQLClient(endpoint);

const GET_SKILLS = gql`
  query GetSkills {
    skills {
      nodes {
        id
        title
        excerpt
        skillsData {
          skillMainUrl
        }
      }
    }
  }
`;

interface SkillNode {
  id: string;
  title: string;
  excerpt: string;
  skillsData?: {
    skillMainUrl?: string;
  };
}

interface GetSkillsQuery {
  skills?: {
    nodes: (SkillNode | null)[];
  };
}

/**
 * @description Fetches skills data from the GraphQL endpoint.
 * @returns { Promise<GetSkillsQuery> } A promise that resolves to the skills data.
 */
export async function getSkills(): Promise<GetSkillsQuery> {
  try {
    return await client.request<GetSkillsQuery>(GET_SKILLS);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('GraphQL endpoint not available, using empty data', error);
    return { skills: { nodes: [] } };
  }
}

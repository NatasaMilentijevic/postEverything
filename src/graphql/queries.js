/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getStatus = /* GraphQL */ `
  query GetStatus($id: ID!) {
    getStatus(id: $id) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const listStatuss = /* GraphQL */ `
  query ListStatuss(
    $filter: ModelStatusFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStatuss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

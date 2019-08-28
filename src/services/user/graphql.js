import Controller from './controller';
import { checkAuthorization } from '../../utils/auth';

export const schemas = `
  extend type Query {
    me: User!
    users: [User]!
    searchByTerm(term: String!): [User!]
  }
  extend type Mutation {
    auth(input: AuthInput!): AuthData!
    createUser(input: CreateUserInput!): User
  }
  input AuthInput {
    email: String!
    password: String!
  }
  input CreateUserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }
  type AuthData {
    token: String!
  }
  type User {
    id: Int
    firstName: String
    lastName: String
    email: String
    createdAt: Date
  }
`;

export const resolvers = {
  Query: {
    me: (_, __, { auth }) => {
      checkAuthorization(auth);
      return { ...auth.user };
    },
    users: (_, __, context) => {
      checkAuthorization(context.auth);
      return Controller.getUsers(context);
    },
    searchByTerm: (_, { term }, { auth }) => {
      checkAuthorization(auth);
      return Controller.searchByTerm(term);
    },
  },
  Mutation: {
    auth: (_, args, context) => {
      return Controller.authenticate(args, context);
    },
    createUser: (_, args, context) => {
      return Controller.createUser(args, context);
    },
  },
};

export default {
  schemas, resolvers,
};

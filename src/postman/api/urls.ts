/* eslint-disable camelcase */
const postmanHostname = 'https://api.getpostman.com'
const collectionsEndpoints = {
  allCollections: `${postmanHostname}/collections`,
  singleCollection: (collection_uid: string): string =>
    `${postmanHostname}/collections/${collection_uid}`,
  createCollection: `${postmanHostname}/collections`,
  updateCollection: (collection_uid: string): string =>
    `${postmanHostname}/collections/${collection_uid}`,
  deleteCollection: (collection_uid: string): string =>
    `${postmanHostname}/collections/${collection_uid}`,
  createFork: (collection_uid: string, workspace_id: string): string =>
    `${postmanHostname}/collections/fork/${collection_uid}?workspace=${workspace_id}`,
  mergeFork: `${postmanHostname}/collections/merge`,
}

const workspacesEndpoints = {
  allWorkspaces: `${postmanHostname}/workspaces`,

  singleWorkspace: (workspace_id: string): string =>
    `${postmanHostname}/workspaces/${workspace_id}`,
  createWorkspace: `${postmanHostname}/workspaces`,
  updateWorkspace: (workspace_id: string): string =>
    `${postmanHostname}/workspaces/${workspace_id}`,
  deleteWorkspace: (workspace_id: string): string =>
    `${postmanHostname}/workspaces/${workspace_id}`,
}

const environmentsEndpoints = {
  allEnvironments: `${postmanHostname}/environments`,
  singleEnvironment: (environment_uid: string): string =>
    `${postmanHostname}/environments/${environment_uid}`,
  createEnvironment: `${postmanHostname}/environments`,
  updateEnvironment: (environment_uid: string): string =>
    `${postmanHostname}/environments/${environment_uid}`,
  deleteEnvironment: (environment_uid: string) =>
    `${postmanHostname}/environments/${environment_uid}`,
}

const monitorsEndpoints = {
  allMonitors: `${postmanHostname}/monitors`,
  singleMonitor: (monitor_uid: string) =>
    `${postmanHostname}/monitors/${monitor_uid}`,
  runMonitor: (monitor_uid: string) =>
    `${postmanHostname}/monitors/${monitor_uid}/run`,
}

const mocksEndpoints = {
  allMocks: `${postmanHostname}/mocks`,
  singleMock: (mock_uid: string) => `${postmanHostname}/mocks/${mock_uid}`,
}

const importEndpoints = {
  importExportedData: `${postmanHostname}/import/exported`,
}

const forkEndpoints = {}

const PostmanAPIUrls = {
  collections: collectionsEndpoints,
  workspaces: workspacesEndpoints,
  environments: environmentsEndpoints,
  monitors: monitorsEndpoints,
  mocks: mocksEndpoints,
  import: importEndpoints,
  fork: forkEndpoints,
}

export default PostmanAPIUrls

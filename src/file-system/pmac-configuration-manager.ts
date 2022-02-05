// eslint-disable-next-line unicorn/prefer-node-protocol
import fs from 'fs'
// eslint-disable-next-line unicorn/prefer-node-protocol
import path from 'path'
import { PostmanEnvironment, PostmanMock, PostmanMonitor } from '../postman/api/types'
import {
  PostmanCollection,
} from '../postman/api/types/collection.types'
import {
  PostmanWorkspace,
  PostmanWorkspaceMetadata,
  WorkspaceResource,
  WorkspaceType,
} from '../postman/api/types/workspace.types'
import { globMultiPromise, globPromise, type GlobPromiseOptions } from './glob-promise'

interface PmacOptions {
  /** Force to overwrite */
  force?: boolean;
}

export default class PmacConfigurationManager {
  /** Gets client's working directory */
  private REPOSITORY_ROOT_FOLDER_PATH = path.resolve('.');

  PMAC_LIB_NAME = 'pmac'
  PMAC_FOLDER_NAME = `.${this.PMAC_LIB_NAME}`;
  private PMAC_FOLDER_PATH = `${this.REPOSITORY_ROOT_FOLDER_PATH}/${this.PMAC_FOLDER_NAME}`;
  private WORKSPACES_FOLDER_NAME = 'workspaces';
  private WORKSPACES_FOLDER_PATH = `${this.PMAC_FOLDER_PATH}/${this.WORKSPACES_FOLDER_NAME}`;

  private PRIVATE_CONFIG_FILE_NAME = 'private.json';
  private PRIVATE_CONFIG_FILE_PATH = `${this.PMAC_FOLDER_PATH}/${this.PRIVATE_CONFIG_FILE_NAME}`;

  private PERSONAL_WORKSPACES_FOLDER_PATH = `${this.WORKSPACES_FOLDER_PATH}/${WorkspaceType.Personal}`;
  private TEAM_WORKSPACES_FOLDER_PATH = `${this.WORKSPACES_FOLDER_PATH}/${WorkspaceType.Team}`;

  // Workspace structure constants
  private WORKSPACE_METADATA_FILE_NAME = 'workspace.json';
  private POSTMAN_RESOURCE_PREFIX = 'postman_';
  private ALL_COLLECTIONS_PATTERN = `${WorkspaceResource.Collection}s/*.${this.POSTMAN_RESOURCE_PREFIX}${WorkspaceResource.Collection}.json`;
  private ALL_ENVIRONMENT_PATTERN = `${WorkspaceResource.Environment}s/*.${this.POSTMAN_RESOURCE_PREFIX}${WorkspaceResource.Environment}.json`;

  allResourcesByNamePattern(type: WorkspaceResource, name: string): string {
    return `${type}s/${name}${this.W_RESOURCE_UID_PATTERN}*`
  }

  // Errors

  private PMAC_NOT_FOUND_ERROR = new Error(
    `${this.PMAC_LIB_NAME} not initialized, please use 'pmac init' to start using pmac.`,
  );

  private PMAC_WORKSPACE_ALREADY_EXISTS_ERROR = new Error(
    `${this.PMAC_LIB_NAME} Workspace name already exists.`,
  );

  private PMAC_W_RESOURCE_ALREADY_EXISTS_ERROR = new Error(
    `${this.PMAC_LIB_NAME} resource already exists.`,
  );

  private PMAC_PRIVATE_ALREADY_EXISTS_ERROR = new Error(
    `${this.PMAC_LIB_NAME} private configuration already exists.`,
  );

  private PMAC_ALREADY_INITIALIZED_ERROR = new Error(
    `${this.PMAC_LIB_NAME} already initialized, you can turn 'force' flag to overwrite existing configuration.`,
  );

  // Utils

  private readJsonFileSync(
    path: fs.PathLike | number,
    options?:
      |BufferEncoding | {
        encoding: BufferEncoding;
        flag?: string | undefined;
    },
  ) {
    return JSON.parse(fs.readFileSync(path, options || 'utf8'))
  }

  private writeJsonFileSync(
    path: number | fs.PathLike,
    data: any,
    options?: fs.WriteFileOptions | undefined,
  ) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2), options || 'utf8')
  }

  private renameSync(oldPath: fs.PathLike, newPath: fs.PathLike) {
    fs.renameSync(oldPath, newPath)
  }

  // Actions

  init(options?:PmacOptions): void {
    this.createPmacDir(options)
    this.createPmacWorkspacesDir()
    this.createPmacPersonalWorkspacesDir()
    this.createPmacTeamWorkspacesDir()
    this.createPmacPrivateConfig()
  }

  exists(): boolean {
    return fs.existsSync(this.PMAC_FOLDER_PATH)
  }

  // Configuration Basic Structure

  createPmacDir(options?:PmacOptions): void {
    if (options?.force) {
      fs.rmSync(this.PMAC_FOLDER_PATH, { recursive: true, force: true })
    } else if (this.exists()) {
      throw this.PMAC_ALREADY_INITIALIZED_ERROR
    }

    fs.mkdirSync(this.PMAC_FOLDER_PATH)
  }

  createPmacWorkspacesDir(): void {
    fs.mkdirSync(this.WORKSPACES_FOLDER_PATH)
  }

  createPmacPrivateConfig(): void {
    if (fs.existsSync(this.PRIVATE_CONFIG_FILE_PATH)) {
      throw this.PMAC_PRIVATE_ALREADY_EXISTS_ERROR
    }

    const initialPrivate = {
      apiKey: '',
    }

    this.writeJsonFileSync(this.PRIVATE_CONFIG_FILE_PATH, initialPrivate)

    // Append .gitignore
    const gitIgnorePattern = this.getPmacGitIgnorePattern(this.PRIVATE_CONFIG_FILE_NAME)
    this.appendGitIgnore(gitIgnorePattern)
  }

  private getPmacGitIgnorePattern(pattern: string): string {
    return `/${this.PMAC_FOLDER_NAME}/${pattern}`
  }

  private GIT_IGNORE_FILE_PATH = `${this.REPOSITORY_ROOT_FOLDER_PATH}/.gitignore`
  private appendGitIgnore(patternToAppend: string) {
    // check private
    // check personal
    // check comment

    if (!fs.existsSync(this.GIT_IGNORE_FILE_PATH)) {
      // no .gitignore, not appending.
      return
    }

    let content = fs.readFileSync(this.GIT_IGNORE_FILE_PATH, 'utf8')

    const GIT_IGNORE_PMAC_COMMENT = `# ${this.PMAC_FOLDER_NAME}`

    if (!content.includes(GIT_IGNORE_PMAC_COMMENT)) {
      fs.appendFileSync(this.GIT_IGNORE_FILE_PATH, `\n\n${GIT_IGNORE_PMAC_COMMENT}`)
      // re-read content with the new comment
      content = fs.readFileSync(this.GIT_IGNORE_FILE_PATH, 'utf8')
    }

    // check for if the pattern existing and followed by a line break
    const patternRegexString = `${patternToAppend}(?=\n)`
    const patternRegex = new RegExp(patternRegexString)

    if (!patternRegex.test(content)) {
      const appendPosition =
      content.indexOf(GIT_IGNORE_PMAC_COMMENT) +
      GIT_IGNORE_PMAC_COMMENT.length

      const textAfterPmacComment = content.slice(Math.max(0, appendPosition))

      const file = fs.openSync(this.GIT_IGNORE_FILE_PATH, 'r+')
      const bufferedText = Buffer.from(`\n${patternToAppend}` + textAfterPmacComment)

      fs.writeSync(file, bufferedText, 0, bufferedText.length, appendPosition)
      fs.closeSync(file)
    }
  }

  // User Settings

  saveApiKey(apiKey: string): void {
    const privateJson = this.readJsonFileSync(this.PRIVATE_CONFIG_FILE_PATH)

    privateJson.apiKey = apiKey

    this.writeJsonFileSync(this.PRIVATE_CONFIG_FILE_PATH, privateJson)
  }

  deleteApiKey(): void {
    const privateJson = this.readJsonFileSync(this.PRIVATE_CONFIG_FILE_PATH)
    delete privateJson.apiKey

    this.writeJsonFileSync(this.PRIVATE_CONFIG_FILE_PATH, privateJson)
  }

  getPrivate(): { apiKey?: string } {
    return this.readJsonFileSync(this.PRIVATE_CONFIG_FILE_PATH)
  }

  isPrivateExists(): boolean {
    return fs.existsSync(this.PRIVATE_CONFIG_FILE_PATH)
  }

  // Workspaces

  public workspacePersonalPattern(workspaceName: string): string {
    return `${this.WORKSPACES_FOLDER_PATH}/${WorkspaceType.Personal}/${workspaceName}${this.WORKSPACE_ID_PATTERN}*`
  }

  public workspaceTeamPattern(workspaceName: string): string {
    return `${this.WORKSPACES_FOLDER_PATH}/${WorkspaceType.Team}/${workspaceName}${this.WORKSPACE_ID_PATTERN}*`
  }

  async getWorkspacesPathsByName(workspaceName: string, type?: WorkspaceType, options: GlobPromiseOptions = {}): Promise<{ workspacesPaths: string[]; }> {
    const patterns = []
    const personalPattern = this.workspacePersonalPattern(workspaceName)
    const teamPattern = this.workspaceTeamPattern(workspaceName)

    if (type === WorkspaceType.Personal) {
      patterns.push(personalPattern)
    } else if (type === WorkspaceType.Team) {
      patterns.push(teamPattern)
    } else {
      patterns.push(personalPattern, teamPattern)
    }

    const matches = await globMultiPromise(patterns, options)

    return { workspacesPaths: matches }
  }

  async getWorkspacesPaths(type?: WorkspaceType): Promise<{ workspacesPaths: string[]; }> {
    const patterns = []
    const personalPattern = `${this.WORKSPACES_FOLDER_PATH}/${WorkspaceType.Personal}/**/${this.WORKSPACE_METADATA_FILE_NAME}`
    const teamPattern = `${this.WORKSPACES_FOLDER_PATH}/${WorkspaceType.Team}/**/${this.WORKSPACE_METADATA_FILE_NAME}`

    if (type === WorkspaceType.Personal) {
      patterns.push(personalPattern)
    } else if (type === WorkspaceType.Team) {
      patterns.push(teamPattern)
    } else {
      patterns.push(personalPattern, teamPattern)
    }

    const matches = await globMultiPromise(patterns)

    return { workspacesPaths: matches }
  }

  async getWorkspaces(type?: WorkspaceType): Promise<{ localWorkspaces: PostmanWorkspace[]; }> {
    const { workspacesPaths } = await this.getWorkspacesPaths(type)
    const workspaces: PostmanWorkspace[] = []
    for (const match of workspacesPaths) {
      workspaces.push(this.readJsonFileSync(match))
    }

    return { localWorkspaces: workspaces }
  }

  workspaceIdConvention(id: string): string {
    return `${this.WORKSPACE_ID_PATTERN}${id}`
  }

  workspaceNameConvention(name: string, id: string): string {
    return `${name}${this.workspaceIdConvention(id)}`
  }

  getWorkspacePath(workspaceMetadata: PostmanWorkspaceMetadata): string {
    const { id, name, type } = workspaceMetadata
    const idConvention = this.workspaceIdConvention(id)
    return `${this.WORKSPACES_FOLDER_PATH}/${type}/${name}${idConvention}`
  }

  async renameWorkspaceDir(workspaceMetadata: PostmanWorkspaceMetadata): Promise<void> {
    // const workspacePath = this.getWorkspacePath(workspaceMetadata);

    const basePath =
      workspaceMetadata.type === WorkspaceType.Personal ?
        this.PERSONAL_WORKSPACES_FOLDER_PATH :
        this.TEAM_WORKSPACES_FOLDER_PATH

    const idPattern = this.workspaceIdConvention(workspaceMetadata.id)
    const pattern = `${basePath}/*${idPattern}`

    const [oldWorkspacePath] = await globPromise(pattern)

    const newWorkspacePath = this.getWorkspacePath(workspaceMetadata)
    if (oldWorkspacePath && oldWorkspacePath !== newWorkspacePath) {
      this.renameSync(oldWorkspacePath, newWorkspacePath)
    }
  }

  private getWorkspaceMetadataFilePath(
    workspaceMetadata: PostmanWorkspaceMetadata,
  ) {
    return `${this.getWorkspacePath(workspaceMetadata)}/${
      this.WORKSPACE_METADATA_FILE_NAME
    }`
  }

  getWorkspace(workspaceMetadata: PostmanWorkspaceMetadata): PostmanWorkspace {
    const workspaceJsonPath =
      this.getWorkspaceMetadataFilePath(workspaceMetadata)
    if (!fs.existsSync(workspaceJsonPath)) {
      throw new Error(`No workspace found at '${workspaceJsonPath}'.`)
    }

    return this.readJsonFileSync(workspaceJsonPath)
  }

  getWorkspaceByPath(path: string): PostmanWorkspace {
    const workspacesSplit = path.split(this.WORKSPACES_FOLDER_NAME)[1].split('/')
    const workspaceType = workspacesSplit[1] as WorkspaceType
    const workspaceIdentifier = workspacesSplit[2]
    const [name, id] = workspaceIdentifier
    .replace(/[[\]]/g, '')
    .replace(/id:/g, '')
    .split(' ')
    // const workspaceName = workspacesSplit[2]

    return this.getWorkspace({ name, id, type: workspaceType })
  }

  getWorkspacesByPath(paths: string[]): PostmanWorkspace[] {
    return paths.map(path => this.getWorkspaceByPath(path))
  }

  deleteWorkspace(workspaceMetadata: PostmanWorkspaceMetadata): { deletedWorkspace: PostmanWorkspaceMetadata; } {
    const workspaceDir = this.getWorkspacePath(workspaceMetadata)
    fs.rmSync(workspaceDir, { recursive: true, force: true })

    return { deletedWorkspace: workspaceMetadata }
  }

  createWorkspaceDir(workspace: PostmanWorkspace, options: { force?: boolean } = {}): void {
    try {
      if (!this.exists()) {
        throw this.PMAC_NOT_FOUND_ERROR
      }

      // create root workspaces type dir
      if (workspace.type === WorkspaceType.Personal) {
        this.createPmacPersonalWorkspacesDir()
      } else {
        this.createPmacTeamWorkspacesDir()
      }

      const workspaceDir = this.getWorkspacePath(workspace)

      if (options.force) {
        fs.rmSync(workspaceDir, { recursive: true, force: true })
      }

      if (fs.existsSync(workspaceDir)) {
        throw new Error(`Workspace with name '${workspace}' already exists.`)
      } else {
        fs.mkdirSync(workspaceDir)
        this.writeWorkspaceData(workspace)
        fs.mkdirSync(`${workspaceDir}/${WorkspaceResource.Collection}s`)
        fs.mkdirSync(`${workspaceDir}/${WorkspaceResource.Environment}s`)
        fs.mkdirSync(`${workspaceDir}/${WorkspaceResource.Monitor}s`)
        fs.mkdirSync(`${workspaceDir}/${WorkspaceResource.Mock}s`)
      }
    } catch (error) {
      console.error(error)
    }
  }

  writeWorkspaceData(workspace: PostmanWorkspace): void {
    const workspaceJsonPath = this.getWorkspaceMetadataFilePath(workspace)
    this.writeJsonFileSync(workspaceJsonPath, workspace)
  }

  private GIT_IGNORE_PERSONAL_WORKSPACES_PATTERN = 'workspaces/personal'

  createPmacPersonalWorkspacesDir(): void {
    if (!this.exists()) {
      throw this.PMAC_NOT_FOUND_ERROR
    } else if (fs.existsSync(this.PERSONAL_WORKSPACES_FOLDER_PATH)) {
      return
    }

    fs.mkdirSync(this.PERSONAL_WORKSPACES_FOLDER_PATH)

    // .gitignore
    const gitIgnorePattern = this.getPmacGitIgnorePattern(this.GIT_IGNORE_PERSONAL_WORKSPACES_PATTERN)
    this.appendGitIgnore(gitIgnorePattern)
  }

  createPmacTeamWorkspacesDir(): void {
    if (!this.exists()) {
      throw this.PMAC_NOT_FOUND_ERROR
    } else if (fs.existsSync(this.TEAM_WORKSPACES_FOLDER_PATH)) {
      return
    }

    fs.mkdirSync(this.TEAM_WORKSPACES_FOLDER_PATH)
  }

  // Get Resources

  private async getWorkspaceCollectionsPaths(
    workspaceMetadata: PostmanWorkspaceMetadata,
  ) {
    return this.getWorkspaceResourcesPaths(
      workspaceMetadata,
      this.ALL_COLLECTIONS_PATTERN,
    )
  }

  getResourcePath(
    workspaceMetadata: PostmanWorkspaceMetadata,
    resourceType: WorkspaceResource,
    resourceName: string,
  ): string {
    const workspacePath = this.getWorkspacePath(workspaceMetadata)
    return `${workspacePath}/${resourceType}s/${resourceName}.${this.POSTMAN_RESOURCE_PREFIX}${resourceType}.json`
  }

  getResourceFileName(resourceType: WorkspaceResource, resourceName: string): string {
    return `${resourceName}.${this.POSTMAN_RESOURCE_PREFIX}${resourceType}.json`
  }

  async updateEnvironment(
    workspaceMetadata: PostmanWorkspaceMetadata,
    updatedEnvironment: PostmanEnvironment,
    resourceType: WorkspaceResource,
    resourceName: string,
  ): Promise<void> {
    const envsPaths = await this.getWorkspaceEnvironmentsPaths(
      workspaceMetadata,
    )

    for (const path of envsPaths) {
      const parts = path.split('/')
      const oldFileName = parts[parts.length - 1]

      parts.pop()
      const pathWithOutFileName = parts.join('/')

      const oldFileNameParts = oldFileName.split('-')
      oldFileNameParts.shift()
      const envId = oldFileNameParts.join('-')

      if (envId === updatedEnvironment.id) {
        const resourceFileName = this.getResourceFileName(
          resourceType,
          resourceName,
        )
        const newPath = `${pathWithOutFileName}/${resourceFileName}`
        this.renameSync(path, newPath)
        return
      }
    }
  }

  private async getWorkspaceEnvironmentsPaths(
    workspaceMetadata: PostmanWorkspaceMetadata,
  ) {
    return this.getWorkspaceResourcesPaths(
      workspaceMetadata,
      this.ALL_ENVIRONMENT_PATTERN,
    )
  }

  async getWorkspaceResourcesPaths(
    workspaceMetadata: PostmanWorkspaceMetadata,
    pattern: string,
    options: GlobPromiseOptions = {},
  ): Promise<string[]> {
    const workspaceResourcePattern = `${this.getWorkspacePath(
      workspaceMetadata,
    )}/${pattern}`
    const resourcesPaths = await globPromise(workspaceResourcePattern, options)

    return resourcesPaths
  }

  private async getWorkspaceResources<T = any>(
    workspaceMetadata: PostmanWorkspaceMetadata,
    resourcesPattern: string,
  ) {
    const paths = await this.getWorkspaceResourcesPaths(
      workspaceMetadata,
      resourcesPattern,
    )

    const resources: T[] = []
    for (const path of paths) {
      resources.push(this.readJsonFileSync(path))
    }

    return resources
  }

  async getWorkspaceEnvironments(workspaceMetadata: PostmanWorkspaceMetadata): Promise<{ localEnvironments: PostmanEnvironment[]; }> {
    const localEnvironments =
      await this.getWorkspaceResources<PostmanEnvironment>(
        workspaceMetadata,
        this.ALL_ENVIRONMENT_PATTERN,
      )
    return { localEnvironments }
  }

  private collectionPatternRegex = new RegExp(
    // \/.*\/collections\/.*\.postman_.*\.json
    `(${WorkspaceType.Personal}|${WorkspaceType.Team})/.*/${WorkspaceResource.Collection}s/.*.${this.POSTMAN_RESOURCE_PREFIX}.*.json`,
  );

  private environmentPatternRegex = new RegExp(
    `(${WorkspaceType.Personal}|${WorkspaceType.Team})/.*/${WorkspaceResource.Environment}s/.*.${this.POSTMAN_RESOURCE_PREFIX}.*.json`,
  );

  private pmacResourceNotFound = new Error(
    "pmac resource not found, check if exists and consider to run 'pmac pull'.",
  );

  getCollectionByPath(path: string): PostmanCollection {
    if (!this.collectionPatternRegex.test(path)) {
      throw this.pmacResourceNotFound
    }

    return this.readJsonFileSync(path)
  }

  getEnvironmentByPath(path: string): PostmanEnvironment {
    if (!this.environmentPatternRegex.test(path)) {
      throw this.pmacResourceNotFound
    }

    return this.readJsonFileSync(path)
  }

  getCollectionsByPaths(paths: string[]): PostmanCollection[] {
    return paths.map(path => this.getCollectionByPath(path))
  }

  async getWorkspaceCollections(workspaceMetadata: PostmanWorkspaceMetadata): Promise<{ localCollections: PostmanCollection[]; }> {
    const localCollections =
      await this.getWorkspaceResources<PostmanCollection>(
        workspaceMetadata,
        this.ALL_COLLECTIONS_PATTERN,
      )
    return { localCollections }
  }

  public W_RESOURCE_UID_PATTERN = '_uid_'
  public WORKSPACE_ID_PATTERN = '_id_'

  private resourceUidConvention(uid: string) {
    return `${this.W_RESOURCE_UID_PATTERN}${uid}`
  }

  resourceNameConvention(name: string, uid: string): string {
    return `${name}${this.resourceUidConvention(uid)}`
  }

  // Write Resources
  private writeWorkspaceResource(
    workspaceMetadata: PostmanWorkspaceMetadata,
    resourceData: any,
    resourceUid: string,
    resourceType: WorkspaceResource,
    options:PmacOptions = {},
  ) {
    if (!this.exists()) {
      throw this.PMAC_NOT_FOUND_ERROR
    }

    const workspaceDir = this.getWorkspacePath(workspaceMetadata)
    const resourceName = resourceData.name || resourceData.info.name

    // postman allow duplication names
    const resourcePmacName = this.resourceNameConvention(
      resourceName,
      resourceUid,
    )

    const path = `${workspaceDir}/${resourceType}s/${resourcePmacName}.${this.POSTMAN_RESOURCE_PREFIX}${resourceType}.json`

    if (fs.existsSync(path) && !options.force) {
      throw this.PMAC_W_RESOURCE_ALREADY_EXISTS_ERROR
    }

    this.writeJsonFileSync(path, resourceData)
  }

  async getCollection(
    workspaceMetadata: PostmanWorkspaceMetadata,
    uid: string,
  ): Promise<{ collection: PostmanCollection; }> {
    const workspacePath = this.getWorkspacePath(workspaceMetadata)

    const resourcePattern = this.resourceUidConvention(uid)
    const pattern = `${workspacePath}/${WorkspaceResource.Collection}s/*${resourcePattern}.${this.POSTMAN_RESOURCE_PREFIX}${WorkspaceResource.Collection}.json`

    const [resourcePath] = await globPromise(pattern)
    return { collection: this.getCollectionByPath(resourcePath) }
  }

  async getEnvironment(
    workspaceMetadata: PostmanWorkspaceMetadata,
    uid: string,
  ): Promise<{ environment: PostmanEnvironment; }> {
    const workspacePath = this.getWorkspacePath(workspaceMetadata)

    const resourcePattern = this.resourceUidConvention(uid)
    const pattern = `${workspacePath}/${WorkspaceResource.Environment}s/*${resourcePattern}.${this.POSTMAN_RESOURCE_PREFIX}${WorkspaceResource.Environment}.json`

    const [resourcePath] = await globPromise(pattern)
    return { environment: this.getEnvironmentByPath(resourcePath) }
  }

  private async deleteWorkspaceResource(
    workspaceMetadata: PostmanWorkspaceMetadata,
    uid: string,
    resourceType: WorkspaceResource,
  ) {
    const workspacePath = this.getWorkspacePath(workspaceMetadata)

    const resourcePattern = this.resourceUidConvention(uid)
    const pattern = `${workspacePath}/${resourceType}s/*${resourcePattern}.${this.POSTMAN_RESOURCE_PREFIX}${resourceType}.json`

    const [resourcePath] = await globPromise(pattern)

    if (resourcePath) {
      fs.rmSync(resourcePath)
    }
  }

  async deleteEnvironmentResource(
    workspaceMetadata: PostmanWorkspaceMetadata,
    environmentUid: string,
  ): Promise<void> {
    await this.deleteWorkspaceResource(
      workspaceMetadata,
      environmentUid,
      WorkspaceResource.Environment,
    )
  }

  async deleteCollectionResource(
    workspaceMetadata: PostmanWorkspaceMetadata,
    collectionUid: string,
  ): Promise<void> {
    await this.deleteWorkspaceResource(
      workspaceMetadata,
      collectionUid,
      WorkspaceResource.Collection,
    )
  }

  writeCollectionResource(
    workspaceMetadata: PostmanWorkspaceMetadata,
    collectionUid: string,
    collection: PostmanCollection,
    options:PmacOptions = {},
  ): void {
    this.writeWorkspaceResource(
      workspaceMetadata,
      collection,
      collectionUid,
      WorkspaceResource.Collection,
      options,
    )
  }

  writeEnvironmentResource(
    workspaceMetadata: PostmanWorkspaceMetadata,
    environmentUid: string,
    environment: PostmanEnvironment,
  ): void {
    this.writeWorkspaceResource(
      workspaceMetadata,
      environment,
      environmentUid,
      WorkspaceResource.Environment,
    )
  }

  writeMonitorResource(
    workspaceMetadata: PostmanWorkspaceMetadata,
    monitorUid: string,
    monitor: PostmanMonitor,
  ): void {
    this.writeWorkspaceResource(
      workspaceMetadata,

      monitor,
      monitorUid,
      WorkspaceResource.Monitor,
    )
  }

  writePmacMock(
    workspaceMetadata: PostmanWorkspaceMetadata,
    mockUid: string,
    mock: PostmanMock,
  ): void {
    this.writeWorkspaceResource(
      workspaceMetadata,
      mock,
      mockUid,
      WorkspaceResource.Mock,
    )
  }
}

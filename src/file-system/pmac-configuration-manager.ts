// import { fileURLToPath } from 'url';
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
// const __dirname = dirname(fileURLToPath(import.meta.url));

interface PmacOptions {
  /** Force to overwrite */
  force?: boolean;
}

export default class PmacConfigurationManager {
  /** Gets client's working directory */
  private repositoryWorkspaceDir = path.resolve('./');

  private pmacDir = `${this.repositoryWorkspaceDir}/.pmac`;
  private workspacesDirName = 'workspaces';
  private workspacesDir = `${this.pmacDir}/${this.workspacesDirName}`;

  private privateConfigFile = 'private.json';
  private privateConfigFilePath = `${this.pmacDir}/${this.privateConfigFile}`;

  private personalWorkspacesDir = `${this.workspacesDir}/${WorkspaceType.Personal}`;
  private teamWorkspacesDir = `${this.workspacesDir}/${WorkspaceType.Team}`;

  // Workspace structure constants
  private workspaceMetadataFileName = 'workspace.json';
  private postmanResourcePrefix = 'postman_';
  private collectionsPattern = `${WorkspaceResource.Collection}s/*.${this.postmanResourcePrefix}${WorkspaceResource.Collection}.json`;
  private environmentsPattern = `${WorkspaceResource.Environment}s/*.${this.postmanResourcePrefix}${WorkspaceResource.Environment}.json`;

  // Errors

  private pmacNotFoundError = new Error(
    "pmac not initialized, please use 'pmac init' to start usingpmac.",
  );

  private pmacWorkspaceAlreadyExists = new Error(
    'Workspace name already exists.',
  );

  private pmacResourceAlreadyExistsError = new Error(
    '.pmac resource already exists.',
  );

  private pmacPrivateAlreadyExists = new Error(
    '.pmac private configuration already exists.',
  );

  private pmacAlreadyInitialized = new Error(
    ".pmac already initialized, you can turn 'force' flag to overwrite existing configuration.",
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
    return fs.existsSync(this.pmacDir)
  }

  // Configuration Basic Structure

  createPmacDir(options?:PmacOptions) {
    if (options?.force) {
      fs.rmSync(this.pmacDir, { recursive: true, force: true })
    } else if (this.exists()) {
      throw this.pmacAlreadyInitialized
    }

    fs.mkdirSync(this.pmacDir)
  }

  createPmacWorkspacesDir() {
    fs.mkdirSync(this.workspacesDir)
  }

  createPmacPrivateConfig() {
    if (fs.existsSync(this.privateConfigFilePath)) {
      throw this.pmacPrivateAlreadyExists
    }

    const initialPrivate = {
      apiKey: '',
    }
    fs.writeFileSync(
      this.privateConfigFilePath,
      JSON.stringify(initialPrivate, null, 2),
      'utf8',
    )
    // Append .gitignore
    const gitIgnorePattern = this.getGitIgnorePattern(this.privateConfigFile)
    this.appendGitIgnore(gitIgnorePattern)
  }

  private getGitIgnorePattern(pattern: string) {
    return `/.pmac/${pattern}`
  }

  private appendGitIgnore(patternToAppend: string) {
    const gitIgnorePath = `${this.repositoryWorkspaceDir}/.gitignore`

    if (!fs.existsSync(gitIgnorePath)) {
      // no .gitignore, not appending.
      return
    }

    const fileContent = fs.readFileSync(gitIgnorePath, 'utf8')
    const GIT_IGNORE_PMAC_COMMENT = '# .pmac configuration'
    if (!fileContent.includes(GIT_IGNORE_PMAC_COMMENT)) {
      fs.appendFileSync(gitIgnorePath, `\n${GIT_IGNORE_PMAC_COMMENT}`)
    }

    const appendPosition =
      fileContent.indexOf(GIT_IGNORE_PMAC_COMMENT) +
      GIT_IGNORE_PMAC_COMMENT.length

    const sub = fileContent.slice(Math.max(0, appendPosition))

    const file = fs.openSync(gitIgnorePath, 'r+')
    const bufferedText = Buffer.from(`\n${patternToAppend}` + sub)

    fs.writeSync(file, bufferedText, 0, bufferedText.length, appendPosition)
    fs.closeSync(file)
  }

  // User Settings

  saveApiKey(apiKey: string): void {
    const privateJson = this.readJsonFileSync(this.privateConfigFilePath)

    privateJson.apiKey = apiKey

    this.writeJsonFileSync(this.privateConfigFilePath, privateJson)
  }

  deleteApiKey() {
    const privateJson = this.readJsonFileSync(this.privateConfigFilePath)
    delete privateJson.apiKey

    this.writeJsonFileSync(this.privateConfigFilePath, privateJson)
  }

  getPrivate(): { apiKey?: string } {
    return this.readJsonFileSync(this.privateConfigFilePath)
  }

  isPrivateExists(): boolean {
    return fs.existsSync(this.privateConfigFilePath)
  }

  // Workspaces

  async getWorkspacesPathsByName(workspaceName: string, type?: WorkspaceType, options: GlobPromiseOptions = {}): Promise<{ workspacesPaths: string[]; }> {
    const patterns = []
    const personalPattern = `${this.workspacesDir}/${WorkspaceType.Personal}/${workspaceName} [*`
    const teamPattern = `${this.workspacesDir}/${WorkspaceType.Team}/${workspaceName} [*`

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
    const personalPattern = `${this.workspacesDir}/${WorkspaceType.Personal}/**/${this.workspaceMetadataFileName}`
    const teamPattern = `${this.workspacesDir}/${WorkspaceType.Team}/**/${this.workspaceMetadataFileName}`

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

  private workspaceIdConvention(id: string) {
    return `[id:${id}]`
  }

  getWorkspacePath(workspaceMetadata: PostmanWorkspaceMetadata) {
    const { id, name, type } = workspaceMetadata
    const idConvention = this.workspaceIdConvention(id)
    return `${this.workspacesDir}/${type}/${name} ${idConvention}`
  }

  async renameWorkspaceDir(workspaceMetadata: PostmanWorkspaceMetadata) {
    // const workspacePath = this.getWorkspacePath(workspaceMetadata);

    const basePath =
      workspaceMetadata.type === WorkspaceType.Personal ?
        this.personalWorkspacesDir :
        this.teamWorkspacesDir

    const idPattern = this.workspaceIdConvention(workspaceMetadata.id)
    const pattern = `${basePath}/* ${idPattern}`

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
      this.workspaceMetadataFileName
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
    const workspacesSplit = path.split(this.workspacesDirName)[1].split('/')
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

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  // eslint-disable-next-line unicorn/no-object-as-default-parameter
  createWorkspaceDir(workspace: PostmanWorkspace, options = { force: false }) {
    try {
      if (!this.exists()) {
        throw this.pmacNotFoundError
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

  writeWorkspaceData(workspace: PostmanWorkspace) {
    const workspaceJsonPath = this.getWorkspaceMetadataFilePath(workspace)
    this.writeJsonFileSync(workspaceJsonPath, workspace)
  }

  createPmacPersonalWorkspacesDir() {
    if (!this.exists()) {
      throw this.pmacNotFoundError
    } else if (fs.existsSync(this.personalWorkspacesDir)) {
      return
    }

    fs.mkdirSync(this.personalWorkspacesDir)

    // .gitignore
    const gitIgnorePattern = this.getGitIgnorePattern('workspaces/personal')
    this.appendGitIgnore(gitIgnorePattern)
  }

  createPmacTeamWorkspacesDir() {
    if (!this.exists()) {
      throw this.pmacNotFoundError
    } else if (fs.existsSync(this.teamWorkspacesDir)) {
      return
    }

    fs.mkdirSync(this.teamWorkspacesDir)
  }

  // Get Resources

  private async getWorkspaceCollectionsPaths(
    workspaceMetadata: PostmanWorkspaceMetadata,
  ) {
    return this.getWorkspaceResourcesPaths(
      workspaceMetadata,
      this.collectionsPattern,
    )
  }

  getResourcePath(
    workspaceMetadata: PostmanWorkspaceMetadata,
    resourceType: WorkspaceResource,
    resourceName: string,
  ) {
    const workspacePath = this.getWorkspacePath(workspaceMetadata)
    return `${workspacePath}/${resourceType}s/${resourceName}.${this.postmanResourcePrefix}${resourceType}.json`
  }

  getResourceFileName(resourceType: WorkspaceResource, resourceName: string) {
    return `${resourceName}.${this.postmanResourcePrefix}${resourceType}.json`
  }

  async updateEnvironment(
    workspaceMetadata: PostmanWorkspaceMetadata,
    updatedEnvironment: PostmanEnvironment,
    resourceType: WorkspaceResource,
    resourceName: string,
  ) {
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
      this.environmentsPattern,
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

  async getWorkspaceEnvironments(workspaceMetadata: PostmanWorkspaceMetadata) {
    const localEnvironments =
      await this.getWorkspaceResources<PostmanEnvironment>(
        workspaceMetadata,
        this.environmentsPattern,
      )
    return { localEnvironments }
  }

  private collectionPatternRegex = new RegExp(
    // \/.*\/collections\/.*\.postman_.*\.json
    `(${WorkspaceType.Personal}|${WorkspaceType.Team})/.*/${WorkspaceResource.Collection}s/.*.${this.postmanResourcePrefix}.*.json`,
  );

  private environmentPatternRegex = new RegExp(
    `(${WorkspaceType.Personal}|${WorkspaceType.Team})/.*/${WorkspaceResource.Environment}s/.*.${this.postmanResourcePrefix}.*.json`,
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

  async getWorkspaceCollections(workspaceMetadata: PostmanWorkspaceMetadata) {
    const localCollections =
      await this.getWorkspaceResources<PostmanCollection>(
        workspaceMetadata,
        this.collectionsPattern,
      )
    return { localCollections }
  }

  private resourceUidConvention(uid: string) {
    return `[uid:${uid}]`
  }

  resourceNameConvention(name: string, uid: string): string {
    return `${name} ${this.resourceUidConvention(uid)}`
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
      throw this.pmacNotFoundError
    }

    const workspaceDir = this.getWorkspacePath(workspaceMetadata)
    const resourceName = resourceData.name || resourceData.info.name

    // postman allow duplication names
    const resourcePmacName = this.resourceNameConvention(
      resourceName,
      resourceUid,
    )

    const path = `${workspaceDir}/${resourceType}s/${resourcePmacName}.${this.postmanResourcePrefix}${resourceType}.json`

    if (fs.existsSync(path) && !options.force) {
      throw this.pmacResourceAlreadyExistsError
    }

    this.writeJsonFileSync(path, resourceData)
  }

  async getCollection(
    workspaceMetadata: PostmanWorkspaceMetadata,
    uid: string,
  ) {
    const workspacePath = this.getWorkspacePath(workspaceMetadata)

    const resourcePattern = this.resourceUidConvention(uid)
    const pattern = `${workspacePath}/${WorkspaceResource.Collection}s/*${resourcePattern}.${this.postmanResourcePrefix}${WorkspaceResource.Collection}.json`

    const [resourcePath] = await globPromise(pattern)
    return { collection: this.getCollectionByPath(resourcePath) }
  }

  async getEnvironment(
    workspaceMetadata: PostmanWorkspaceMetadata,
    uid: string,
  ) {
    const workspacePath = this.getWorkspacePath(workspaceMetadata)

    const resourcePattern = this.resourceUidConvention(uid)
    const pattern = `${workspacePath}/${WorkspaceResource.Environment}s/*${resourcePattern}.${this.postmanResourcePrefix}${WorkspaceResource.Environment}.json`

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
    const pattern = `${workspacePath}/${resourceType}s/*${resourcePattern}.${this.postmanResourcePrefix}${resourceType}.json`

    const [resourcePath] = await globPromise(pattern)

    if (resourcePath) {
      fs.rmSync(resourcePath)
    }
  }

  async deleteEnvironmentResource(
    workspaceMetadata: PostmanWorkspaceMetadata,
    environmentUid: string,
  ) {
    await this.deleteWorkspaceResource(
      workspaceMetadata,
      environmentUid,
      WorkspaceResource.Environment,
    )
  }

  async deleteCollectionResource(
    workspaceMetadata: PostmanWorkspaceMetadata,
    collectionUid: string,
  ) {
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
  ) {
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
  ) {
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
  ) {
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
  ) {
    this.writeWorkspaceResource(
      workspaceMetadata,
      mock,
      mockUid,
      WorkspaceResource.Mock,
    )
  }
}

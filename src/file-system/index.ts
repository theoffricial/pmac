import * as fsWorkspaceManager from './fs-workspace-manager'
import * as fsWorkspaceResourceManager from './fs-workspace-resource-manager'
import * as fsMainManager from './fs-main-dir-manager'
import * as fsPrivateManager from './fs-private-manager'

export type TfsMainManager = typeof fsMainManager
export type TfsWorkspaceManager = typeof fsWorkspaceManager
export type TfsWorkspaceResourceManager = typeof fsWorkspaceResourceManager
export { fsMainManager, fsWorkspaceManager, fsWorkspaceResourceManager, fsPrivateManager }

export * as PMACMap from './fs-pmac-map-utils'

export * from './fs-pmac.constants'

import * as pmacDotEnv from './dotenv'

export { pmacDotEnv }

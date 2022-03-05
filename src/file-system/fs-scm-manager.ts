// eslint-disable-next-line unicorn/prefer-node-protocol
import fs from 'fs'
// eslint-disable-next-line unicorn/prefer-node-protocol
import fsPromises from 'fs/promises'
import { PMAC_FILE_SYS } from './fs-pmac.constants'

// Git
const gitIgnore = '.gitignore'
const GIT_IGNORE_PATH = `${PMAC_FILE_SYS.WORKING_DIR}/${gitIgnore}`
const GIT_IGNORE_PMAC_COMMENT = `# ${PMAC_FILE_SYS.MAIN_DIR.name}`

function buildGitIgnorePMACRulePattern(ignorePattern: string): string {
  return `/${PMAC_FILE_SYS.MAIN_DIR.name}/${ignorePattern}`
}

type GitIgnoreRuleOptions = { newLine?: boolean }

async function addGitIgnoreRule(ignorePattern: string, options?: GitIgnoreRuleOptions) {
  if (!fs.existsSync(GIT_IGNORE_PATH)) {
    // no .gitignore.
    return
  }

  const content = await fsPromises.readFile(GIT_IGNORE_PATH, 'utf8').catch(error => null)
  let pattern = ignorePattern

  if (options?.newLine) {
    pattern = `\n${ignorePattern}`
  }

  // check for if the pattern existing and followed by a line break
  //   const patternRegexString = `${patternToAppend}(?=\n)`
  //   const patternRegex = new RegExp(patternRegexString)

  //   if (!patternRegex.test(content)) {
  writeToSpecificPosition(GIT_IGNORE_PATH, GIT_IGNORE_PMAC_COMMENT, pattern)
  //   }
}

function findIndexOfPatternInFileContent(content: string, patternToDetect: string) {
  const detectPatternIndex = content?.indexOf(patternToDetect)

  const startWritePosition = Math.min(detectPatternIndex, content.length) + patternToDetect.length

  return startWritePosition
}

function buildPostPatternContentForFileWrite(content: string, patternToDetect: string, contentToWrite: string) {
  const startWritePosition = findIndexOfPatternInFileContent(content, patternToDetect)
  const textAfterNewContentToAdd = content.slice(startWritePosition)
  const newPostContent = contentToWrite + textAfterNewContentToAdd
  return newPostContent
}

function writeToSpecificPosition(path: string, patternToDetect: string, contentToWrite: string) {
  const content = fs.readFileSync(path, 'utf8')

  // when pattern already exists, do nothing
  if (isGitIgnoreIncludesPattern(content, contentToWrite)) {
    return
  }

  const startWritePosition = findIndexOfPatternInFileContent(content, patternToDetect)
  const newContent = buildPostPatternContentForFileWrite(content, patternToDetect, contentToWrite)
  const buffer = Buffer.from(newContent)
  const file = fs.openSync(path, 'r+')
  fs.writeSync(file, buffer, 0, buffer.length, startWritePosition)
  fs.closeSync(file)
}

function isGitIgnoreIncludesPattern(content: string, pattern: string) {
  return content.includes(`\n${pattern}\n`)
}

export async function addPMACPrivateIgnoreRules() {
  // build comment
  const pmacIgnoreComment = buildGitIgnorePMACRulePattern(GIT_IGNORE_PMAC_COMMENT)
  const { WORKSPACES_DIR, PRIVATE_DIR } = PMAC_FILE_SYS.MAIN_DIR

  // build personal rule
  const { name: workspacesDirName, PERSONAL } = WORKSPACES_DIR
  const { name: personalWorkspacesDirName } = PERSONAL
  const personalRule = `${workspacesDirName}/${personalWorkspacesDirName}`
  const personalWorkspacesRule = buildGitIgnorePMACRulePattern(personalRule)

  // build private rule
  const { name: privateDirName } = PRIVATE_DIR
  const privateRule = buildGitIgnorePMACRulePattern(privateDirName)

  addGitIgnoreRule(pmacIgnoreComment, { newLine: true })
  addGitIgnoreRule(personalWorkspacesRule, { newLine: true })
  addGitIgnoreRule(privateRule, { newLine: true })
}

// export const PMAC_GIT_SYS = {
//   GIT_IGNORE: {
//     path: GIT_IGNORE_PATH,
//     PMAC: {
//       comment: GIT_IGNORE_PMAC_COMMENT,
//     },
//   },
//   buildGitIgnorePMACRulePattern,
//   addGitIgnoreRule,
// }

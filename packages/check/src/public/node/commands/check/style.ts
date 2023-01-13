import { Command, Flags, Interfaces } from '@catalysisdev/core/node/oclif'
import { loadProject } from '@catalysisdev/core/node/project'
import { globalFlags, projectFlags } from '@catalysisdev/core/node/command'

import { checkStyle } from '../../../../internal/node/services/style.js'
import { absolutePath } from '@catalysisdev/core/node/path'

// eslint-disable-next-line import/no-default-export
export default class Style extends Command {
  static description = 'Check the code style using ESLint.'

  static flags = {
    ...globalFlags(),
    ...projectFlags(),
    fix: Flags.boolean({
      char: 'f',
      description: 'When passed, it fixes the fixable style issues.',
      default: false,
      required: false,
      env: 'CATALYSIS_FIX',
    }),
  }
  async run(): Promise<void> {
    const { flags } = await this.parse(Style)
    const project = await loadProject(absolutePath(flags.path))

    await checkStyle({
      fix: flags.fix,
      project: project,
    })
  }
}

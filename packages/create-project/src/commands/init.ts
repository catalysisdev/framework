import { Interfaces } from '@oclif/core'
import { Command } from '@gestaltjs/core/cli'
import logger from '../logger'

export default class Init extends Command {
  static description = 'Create a Gestalt project'

  static flags: Interfaces.FlagInput<any> = {
    ...Command.flags,
  }

  async run(): Promise<void> {
    logger().info('Initialized')
  }
}
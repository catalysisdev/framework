import { getModuleLoader } from './module-loader'
import { describe, test, expect, vi } from 'vitest'
import { temporary } from '@gestaltjs/testing'
import { join as pathJoin } from '../../path'
import { writeFile } from '../../fs'

describe('getModuleLoader', () => {
  test('load loads a module successfully', async () => {
    await temporary.directory(async (tmpDir) => {
      // Given
      const moduleContent = `
        const object = { name: "Test" };
        export default object;
        `
      const modulePath = pathJoin(tmpDir, 'module.js')
      await writeFile(modulePath, moduleContent)
      const moduleLoader = await getModuleLoader(tmpDir)

      // When
      const got: any = await moduleLoader.load(modulePath)

      // Then
      await moduleLoader.close()
      expect(got.default.name).toEqual('Test')
    })
  })

  test('watch notifies when an existing module changes', async () => {
    await temporary.directory(async (tmpDir) => {
      // Given
      type Module = { default: { name: string } }
      const firstModuleContent = `
        const object = { name: "First" };
        export default object;
        `
      const secondModuleContent = `
        const object = { name: "Second" };
        export default object;
        `
      const modulePath = pathJoin(tmpDir, 'module.js')
      await writeFile(modulePath, firstModuleContent)
      const moduleLoader = await getModuleLoader(tmpDir)

      // When
      const got: Module = await moduleLoader.load(modulePath)

      // Then
      expect(got.default.name).toEqual('First')
      const updatedModule: Module = await new Promise((resolve) => {
        moduleLoader.watch(tmpDir, async (modulePath) => {
          resolve(await moduleLoader.load(modulePath))
        })
        writeFile(modulePath, secondModuleContent)
      })
      expect(updatedModule.default.name).toEqual('Second')
      await moduleLoader.close()
    })
  })

  test('watch notifies when a new module is added', async () => {
    await temporary.directory(async (tmpDir) => {
      // Given
      type Module = { default: { name: string } }
      const moduleContent = `
        const object = { name: "Test" };
        export default object;
        `
      const modulePath = pathJoin(tmpDir, 'module.js')
      const moduleLoader = await getModuleLoader(tmpDir)

      // When/Then
      const updatedModule: Module = await new Promise((resolve) => {
        moduleLoader.watch(tmpDir, async (modulePath) => {
          resolve(await moduleLoader.load(modulePath))
        })
        writeFile(modulePath, moduleContent)
      })
      expect(updatedModule.default.name).toEqual('Test')
      await moduleLoader.close()
    })
  })
})

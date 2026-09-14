import * as core from '@actions/core';
import * as actionsToolkit from '@docker/actions-toolkit';

import {Docker} from '@docker/actions-toolkit/lib/docker/docker.js';

import * as context from './context.js';

interface Platforms {
  supported: string[];
  available: string[];
}

actionsToolkit.run(
  // main
  async () => {
    const input: context.Inputs = context.getInputs();

    await core.group(`Docker info`, async () => {
      await Docker.printVersion();
      await Docker.printInfo();
    });

    await core.group(`Pulling binfmt Docker image`, async () => {
      await Docker.pull(input.image, input.cacheImage);
    });

    await core.group(`Image info`, async () => {
      await Docker.getExecOutput(['image', 'inspect', input.image], {
        ignoreReturnCode: true
      }).then(res => {
        if (res.exitCode != 0) {
          throw new Error(`Failed to inspect image ${input.image}: ${Docker.getErrorMessage(res.stderr)}`);
        }
      });
    });

    await core.group(`Binfmt version`, async () => {
      await Docker.getExecOutput(['run', '--rm', '--privileged', input.image, '--version'], {
        ignoreReturnCode: true
      }).then(res => {
        if (res.exitCode != 0) {
          throw new Error(`Failed to get binfmt version: ${Docker.getErrorMessage(res.stderr)}`);
        }
      });
    });

    if (input.reset) {
      await core.group(`Uninstalling current emulators`, async () => {
        await Docker.getExecOutput(['run', '--rm', '--privileged', input.image, '--uninstall', 'qemu-*'], {
          ignoreReturnCode: true
        }).then(res => {
          if (res.exitCode != 0) {
            throw new Error(`Failed to uninstall current emulators: ${Docker.getErrorMessage(res.stderr)}`);
          }
        });
      });
    }

    await core.group(`Installing QEMU static binaries`, async () => {
      await Docker.getExecOutput(['run', '--rm', '--privileged', input.image, '--install', input.platforms], {
        ignoreReturnCode: true
      }).then(res => {
        if (res.exitCode != 0) {
          throw new Error(`Failed to install QEMU static binaries: ${Docker.getErrorMessage(res.stderr)}`);
        }
      });
    });

    await core.group(`Extracting available platforms`, async () => {
      await Docker.getExecOutput(['run', '--rm', '--privileged', input.image], {
        ignoreReturnCode: true,
        silent: true
      }).then(res => {
        if (res.exitCode != 0) {
          throw new Error(`Failed to extract available platforms: ${Docker.getErrorMessage(res.stderr)}`);
        }
        const platforms: Platforms = JSON.parse(res.stdout.trim());
        core.info(`${platforms.supported.join(',')}`);
        core.setOutput('platforms', platforms.supported.join(','));
      });
    });
  }
);

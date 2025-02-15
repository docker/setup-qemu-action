import * as context from './context';
import * as core from '@actions/core';
import * as actionsToolkit from '@docker/actions-toolkit';

import {Docker} from '@docker/actions-toolkit/lib/docker/docker';

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
        if (res.stderr.length > 0 && res.exitCode != 0) {
          throw new Error(res.stderr.match(/(.*)\s*$/)?.[0]?.trim() ?? 'unknown error');
        }
      });
    });

    await core.group(`Binfmt version`, async () => {
      await Docker.getExecOutput(['run', '--rm', '--privileged', input.image, '--version'], {
        ignoreReturnCode: true
      }).then(res => {
        if (res.stderr.length > 0 && res.exitCode != 0) {
          throw new Error(res.stderr.match(/(.*)\s*$/)?.[0]?.trim() ?? 'unknown error');
        }
      });
    });

    await core.group(`Installing QEMU static binaries`, async () => {
      await Docker.getExecOutput(['run', '--rm', '--privileged', input.image, '--install', input.platforms], {
        ignoreReturnCode: true
      }).then(res => {
        if (res.stderr.length > 0 && res.exitCode != 0) {
          throw new Error(res.stderr.match(/(.*)\s*$/)?.[0]?.trim() ?? 'unknown error');
        }
      });
    });

    await core.group(`Extracting available platforms`, async () => {
      await Docker.getExecOutput(['run', '--rm', '--privileged', input.image], {
        ignoreReturnCode: true,
        silent: true
      }).then(res => {
        if (res.stderr.length > 0 && res.exitCode != 0) {
          throw new Error(res.stderr.match(/(.*)\s*$/)?.[0]?.trim() ?? 'unknown error');
        }
        const platforms: Platforms = JSON.parse(res.stdout.trim());
        core.info(`${platforms.supported.join(',')}`);
        core.setOutput('platforms', platforms.supported.join(','));
      });
    });
  }
);

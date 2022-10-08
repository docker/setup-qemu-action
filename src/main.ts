import * as context from './context';
import * as core from '@actions/core';
import * as exec from '@actions/exec';

interface Platforms {
  supported: string[];
  available: string[];
}

async function run(): Promise<void> {
  try {
    const input: context.Inputs = context.getInputs();

    await core.group(`Docker info`, async () => {
      await exec.exec('docker', ['version'], {
        failOnStdErr: false
      });
      await exec.exec('docker', ['info'], {
        failOnStdErr: false
      });
    });

    await core.group(`Pulling binfmt Docker image`, async () => {
      await exec.exec('docker', ['pull', input.image]);
    });

    await core.group(`Image info`, async () => {
      await exec.exec('docker', ['image', 'inspect', input.image]);
    });

    await core.group(`Installing QEMU static binaries`, async () => {
      await exec.exec('docker', ['run', '--rm', '--privileged', input.image, '--install', input.platforms]);
    });

    await core.group(`Extracting available platforms`, async () => {
      await exec
        .getExecOutput('docker', ['run', '--rm', '--privileged', input.image], {
          ignoreReturnCode: true,
          silent: true
        })
        .then(res => {
          if (res.stderr.length > 0 && res.exitCode != 0) {
            throw new Error(res.stderr.trim());
          }
          const platforms: Platforms = JSON.parse(res.stdout.trim());
          core.info(`${platforms.supported.join(',')}`);
          context.setOutput('platforms', platforms.supported.join(','));
        });
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

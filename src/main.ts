import * as core from '@actions/core';
import * as exec from '@actions/exec';
import {issueCommand} from '@actions/core/lib/command';

interface Platforms {
  supported: string[];
  available: string[];
}

async function run(): Promise<void> {
  try {
    core.startGroup(`Docker info`);
    await exec.exec('docker', ['version']);
    await exec.exec('docker', ['info']);
    core.endGroup();

    const image: string = core.getInput('image') || 'tonistiigi/binfmt:latest';
    const platforms: string = core.getInput('platforms') || 'all';

    core.startGroup(`Pulling binfmt Docker image`);
    await exec.exec('docker', ['pull', image]);
    core.endGroup();

    core.startGroup(`Image info`);
    await exec.exec('docker', ['image', 'inspect', image]);
    core.endGroup();

    core.startGroup(`Installing QEMU static binaries`);
    await exec.exec('docker', ['run', '--rm', '--privileged', image, '--install', platforms]);
    core.endGroup();

    core.startGroup(`Extracting available platforms`);
    await exec
      .getExecOutput('docker', ['run', '--rm', '--privileged', image], {
        ignoreReturnCode: true,
        silent: true
      })
      .then(res => {
        if (res.stderr.length > 0 && res.exitCode != 0) {
          throw new Error(res.stderr.trim());
        }
        const platforms: Platforms = JSON.parse(res.stdout.trim());
        core.info(`${platforms.supported.join(',')}`);
        setOutput('platforms', platforms.supported.join(','));
      });
    core.endGroup();
  } catch (error) {
    core.setFailed(error.message);
  }
}

// FIXME: Temp fix https://github.com/actions/toolkit/issues/777
function setOutput(name: string, value: unknown): void {
  issueCommand('set-output', {name}, value);
}

run();

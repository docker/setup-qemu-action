import os from 'os';
import * as core from '@actions/core';
import * as io from '@actions/io';
import {Exec} from '@docker/actions-toolkit/lib/exec';

export async function isInstalled(): Promise<boolean> {
  return await io
    .which(bin(), true)
    .then(res => {
      core.debug(`qemu.isInstalled ok: ${res}`);
      return true;
    })
    .catch(error => {
      core.debug(`qemu.isInstalled error: ${error}`);
      return false;
    });
}

export async function printVersion(): Promise<void> {
  await Exec.exec(bin(), ['--version']);
}

export function bin(): string {
  return `qemu-system-${arch()}`;
}

function arch(): string {
  switch (os.arch()) {
    case 'x64': {
      return 'x86_64';
    }
    case 'arm64': {
      return 'aarch64';
    }
    default: {
      return os.arch();
    }
  }
}

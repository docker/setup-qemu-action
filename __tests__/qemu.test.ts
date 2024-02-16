import {describe, expect, jest, it} from '@jest/globals';
import * as io from '@actions/io';
import {Exec} from '@docker/actions-toolkit/lib/exec';

import * as qemu from '../src/qemu';

describe('isInstalled', () => {
  it('bin', async () => {
    const ioWhichSpy = jest.spyOn(io, 'which');
    await qemu.isInstalled();
    expect(ioWhichSpy).toHaveBeenCalledTimes(1);
    expect(ioWhichSpy).toHaveBeenCalledWith(qemu.bin(), true);
  });
});

describe('printVersion', () => {
  it('call qemu --version', async () => {
    const execSpy = jest.spyOn(Exec, 'exec');
    await qemu.printVersion().catch(() => {
      // noop
    });
    expect(execSpy).toHaveBeenCalledWith(qemu.bin(), ['--version']);
  });
});

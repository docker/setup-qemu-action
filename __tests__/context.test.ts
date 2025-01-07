import {beforeEach, describe, expect, test} from '@jest/globals';

import * as context from '../src/context';

describe('getInputs', () => {
  beforeEach(() => {
    process.env = Object.keys(process.env).reduce((object, key) => {
      if (!key.startsWith('INPUT_')) {
        object[key] = process.env[key];
      }
      return object;
    }, {});
  });

  // prettier-ignore
  test.each([
    [
      0,
      new Map<string, string>([
        ['cache-image', 'true'],
      ]),
      {
        image: 'docker.io/tonistiigi/binfmt:latest',
        platforms: 'all',
        cacheImage: true,
      } as context.Inputs
    ],
    [
      1,
      new Map<string, string>([
        ['image', 'docker/binfmt:latest'],
        ['platforms', 'arm64,riscv64,arm'],
        ['cache-image', 'false'],
      ]),
      {
        image: 'docker/binfmt:latest',
        platforms: 'arm64,riscv64,arm',
        cacheImage: false,
      } as context.Inputs
    ],
    [
      2,
      new Map<string, string>([
        ['platforms', 'arm64, riscv64, arm '],
        ['cache-image', 'true'],
      ]),
      {
        image: 'docker.io/tonistiigi/binfmt:latest',
        platforms: 'arm64,riscv64,arm',
        cacheImage: true,
      } as context.Inputs
    ]
  ])(
    '[%d] given %p as inputs, returns %p',
    async (num: number, inputs: Map<string, string>, expected: context.Inputs) => {
      inputs.forEach((value: string, name: string) => {
        setInput(name, value);
      });
      const res = await context.getInputs();
      expect(res).toEqual(expected);
    }
  );
});

// See: https://github.com/actions/toolkit/blob/master/packages/core/src/core.ts#L67
function getInputName(name: string): string {
  return `INPUT_${name.replace(/ /g, '_').toUpperCase()}`;
}

function setInput(name: string, value: string): void {
  process.env[getInputName(name)] = value;
}

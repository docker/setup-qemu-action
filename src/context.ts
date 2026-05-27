import * as core from '@actions/core';
import {Util} from '@docker/actions-toolkit/lib/util.js';

export interface Inputs {
  image: string;
  platforms: string;
  reset: boolean;
  cacheImage: boolean;
}

export function getInputs(): Inputs {
  return {
    image: core.getInput('image') || 'docker.io/tonistiigi/binfmt:latest',
    platforms: Util.getInputList('platforms').join(',') || 'all',
    reset: core.getBooleanInput('reset'),
    cacheImage: core.getBooleanInput('cache-image')
  };
}

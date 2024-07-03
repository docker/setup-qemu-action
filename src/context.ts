import * as core from '@actions/core';
import {Util} from '@docker/actions-toolkit/lib/util';

export interface Inputs {
  image: string;
  platforms: string;
  cacheImage: boolean;
}

export function getInputs(): Inputs {
  return {
    image: core.getInput('image') || 'docker.io/tonistiigi/binfmt:latest',
    platforms: Util.getInputList('platforms').join(',') || 'all',
    cacheImage: core.getBooleanInput('cache-image')
  };
}

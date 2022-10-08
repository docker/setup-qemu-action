import * as core from '@actions/core';

export interface Inputs {
  image: string;
  platforms: string;
}

export function getInputs(): Inputs {
  return {
    image: core.getInput('image') || 'tonistiigi/binfmt:latest',
    platforms: core.getInput('platforms') || 'all'
  };
}

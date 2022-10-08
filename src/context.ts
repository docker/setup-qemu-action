import * as core from '@actions/core';
import {issueCommand} from '@actions/core/lib/command';

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

// FIXME: Temp fix https://github.com/actions/toolkit/issues/777
export function setOutput(name: string, value: unknown): void {
  issueCommand('set-output', {name}, value);
}

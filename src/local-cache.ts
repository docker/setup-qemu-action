import * as fs from 'fs';
import * as path from 'path';
import * as core from '@actions/core';
import {Docker} from '@docker/actions-toolkit/lib/docker/docker';

function getImageCacheFileName(imageName: string): string {
  return `${imageName.replace(/[\/\:]/g, '-')}.tar`;
}

export async function loadDockerImageFromCache(localCachePath: string, imageName: string): Promise<void> {
  const cacheFilePath = path.join(localCachePath, getImageCacheFileName(imageName));

  try {
    if (fs.existsSync(cacheFilePath)) {
      await Docker.getExecOutput(['load', '-i', cacheFilePath], {
        ignoreReturnCode: true
      }).then(res => {
        if (res.stderr.length > 0 && res.exitCode != 0) {
          throw new Error(res.stderr.match(/(.*)\s*$/)?.[0]?.trim() ?? 'unknown error');
        }
        core.info(`Loaded image from ${cacheFilePath}`);
      });
    } else {
      core.info(`Cache file not found at ${cacheFilePath}, pulling image instead`);
      await Docker.pull(imageName);
    }
  } catch (error) {
    core.warning(`Failed to check/load cache file: ${error}`);
    await Docker.pull(imageName);
  }
}

export async function saveDockerImageToCache(localCachePath: string, imageName: string): Promise<void> {
  const cacheFilePath = path.join(localCachePath, getImageCacheFileName(imageName));

  try {
    if (!fs.existsSync(localCachePath)) {
      fs.mkdirSync(localCachePath, {recursive: true});
    }

    if (fs.existsSync(cacheFilePath)) {
      core.info(`Cache file already exists at ${cacheFilePath}, skipping save`);
      return;
    }

    await Docker.getExecOutput(['save', '-o', cacheFilePath, imageName], {
      ignoreReturnCode: true
    }).then(res => {
      if (res.stderr.length > 0 && res.exitCode != 0) {
        throw new Error(res.stderr.match(/(.*)\s*$/)?.[0]?.trim() ?? 'unknown error');
      }
      core.info(`Saved image to ${cacheFilePath}`);
    });
  } catch (error) {
    core.warning(`Failed to save image to cache file: ${error}`);
  }
}

[![GitHub release](https://img.shields.io/github/release/docker/setup-qemu-action.svg?style=flat-square)](https://github.com/docker/setup-qemu-action/releases/latest)
[![GitHub marketplace](https://img.shields.io/badge/marketplace-docker--setup--qemu-blue?logo=github&style=flat-square)](https://github.com/marketplace/actions/docker-setup-qemu)
[![CI workflow](https://img.shields.io/github/workflow/status/docker/setup-qemu-action/ci?label=ci&logo=github&style=flat-square)](https://github.com/docker/setup-qemu-action/actions?workflow=ci)

## About

GitHub Action to install [QEMU static binaries](https://github.com/multiarch/qemu-user-static).

___

* [Usage](#usage)
* [Customizing](#customizing)
  * [inputs](#inputs)
* [Limitation](#limitation)

## Usage

```yaml
name: ci

on:
  push:

jobs:
  qemu:
    runs-on: ubuntu-latest
    steps:
      -
        name: Checkout
        uses: actions/checkout@v2
      -
        name: Set up QEMU
        id: qemu
        uses: docker/setup-qemu-action@v1
        with:
          image: tonistiigi/binfmt:latest
          platforms: all
      -
        name: Available platforms
        run: echo ${{ steps.qemu.outputs.platforms }}
```

## Customizing

### inputs

Following inputs can be used as `step.with` keys

| Name             | Type    | Default                     | Description                        |
|------------------|---------|-----------------------------|------------------------------------|
| `image`          | String  | `tonistiigi/binfmt:latest`  | QEMU static binaries Docker image (e.g. [`tonistiigi/binfmt:latest`](https://hub.docker.com/r/tonistiigi/binfmt/tags)) |
| `platforms`      | String  | `all`                       | Platforms to install (e.g. `arm64,riscv64,arm`) |

### outputs

Following outputs are available

| Name          | Type    | Description                           |
|---------------|---------|---------------------------------------|
| `platforms`   | String  | Available platforms (comma separated) |

## Limitation

This action is only available for Linux [virtual environments](https://docs.github.com/en/actions/reference/virtual-environments-for-github-hosted-runners#supported-virtual-environments-and-hardware-resources).

[![GitHub release](https://img.shields.io/github/release/docker/setup-qemu-action.svg?style=flat-square)](https://github.com/docker/setup-qemu-action/releases/latest)
[![GitHub marketplace](https://img.shields.io/badge/marketplace-docker--setup--qemu-blue?logo=github&style=flat-square)](https://github.com/marketplace/actions/docker-setup-qemu)
[![CI workflow](https://img.shields.io/github/workflow/status/docker/setup-qemu-action/ci?label=ci&logo=github&style=flat-square)](https://github.com/docker/setup-qemu-action/actions?workflow=ci)

## About

GitHub Action to install [QEMU](https://github.com/qemu/qemu) static binaries.

![Screenshot](.github/setup-qemu-action.png)

___

* [Usage](#usage)
* [Customizing](#customizing)
  * [inputs](#inputs)
* [Contributing](#contributing)

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
        name: Set up QEMU
        uses: docker/setup-qemu-action@v2
```

## Customizing

### inputs

Following inputs can be used as `step.with` keys

| Name        | Type   | Description                                                                                                               |
|-------------|--------|---------------------------------------------------------------------------------------------------------------------------|
| `image`     | String | QEMU static binaries Docker image (default [`tonistiigi/binfmt:latest`](https://hub.docker.com/r/tonistiigi/binfmt/tags)) |
| `platforms` | String | Platforms to install (e.g. `arm64,riscv64,arm` ; default `all`)                                                           |

### outputs

Following outputs are available

| Name          | Type    | Description                           |
|---------------|---------|---------------------------------------|
| `platforms`   | String  | Available platforms (comma separated) |

## Contributing

Want to contribute? Awesome! You can find information about contributing to
this project in the [CONTRIBUTING.md](/.github/CONTRIBUTING.md)

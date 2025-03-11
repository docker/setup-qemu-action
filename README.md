[![GitHub release](https://img.shields.io/github/release/docker/setup-qemu-action.svg?style=flat-square)](https://github.com/docker/setup-qemu-action/releases/latest)
[![GitHub marketplace](https://img.shields.io/badge/marketplace-docker--setup--qemu-blue?logo=github&style=flat-square)](https://github.com/marketplace/actions/docker-setup-qemu)
[![CI workflow](https://img.shields.io/github/actions/workflow/status/docker/setup-qemu-action/ci.yml?branch=master&label=ci&logo=github&style=flat-square)](https://github.com/docker/setup-qemu-action/actions?workflow=ci)
[![Test workflow](https://img.shields.io/github/actions/workflow/status/docker/setup-qemu-action/test.yml?branch=master&label=test&logo=github&style=flat-square)](https://github.com/docker/setup-qemu-action/actions?workflow=test)
[![Codecov](https://img.shields.io/codecov/c/github/docker/setup-qemu-action?logo=codecov&style=flat-square)](https://codecov.io/gh/docker/setup-qemu-action)

## About

GitHub Action to install [QEMU](https://github.com/qemu/qemu) static binaries.

![Screenshot](.github/setup-qemu-action.png)

___

* [Usage](#usage)
* [Customizing](#customizing)
  * [inputs](#inputs)
  * [outputs](#outputs)
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
        uses: docker/setup-qemu-action@v3
```

> [!NOTE]
> If you are using [`docker/setup-buildx-action`](https://github.com/docker/setup-buildx-action),
> this action should come before it:
> 
> ```yaml
>     -
>       name: Set up QEMU
>       uses: docker/setup-qemu-action@v3
>     -
>       name: Set up Docker Buildx
>       uses: docker/setup-buildx-action@v3
> ```

## Customizing

### inputs

The following inputs can be used as `step.with` keys:

| Name          | Type   | Default                                                                       | Description                                        |
|---------------|--------|-------------------------------------------------------------------------------|----------------------------------------------------|
| `image`       | String | [`tonistiigi/binfmt:latest`](https://hub.docker.com/r/tonistiigi/binfmt/tags) | QEMU static binaries Docker image                  |
| `platforms`   | String | `all`                                                                         | Platforms to install (e.g., `arm64,riscv64,arm`)   |
| `cache-image` | Bool   | `true`                                                                        | Cache binfmt image to GitHub Actions cache backend |

### outputs

The following outputs are available:

| Name          | Type    | Description                           |
|---------------|---------|---------------------------------------|
| `platforms`   | String  | Available platforms (comma separated) |

## Contributing

Want to contribute? Awesome! You can find information about contributing to
this project in the [CONTRIBUTING.md](/.github/CONTRIBUTING.md)

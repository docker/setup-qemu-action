[![GitHub release](https://img.shields.io/github/release/docker/setup-qemu-action.svg?style=flat-square)](https://github.com/docker/setup-qemu-action/releases/latest)
[![GitHub marketplace](https://img.shields.io/badge/marketplace-docker--setup--qemu-blue?logo=github&style=flat-square)](https://github.com/marketplace/actions/docker-setup-qemu)
[![CI workflow](https://img.shields.io/github/workflow/status/docker/setup-qemu-action/ci?label=ci&logo=github&style=flat-square)](https://github.com/docker/setup-qemu-action/actions?workflow=ci)

## About

GitHub Action to install [QEMU static binaries](https://github.com/multiarch/qemu-user-static).

> :bulb: See also:
> * [login](https://github.com/docker/login-action) action
> * [setup-buildx](https://github.com/docker/setup-buildx-action) action
> * [build-push](https://github.com/docker/build-push-action) action

![Screenshot](.github/setup-qemu-action.png)

___

* [Usage](#usage)
* [Customizing](#customizing)
  * [inputs](#inputs)
* [Keep up-to-date with GitHub Dependabot](#keep-up-to-date-with-github-dependabot)
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

| Name             | Type    | Description                        |
|------------------|---------|------------------------------------|
| `image`          | String  | QEMU static binaries Docker image (default [`tonistiigi/binfmt:latest`](https://hub.docker.com/r/tonistiigi/binfmt/tags)) |
| `platforms`      | String  | Platforms to install (e.g. `arm64,riscv64,arm` ; default `all`) |

### outputs

Following outputs are available

| Name          | Type    | Description                           |
|---------------|---------|---------------------------------------|
| `platforms`   | String  | Available platforms (comma separated) |

## Keep up-to-date with GitHub Dependabot

Since [Dependabot](https://docs.github.com/en/github/administering-a-repository/keeping-your-actions-up-to-date-with-github-dependabot)
has [native GitHub Actions support](https://docs.github.com/en/github/administering-a-repository/configuration-options-for-dependency-updates#package-ecosystem),
to enable it on your GitHub repo all you need to do is add the `.github/dependabot.yml` file:

```yaml
version: 2
updates:
  # Maintain dependencies for GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "daily"
```

## Limitation

This action is only available for Linux [virtual environments](https://docs.github.com/en/actions/reference/virtual-environments-for-github-hosted-runners#supported-virtual-environments-and-hardware-resources).

First of all, *any* contribution is welcome. If you have any idea, suggestion, bug report, or you want to contribute with code, please feel free to do so.

If you want to contribute with code, please follow these steps:
1. Fork the repository.
2. Create a new branch with a descriptive name of your contribution.
3. Commit and push your changes to your branch.
4. Create a pull request. Please, be descriptive with your contribution.

This project is a monorepo, that means that it contains multiple packages. specifically, it contains two packages:
1. "@studio-b3/web-core" located in the `web/core` directory.
2. "@studio-b3/web-studio" located in the `web/studio` directory.

The first package is the core of the project, it contains the core editor react component. The second package is the studio, it contains the studio logic and the studio components that are built on top of the core.

This project uses NX to manage the monorepo. If you want to know more about NX, please visit their [website](https://nx.dev/). We have a few scripts that you can use to develop the project as well in the root `package.json` file.
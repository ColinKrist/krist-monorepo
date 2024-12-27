source: https://hirok.io/posts/importing-source-files-in-dev

Importing source files from packages during development can cost you more than it saves

When working across symlinked JavaScript projects (e.g., monorepo workspaces), it can be tempting to directly import source files from another package to skip the build process. As the author of tsx—a tool for running TypeScript files, including those from dependencies—I contributed to making this practice more accessible as a DX improvement. While convenient, this approach carries risks and can lead to unexpected behavior; it may not be a trade-off worth making.

Building each package before use is the most reliable way to ensure stability and compatibility. But if you’re thinking about bypassing this process, it’s crucial to understand the risks and how to mitigate them. In this post, I’ll highlight the dangers of importing source files and share best practices for minimizing potential issues.

Why import source files?#
Here are some common reasons why skipping the build process and importing source files might seem appealing:

Perceived speed

Building packages with each change or running a separate watcher can feel cumbersome and slow. Instead, running one command and importing source files appear to be simpler and faster for development.

Flexible access to internal files

Cherry-picking what you want from a package’s internal source files can be convenient, especially for private utilities not included in the published package.

Ergonomic IDE experience

Modern IDEs with “Go to Definition” allow quick navigation to source code by clicking on variables. In a monorepo, it makes sense to want this functionality across packages so clicking on import util from 'pkg-a/src/util' opens the actual util function’s source instead of the compiled type declarations.

While these benefits are appealing, source imports come with hidden costs that can put you in tech debt down the road.

Dangers of importing source files#
Directly importing source files may seem convenient, but it introduces significant pitfalls and technical challenges that can undermine the stability of your project.

1. Missing configuration#
Skipping a package’s build process bypasses critical configurations like aliases, environment variables, and plugins. For instance, importing source files from a package relying on build-defined aliases can cause unresolved imports and errors. Similarly, features like JSX or decorators in TypeScript, which are highly dependent on specific build configurations, can behave unpredictably without proper compilation.

Complex build configs amplify these issues, often demanding advanced debugging and requiring workarounds that add complexity to your codebase. To highlight the significance of this risk, Node.js recently introduced built-in type stripping (basic TypeScript support), but chose not to support this feature in dependency packages, recognizing that loading source files without their configurations can cause complex, hard-to-manage bugs.

2. Development vs Production discrepancies#
Bundlers have greater flexibility and control over how modules interoperate compared to runtimes like tsx, which operate within Node.js’s constraints. These differences can lead to subtle but impactful inconsistencies, even in simple packages. For instance, importing named exports from a CommonJS file into an ESM file might behave unexpectedly in tsx, prompting workarounds that fail in a bundled production environment.

Source imports also promote a workflow focused on the development environment, often at the expense of testing or validating the compiled production version of a package. This can result in production-only bugs as code unintentionally gets coupled to development-specific assumptions. By following proper build steps, you ensure consistency between development and production environments, reducing the risk of such issues and improving the overall reliability of your code.

3. Growing performance costs#
Importing source files from another package increases TypeScript’s processing load, adding both memory usage and computation overhead. These costs often escalate unexpectedly, as it’s not immediately clear how many files are being pulled in. Even if you’re not using tsc for compilation, this overhead can cause your IDE’s type-checking to become sluggish and fall out of sync.

Performance issues may be unnoticeable in small monorepos, but can become significant when they grow larger and changes are harder to make. Node.js’s type-stripping PR cited performance drawbacks as a reason to disallow type support in dependencies, and Andrew Branch from the TypeScript team demonstrated how processing .ts files requires significantly more memory and computational resources compared to precompiled .d.ts files.

4. Bypassing the package API#
Directly importing a package’s internal files, especially via relative paths, is risky as it bypasses its intended API:

// ❌ Avoid accessing packages with relative paths
import util from '../../pkg-a/src/util'

// ❌ Avoid importing internal files that may not be available once published
import util from 'pkg-a/src/util'
Bypassing the package API is like using a private API—it can break without warning. Internal files may change or be removed by the package author. And even if you’re the maintainer, this increases coupling, making refactoring and updates harder. Additionally, dev utilities or private files might be excluded during the publishing process, leading to broken imports.

Some conventions, like using tsconfig paths to map workspace packages (common in Nx), require 3rd party resolution plugins and introduce the same problem, as path aliases ultimately resolve to relative paths.

Package security bypass

The exports feature in package.json defines the package interface, specifying accessible paths and blocking others. Using relative imports bypasses this safeguard as Node.js interprets it as accessing an ordinary directory, undermining the protections provided by exports.

→ See this behavior in action
→ Learn more about the exports field

What to do instead?#
Use Workspaces#
Leverage your package manager’s workspace feature (pnpm, npm, yarn) to declare dependencies between workspace packages. Instead of relying on relative paths, import them as packages:

// ✅ Import as a package
import util from 'pkg-a/util';
This ensures you’re working with the package’s public API and enforces proper encapsulation. Using the exports field in package.json further restricts access to internal files, exposing only the intended modules.

Workspaces also install dependencies in node_modules, adhering to Node.js conventions and ensuring better compatibility with tools and debugging workflows. Unlike tsconfig paths, this method works universally across all tools.

Finally, declaring workspace packages in package.json improves maintainability by clearly defining relationships between packages, making it easier for developers to navigate and understand the project.

Build your packages#
Importing a package’s source code often requires tools like tsx to compile files on demand. While this may feel fast and convenient, the compilation cost doesn’t disappear—it’s just shifted to runtime. Over time, repeated on-demand compilations can add up and slow down development.

Instead of skipping the build step, focus on optimizing it. Use next-generation compilers like esbuild or SWC for faster builds, and pair them with a file watcher to automatically rebuild as needed. This approach ensures files are compiled only when necessary, with pre-built outputs serving as a cache, eliminating runtime compilation overhead.

An efficient build step not only ensures you’re always working with production-ready code, but also improves CI pipeline speeds, benefiting development and deployment workflows.

Build declaration files#
During the build process, make sure to emit declaration files (.d.ts) by enabling the declaration setting. If you’re not using tsc to compile, you can use emitDeclarationOnly. These files only contain pre-processed external type information for publicly exported interfaces, stripping away internal types. This streamlined type data allows TypeScript to type-check against dependencies more efficiently, reducing IDE latency and enhancing developer experience.

However, generating type declarations can be a slow process. To speed this up, enable the isolatedDeclarations option in tsconfig. This will require you to manually write external type annotations for all exported APIs, removing the need for TypeScript to infer them. With explicit annotations, declaration files can be generated without any type processing, even enabling the use of third-party alternatives (e.g., Oxc transformer).

Improve “Go to Definition” in Your IDE#
To make the “Go to Definition” feature navigate to the source files instead of the compiled declaration files, enable the declarationMap option in tsconfig. This generates source maps for declaration files, linking the .d.ts output back to the original .ts source code. Since these declaration files provide the link to the source files, consider checking them into version control or building them immediately after cloning the repository to ensure seamless navigation.

When is it okay to import source files?#
It’s best to stick with built files, as they are safe, predictable, and even performant. However, as the author of tsx, I believe it’s important to acknowledge that there are exceptions where this practice might be acceptable.

Source imports can be fine for simple packages that lack complex build steps, such as private packages where the development environment is the production environment. These are often packages with lightweight scripts or shared configuration files that don’t rely on a build process.

To determine if source imports are safe, consider:

Does it use features that compile differently based on configuration? (e.g., JSX, Decorators)
Does it involve complex build configurations? (e.g., plugins, replacing environment variables)
Does it mix multiple module formats across dependencies? (e.g., CommonJS and ESM)
Ultimately, given the speed and reliability of modern compilers, the risks of skipping a build process often outweigh the benefits. For most projects—especially those with teams of developers with varying levels of experience—importing built packages remains the safer, more predictable choice.
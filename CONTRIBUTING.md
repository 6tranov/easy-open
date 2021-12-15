<h1 align="left">Contributing</h1>

Contents
- [Flow](#flow)
- [Issue](#issue)
- [Pull request](#pull-request)
- [Review](#review)
- [Supplement](#supplement)


# Flow
As a general rule, proceed with development according to the following procedure.
1. Create an issue.
2. Create a pull request.
3. Review the pull request.

However, when making minor corrections such as typographical errors, please edit files on GitHub and then create a Pull Request. For more information about editing files on GitHub, please refer to [this site](https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files).


# Issue
We accept following issues.
- [Bug reports](https://github.com/6tranov/easy-open/issues/new?template=bug_report.yml)
- [Feature requests](https://github.com/6tranov/easy-open/issues/new?template=feature_request.yml)
- [Other issues](https://github.com/6tranov/easy-open/issues/new?template=other.yml)


# Pull request
You can create a pull request from [this page](https://github.com/6tranov/easy-open/compare).

:memo: **Note:**
- You have to follow our [Code of Conduct](./CODE_OF_CONDUCT.md).
- When you send a pull request, [the license](./LICENSE) of this repository applies to the content.
- If your pull request is accepted, your account will be added to [Contributors]([Contributors](https://github.com/6tranov/easy-open/graphs/contributors)).


# Review
Please review the pull request. Once that is done, please do the following.
1. Merge the branch (feature/XXX to develop, release/XXX to main, etc.).
2. Close all issues that have been dealt with.
3. Delete branches that are no longer needed.


# Supplement
- You can fork the repository from [this page](https://github.com/6tranov/easy-open/fork).
- You can use the commit message template written in ```.gitmessage```.
- Create a ```feature/#issueNumber-verb-***``` branch from the develop branch  and push it. For minor fixes where no issue exists, you can omit the ```#issueNumber-```. For verbs, please refer to the list below.
  - fix (for bugs)
  - update (except for bugs)
  - add
  - remove
- After editing scripts, please use the following command to generate Javascript files.
  ```
  tsc
  gulp task
  ```
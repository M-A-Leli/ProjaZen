# Git and GitHub Collaboration Guide

## Part 1: Setting Up the Repository

### 1. Create a GitHub Repository
- One developer (Dev A) creates a new repository on GitHub.
- Add a README file and `.gitignore` file.

### 2. Add Collaborators
- Dev A goes to the repository settings.
- Under "Manage Access", invite the other three developers (Dev B, Dev C, and Dev D).

### 3. Clone the Repository
Each developer clones the repository to their local machine:
```bash
git clone https://github.com/DevA/repo-name.git
```

## Part 2: Working on Branches

### 1. Create and Switch to a New Branch
Each developer creates a new branch for their work:
```bash
git checkout -b feature/new-feature
```
Now, each developer will have two branches: main and their feature branch.

### 2. Commit and Push Changes
Make changes, commit them locally, and push the branch to GitHub:
```bash
git add .
git commit -m "Implement new feature"
git push origin feature/new-feature
```

### 3. Create a Pull Request (PR)
- Open a PR from the feature branch to the main branch.
- Have at least one other team member review the PR.
- After approval, merge the PR into the main branch.

## Part 3: Keeping Your Branch Updated

### 1. Pull the Latest Changes from Main
Regularly pull the latest changes from the main branch to keep your branch updated:
```bash
git checkout main
git pull origin main
```

### 2. Incorporate Changes into Your Branch
Rebase or merge the latest changes from main into your feature branch:
```bash
git checkout feature/new-feature
git rebase main
```

### Resolving Conflicts
If there are conflicts, resolve them manually:
1. Open the conflicting files in a text editor.
2. Resolve the conflicts by editing the files.
3. Add the resolved files to the staging area and continue the rebase:
```bash
git add .
git rebase --continue
```

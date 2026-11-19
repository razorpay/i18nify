#!/usr/bin/env python3
"""
Clean POC: Regional Conflict Checker
Detects merge conflicts with regional deployment branches
"""

import os
import sys
import json
import subprocess
from typing import List, Dict, Tuple

def run_git_command(cmd: List[str]) -> Tuple[int, str, str]:
    """Run a git command and return exit code, stdout, stderr"""
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, cwd=os.getcwd())
        return result.returncode, result.stdout.strip(), result.stderr.strip()
    except Exception as e:
        return 1, "", str(e)

def get_regional_branches() -> List[str]:
    """Get list of regional branches to check"""
    env_branches = os.getenv('TARGET_BRANCHES_INPUT', '')
    if env_branches:
        return [b.strip() for b in env_branches.split(',') if b.strip()]
    return ["us_release", "singapore_release"]

def check_merge_conflict(source_branch: str, target_branch: str) -> Tuple[bool, str]:
    """Check if merging source into target would cause conflicts"""
    print(f"Checking merge conflict: {source_branch} -> {target_branch}")
    
    temp_branch = f"temp-merge-test-{target_branch}"
    
    try:
        # Fetch latest and checkout target branch
        run_git_command(['git', 'fetch', 'origin'])
        run_git_command(['git', 'branch', '-D', temp_branch])
        
        exit_code, stdout, stderr = run_git_command(['git', 'checkout', f'origin/{target_branch}'])
        if exit_code != 0:
            return False, f"Could not checkout {target_branch}: {stderr}"
        
        run_git_command(['git', 'checkout', '-b', temp_branch])
        
        # Attempt merge
        exit_code, stdout, stderr = run_git_command([
            'git', 'merge', '--no-commit', '--no-ff', f'origin/{source_branch}'
        ])
        
        # Check for conflicts
        if exit_code != 0:
            conflict_output = stdout + " " + stderr
            if "CONFLICT" in conflict_output or "conflict" in conflict_output.lower():
                return True, f"Merge conflict detected: {stdout[:200]}..."
            else:
                return False, f"Merge failed for other reasons: {stderr[:200]}..."
        
        return False, "No conflicts detected"
        
    finally:
        # Cleanup
        run_git_command(['git', 'merge', '--abort'])
        run_git_command(['git', 'checkout', 'master'])
        run_git_command(['git', 'branch', '-D', temp_branch])

def post_github_status(conflicts: List[Dict], github_token: str, repo: str) -> None:
    """Post status check for merge queue integration"""
    if not github_token or not repo:
        print("Skipping GitHub status (no token/repo)")
        return
        
    try:
        import requests
        
        sha = os.getenv('GITHUB_SHA', 'HEAD')
        if sha == 'HEAD':
            exit_code, sha, _ = run_git_command(['git', 'rev-parse', 'HEAD'])
            if exit_code != 0:
                return
        
        state = "success" if not conflicts else "failure"
        description = f"No regional conflicts detected" if not conflicts else f"Regional conflicts detected with {len(conflicts)} branches"
        
        url = f"https://api.github.com/repos/{repo}/statuses/{sha}"
        headers = {
            'Authorization': f'Bearer {github_token}',
            'Accept': 'application/vnd.github+json'
        }
        
        data = {
            'state': state,
            'description': description,
            'context': 'Regional Conflict Check',
            'target_url': f"https://github.com/{repo}/actions"
        }
        
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        print(f"Posted GitHub status: {state}")
        
    except Exception as e:
        print(f"Failed to post GitHub status: {e}")

def main():
    print("🚀 Clean POC: Regional Conflict Checker")
    print("=" * 50)
    
    # Get environment variables
    source_branch = os.getenv('HEAD_REF', 'clean-regional-conflict-poc')
    github_token = os.getenv('GITHUB_TOKEN', '')
    repo = os.getenv('GITHUB_REPOSITORY', '')
    pr_number = os.getenv('PR_NUMBER', '')
    event_type = os.getenv('EVENT_TYPE', 'pull_request')
    
    print(f"Source branch: {source_branch}")
    print(f"Event type: {event_type}")
    print(f"PR Number: {pr_number}")
    
    # Get regional branches
    regional_branches = get_regional_branches()
    print(f"Checking {len(regional_branches)} regional branches: {regional_branches}")
    
    # Check for conflicts
    conflicts = []
    for branch in regional_branches:
        if branch == source_branch:
            print(f"Skipping self-check for branch: {branch}")
            continue
            
        has_conflict, details = check_merge_conflict(source_branch, branch)
        
        if has_conflict:
            conflicts.append({'branch': branch, 'details': details})
            print(f"❌ Conflict with {branch}: {details}")
        else:
            print(f"✅ No conflict with {branch}")
    
    # Output results
    results = {
        'has_conflicts': len(conflicts) > 0,
        'conflict_count': len(conflicts),
        'conflicts': conflicts,
        'regional_branches': regional_branches,
        'source_branch': source_branch,
        'event_type': event_type
    }
    
    # Write results
    with open('conflict_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    # Post GitHub status
    if github_token and repo:
        post_github_status(conflicts, github_token, repo)
    
    # Set GitHub Actions outputs
    print(f"::set-output name=has-conflicts::{str(len(conflicts) > 0).lower()}")
    print(f"::set-output name=conflict-count::{len(conflicts)}")
    
    # Summary
    print("\n" + "=" * 50)
    if conflicts:
        print(f"❌ Found {len(conflicts)} regional conflicts")
        print("   This change cannot be merged until conflicts are resolved")
        sys.exit(1)
    else:
        print(f"✅ No merge conflicts found with {len(regional_branches)} regional branches")
        print("   This change is safe to merge!")
        sys.exit(0)

if __name__ == "__main__":
    main()

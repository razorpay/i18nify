#!/usr/bin/env python3
"""
Regional Conflict Checker for i18nify
Detects merge conflicts with regional deployment branches
"""

import os
import sys
import json
import subprocess
from typing import List, Dict, Tuple, Optional

def run_git_command(cmd: List[str]) -> Tuple[int, str, str]:
    """Run a git command and return exit code, stdout, stderr"""
    try:
        result = subprocess.run(
            cmd, 
            capture_output=True, 
            text=True, 
            cwd=os.getcwd()
        )
        return result.returncode, result.stdout.strip(), result.stderr.strip()
    except Exception as e:
        return 1, "", str(e)

def get_regional_branches() -> List[str]:
    """Get list of regional branches to check"""
    # Default regional branches - can be overridden by env var
    default_branches = ["us_release", "singapore_release"]
    
    # Check environment variable for custom branches
    env_branches = os.getenv('TARGET_BRANCHES_INPUT', '')
    if env_branches:
        return [b.strip() for b in env_branches.split(',') if b.strip()]
    
    return default_branches

def check_merge_conflict(source_branch: str, target_branch: str) -> Tuple[bool, str]:
    """Check if merging source into target would cause conflicts"""
    print(f"Checking merge conflict: {source_branch} -> {target_branch}")
    
    # Create a temporary branch for testing
    temp_branch = f"temp-merge-test-{target_branch}"
    
    try:
        # Ensure we have the latest remote branches
        run_git_command(['git', 'fetch', 'origin'])
        
        # Delete temp branch if it exists
        run_git_command(['git', 'branch', '-D', temp_branch])
        
        # Checkout target branch and create temp branch
        exit_code, stdout, stderr = run_git_command(['git', 'checkout', f'origin/{target_branch}'])
        if exit_code != 0:
            return False, f"Could not checkout {target_branch}: {stderr}"
        
        run_git_command(['git', 'checkout', '-b', temp_branch])
        
        # Attempt merge without committing
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
        # Cleanup: abort merge and delete temp branch
        run_git_command(['git', 'merge', '--abort'])
        run_git_command(['git', 'checkout', 'master'])
        run_git_command(['git', 'branch', '-D', temp_branch])

def auto_detect_resolution_prs(github_token: str, repo: str, original_pr: str, conflicting_branches: List[str]) -> List[str]:
    """Auto-detect resolution PRs using GitHub API"""
    try:
        import requests
        
        resolution_prs = []
        
        for branch in conflicting_branches:
            # Search for PRs targeting the regional branch
            url = f"https://api.github.com/repos/{repo}/pulls"
            headers = {
                'Authorization': f'Bearer {github_token}',
                'Accept': 'application/vnd.github+json'
            }
            params = {
                'state': 'open',
                'base': branch
            }
            
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()
            prs = response.json()
            
            # Look for PRs that might be resolutions
            for pr in prs:
                score = calculate_resolution_score(pr, original_pr, branch)
                if score >= 70:  # High confidence threshold
                    resolution_prs.append(str(pr['number']))
                    print(f"Auto-detected resolution PR #{pr['number']} for {branch} (score: {score})")
        
        return resolution_prs
        
    except Exception as e:
        print(f"Failed to auto-detect resolution PRs: {e}")
        return []

def calculate_resolution_score(pr, original_pr, regional_branch) -> int:
    """Calculate confidence score for potential resolution PR"""
    score = 0
    
    # Check branch name patterns (high confidence)
    branch_patterns = [
        f'resolve-conflicts-{regional_branch}-pr-{original_pr}',
        f'fix-conflicts-{regional_branch}-pr-{original_pr}',
        f'auto-resolve-{regional_branch}-pr-{original_pr}'
    ]
    
    if any(pattern in pr['head']['ref'] for pattern in branch_patterns):
        score += 50
    
    # Targets correct regional branch (high confidence)
    if pr['base']['ref'] == regional_branch:
        score += 30
    
    # References original PR (medium confidence)
    if f'#{original_pr}' in (pr['title'] + pr.get('body', '')):
        score += 20
    
    # Contains conflict keywords (medium confidence)
    keywords = ['resolve', 'conflict', 'merge', 'fix']
    if any(keyword in pr['title'].lower() for keyword in keywords):
        score += 15
    
    return score

def post_merge_queue_status(conflicts: List[Dict], github_token: str, repo: str) -> None:
    """Post status check for merge queue integration"""
    try:
        import requests
        
        # Determine status based on conflicts
        if not conflicts:
            state = "success"
            description = "No regional conflicts detected - safe for merge queue"
        else:
            state = "failure" 
            description = f"Regional conflicts detected with {len(conflicts)} branches"
        
        # Get commit SHA
        sha = os.getenv('GITHUB_SHA', 'HEAD')
        if sha == 'HEAD':
            exit_code, sha, _ = run_git_command(['git', 'rev-parse', 'HEAD'])
            if exit_code != 0:
                print("Could not get commit SHA")
                return
        
        # Post status check
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
        print(f"Posted merge queue status: {state}")
        
    except Exception as e:
        print(f"Failed to post merge queue status: {e}")

def main():
    print("🚀 i18nify Regional Conflict Checker POC")
    print("=" * 50)
    
    # Get environment variables
    source_branch = os.getenv('HEAD_REF', 'poc-merge-queue-regional-conflicts')
    github_token = os.getenv('GITHUB_TOKEN', '')
    repo = os.getenv('GITHUB_REPOSITORY', '')
    pr_number = os.getenv('PR_NUMBER', '')
    event_type = os.getenv('EVENT_TYPE', 'pull_request')
    
    print(f"Source branch: {source_branch}")
    print(f"Event type: {event_type}")
    print(f"PR Number: {pr_number}")
    
    # Get regional branches to check
    regional_branches = get_regional_branches()
    print(f"Checking {len(regional_branches)} regional branches: {regional_branches}")
    
    # Check for conflicts with each regional branch
    conflicts = []
    for branch in regional_branches:
        if branch == source_branch:
            print(f"Skipping self-check for branch: {branch}")
            continue
            
        has_conflict, details = check_merge_conflict(source_branch, branch)
        
        if has_conflict:
            conflicts.append({
                'branch': branch,
                'details': details
            })
            print(f"❌ Conflict with {branch}: {details}")
        else:
            print(f"✅ No conflict with {branch}")
    
    # Auto-detect resolution PRs if conflicts exist
    resolution_prs = []
    if conflicts and github_token and repo and pr_number:
        conflicting_branches = [c['branch'] for c in conflicts]
        resolution_prs = auto_detect_resolution_prs(github_token, repo, pr_number, conflicting_branches)
    
    # Output results
    results = {
        'has_conflicts': len(conflicts) > 0,
        'conflict_count': len(conflicts),
        'conflicts': conflicts,
        'regional_branches': regional_branches,
        'resolution_prs': resolution_prs,
        'source_branch': source_branch,
        'event_type': event_type
    }
    
    # Write results to JSON file for workflow
    with open('conflict_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    # Post status for merge queue
    if github_token and repo:
        post_merge_queue_status(conflicts, github_token, repo)
    
    # Set GitHub Actions outputs
    print(f"::set-output name=has-conflicts::{str(len(conflicts) > 0).lower()}")
    print(f"::set-output name=conflict-count::{len(conflicts)}")
    
    # Summary
    print("\n" + "=" * 50)
    if conflicts:
        print(f"❌ Found {len(conflicts)} regional conflicts")
        if resolution_prs:
            print(f"🔍 Auto-detected {len(resolution_prs)} potential resolution PRs: {resolution_prs}")
        print("   This change cannot be merged until conflicts are resolved")
        sys.exit(1)
    else:
        print(f"✅ No merge conflicts found with {len(regional_branches)} regional branches")
        print("   This change is safe to merge!")
        sys.exit(0)

if __name__ == "__main__":
    main()

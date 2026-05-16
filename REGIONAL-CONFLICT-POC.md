# Regional Conflict Resolution POC

A clean demonstration of intelligent regional conflict resolution with GitHub Merge Queue integration.

## 🎯 What This POC Demonstrates

- **Automatic regional conflict detection** across deployment branches
- **GitHub Merge Queue integration** with status API blocking  
- **Intelligent conflict resolution guidance** with specific commands
- **Clean, focused implementation** without unnecessary complexity

## 🏗️ Architecture

### Core Components
1. **`scripts/check_regional_conflicts.py`** - Conflict detection engine
2. **`.github/workflows/regional-conflict-checker.yml`** - GitHub Actions integration
3. **`i18nify-config.json`** - Configuration file for testing conflicts

### Regional Branches (for testing)
- `us_release` - US regional deployment settings
- `singapore_release` - Singapore regional deployment settings

## 🚀 How It Works

1. **PR Created** → Workflow triggers automatically
2. **Conflict Detection** → Checks against all regional branches  
3. **Status Reporting** → Posts GitHub status for merge queue
4. **Resolution Guidance** → Provides specific git commands
5. **Merge Queue Integration** → Blocks until conflicts resolved

## 🧪 Testing

### Local Testing
```bash
# Test the conflict checker
python3 scripts/check_regional_conflicts.py

# With custom branches
export TARGET_BRANCHES_INPUT="us_release,singapore_release"
python3 scripts/check_regional_conflicts.py
```

### GitHub Testing  
1. Create PR from this branch
2. Observe workflow execution
3. See conflict detection in action
4. Review automated PR comments

## ✅ Expected Results

### No Conflicts
- ✅ Green status check
- ✅ Merge queue proceeds
- ✅ Automatic merge allowed

### Conflicts Detected  
- ❌ Red status check
- ❌ Merge queue blocked
- 📝 Detailed PR comment with resolution steps
- 🛠️ Specific git commands provided

## 🎯 Benefits

- **Zero manual intervention** for conflict detection
- **Native merge queue support** for modern CI/CD
- **Developer-friendly guidance** with copy-paste commands
- **Scalable architecture** for enterprise deployments

This POC replaces manual `/merge-conflict-resolved` comments with intelligent automation.

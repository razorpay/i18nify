// refer file: https://gist.github.com/kkemple/998aad9f2b25520c916b00891abb6543
import { danger, fail, warn, markdown } from 'danger';

const {
  generateTableReport,
} = require('./packages/i18nify-js/scripts/bundle-size-report');

const modifiedFiles = danger.git.modified_files;
const newFiles = danger.git.created_files;
const pr = danger.github.pr;

/**
 * Rule: Small pr is suggested.
 * Reason: Pr is not supposed to be very large so it is suggested to keep the pr small.
 *         So it would be easy for reviewer to review and reduce chances of missing bugs.
 *         Warn when there is a big PR
 */
const bigPRThreshold = 600;
if (pr.additions > bigPRThreshold) {
  warn(
    `Your PR has over ${bigPRThreshold} lines of code additions :scream: . Try to breakup into separate PRs :+1:`,
  );
}

/**
 * Rule: 1-2 reviewer is required.
 * Reason: No reviewer tends to leave a PR in a state where nobody is
 *         responsible. Similarly, more than 2 reviewer doesn't clearly state
 *         who is responsible for the review. 2 reviewrs can speed up review as well
 *         as suppose 1 suppose to be primary reviewer and other is secondary reviewer
 */
// Get total reviewers assigned by the user
const requestedReviewers = danger.github.requested_reviewers;
const requestedReviewersCount =
  requestedReviewers.users.length + requestedReviewers.teams.length;
// Get total distinct reviewers who have provided the review
const reviews = danger.github.reviews;
let reviewers = [];
for (let i = 0; i < reviews.length; i++) {
  if (reviews[i].user.type === 'User') {
    if (!reviewers.includes(reviews[i].id)) {
      reviewers.push(reviews[i].id);
    }
  }
}
const reviewersCount = reviewers.length;
// either PR should already be reviewed or reviewers must be added
if (requestedReviewersCount === 0 && reviewersCount === 0) {
  fail(`🕵 Whoops, I don't see any reviewers. Remember to add one.`);
} else if (requestedReviewersCount > 2) {
  warn(
    `It's great to have ${requestedReviewersCount} reviewers. Remember though ` +
      `that more than 2 reviewer may lead to uncertainty as to who is responsible for the review.`,
  );
}

/**
 * Rule: File size should be less than threshold
 * Reason: Aim is to move towards a more modularized code, hence try to break large files in separate functions/components.
 */
const fileSizeThreshold = 300;
for (let file of newFiles) {
  const fileUrl = danger.github.utils.fileLinks([file]);

  danger.git.structuredDiffForFile(file).then((res) => {
    if (res.chunks[0] && res.chunks[0].newLines > fileSizeThreshold) {
      warn(
        `this ${fileUrl} has over ${bigPRThreshold} lines of code additions :scream: . Try to breakup into separate functions/components :+1:`,
      );
    }
  });
}

/**
 * Rule: Warn if package.json is modified
 * Reason: We do not want to increase our bundle size, hence every new lib added needs to be reviewed
 *         by gatekeepers.
 */
const packageFile = modifiedFiles.find((file) => file.includes('package.json'));
if (packageFile) {
  const fileUrl = danger.github.utils.fileLinks([packageFile]);
  warn(
    `**${fileUrl}**: package.json is modified, do get this reviewed by gatekeepers ! 😇`,
  );
}

const showBundleSizeReport = () => {
  markdown(`
## Bundle Size Report

${generateTableReport()}
`);
};

showBundleSizeReport();

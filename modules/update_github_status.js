const { GitHubProfileStatus } = require("github-profile-status");

async function update_github_status(status_str, github_token){
    console.log(github_token, "THIS IS THE TOKEN FROM UPDATE FUNC");
    const profile_status = new GitHubProfileStatus({
        token: process.env.GITHUB_ACCESS_TOKEN,
    });

    await profile_status.update({
        message: status_str,
    });
}

module.exports = update_github_status;
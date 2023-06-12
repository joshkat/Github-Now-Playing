const { GitHubProfileStatus } = require("github-profile-status");

async function update_github_status(status_str, github_token){
    try{
        const profile_status = new GitHubProfileStatus({
            token: github_token,
        });
    
        await profile_status.update({
            message: status_str,
        });
    }catch(err){
        console.log(err);
    }
}

module.exports = update_github_status;
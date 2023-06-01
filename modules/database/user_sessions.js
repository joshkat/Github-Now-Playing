//TODO, update db to include FireStore and load data in @ server start

//user session
/**
 * Will contain objects of format:
 *  {
 *      spotify_refresh:"",
 *      github_auth:"",
 *      spotify_id:"",
 *      state:"" // random str just to identify where to come back to after redirects
 *  }
 */

let user_sessions = [];

function set_user_value(state, key, value){
    if(key === undefined && value === undefined){
        user_sessions.push({
            state: state,
            spotify_refresh: "",
            github_auth:"",
            spotify_id: "",
        });
    }else{
        const index = user_sessions.findIndex( obj => obj.state === state);
        user_sessions[index][key] = value;
    }
}

function get_user(state){
    return user_sessions.find( inner_obj  => inner_obj.state === state);
}

function user_exists(spotify_id){
    if(user_sessions.find( inner => inner.spotify_id === spotify_id) === undefined){
        return false;
    }
    return true;
}

module.exports = {
    set_user_value: set_user_value,
    get_user: get_user,
    user_exists: user_exists, //T or F value will be used to determine if I need to add a new session or not
}

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

function get_user(spotify_id){
    return user_sessions.find( inner_obj  => inner_obj.spotify_id === spotify_id);
}

function get_user_from_state(state){
    return user_sessions.find( inner_obj  => inner_obj.state === state);
}

function user_github_exists(spotify_id){
    if(get_user(spotify_id).github_auth === ""){
        return false;
    }
    return true;
}

function user_id_exists(spotify_id){
    if(user_sessions.find( inner => inner.spotify_id === spotify_id) === undefined){
        return false;
    }
    return true;
}

module.exports = {
    set_user_value: set_user_value,
    get_user: get_user,
    user_github_exists: user_github_exists,
    user_id_exists: user_id_exists,
    get_user_from_state: get_user_from_state
}

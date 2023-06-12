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
            spotify_access: "",
        });
    }else{
        const index = user_sessions.findIndex( obj => obj.state === state);
        user_sessions[index][key] = value;
    }
}

function set_spotify_access(spotify_access, id){
    const index = user_sessions.findIndex( inner_obj => inner_obj.spotify_id === id);
    user_sessions[index].spotify_access = spotify_access;
}

function get_user(spotify_id){
    return user_sessions.find( inner_obj  => inner_obj.spotify_id === spotify_id);
}

function get_user_from_state(state){
    return user_sessions.find( inner_obj  => inner_obj.state === state);
}

function get_spotify_access(id){
    const index = user_sessions.findIndex( inner_obj => inner_obj.spotify_id === id);
    return user_sessions[index].spotify_access;
}

function user_github_exists(spotify_id){
    if(get_user(spotify_id).github_auth === "" || get_user(spotify_id).github_auth === undefined){
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

function remove_user(state){
    //used for when github is denied
    const index_to_remove = user_sessions.findIndex( inner_obj => inner_obj.state === state);
    user_sessions.splice(index_to_remove, 1);
}

module.exports = {
    set_user_value: set_user_value,
    set_spotify_access: set_spotify_access,
    get_user: get_user,
    get_user_from_state: get_user_from_state,
    get_spotify_access: get_spotify_access,
    user_github_exists: user_github_exists,
    user_id_exists: user_id_exists,
    remove_user: remove_user,
}

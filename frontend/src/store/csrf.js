import Cookies from 'js-cookie';

export async function csrfFetch(url,options={}){
    try{
        options.method = options.method || 'GET';
        options.headers = options.headers || {};
        if(options.method.toUpperCase()!=='GET'){
            options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
            options.headers['XSRF-Token'] = Cookies.get('XSRF-TOKEN');
        }
        const res = await window.fetch(url,options);
        if(res.status >= 400) throw res
        return res;
    }catch(error){
        const err = {
            message: 'error in csrfFetch function frontend/store/csrf.js file',
            error: error
        }
        throw err
    }
}

export function restoreCSRF(){
    return csrfFetch('/api/csrf/restore')
}

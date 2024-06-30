import Cookies from 'js-cookie';

export async function csrfFetch(url,options={}){
        options.method = options.method || 'GET';
        options.headers = options.headers || {};
        if(options.method.toUpperCase()!=='GET'){
            options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
            options.headers['XSRF-Token'] = Cookies.get('XSRF-TOKEN');
        }
        return await window.fetch(url,options);
}

export function restoreCSRF(){
    return csrfFetch('/api/csrf/restore')
}

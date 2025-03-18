import { HttpInterceptorFn } from '@angular/common/http';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if(token){
    console.log(JSON.parse(atob(token.split('.')[1]))); // should be removed  
    const clonedReq = req.clone ({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq)
  }
  
  return next(req);
};

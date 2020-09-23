import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpParams, HttpRequest} from '@angular/common/http';
import {exhaustMap, take} from 'rxjs/operators';
import {UserService} from './user.service';

/**
 * Will be run before any request and will add header if needed
 */
@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private userService: UserService) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.userService.currentUser.pipe(
      take(1),
      exhaustMap(user => {
        console.log(user);
      // if we don't have user than send origin request without modification
        if (!user) {
          return next.handle(req);
        }

        // add token to auth header and removing double quotes for this token...
        const modifiedReq = req.clone(
          {headers: new HttpHeaders().set('authorization', 'Bearer ' + user.replace(/['"]+/g, ''))});
        return next.handle(modifiedReq);
      }));
  }
}

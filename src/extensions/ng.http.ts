import { Injectable } from '@angular/core';
import { Http, Headers, Request, RequestOptionsArgs, Response, ConnectionBackend, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { LocalStorageService } from 'angular-2-local-storage';

@Injectable()
export class NgHttp extends Http {
  private static AUTH_TOKEN = '_http_auth_token';
  public static token: string;

  /**
   * Save token to Storage
   * @param storage LocalStorageService
   * @param token string
   */
  public static updateRequestToken(storage: LocalStorageService, token: string): boolean {
    return storage.set(NgHttp.AUTH_TOKEN, token);
  }

  /**
   * Fetch token from Storage
   * @param storage LocalStorageService
   */
  public static getToken(storage: LocalStorageService): string {
    return storage.get<string>(NgHttp.AUTH_TOKEN);
  }

  /**
   * Check if token is set
   * @param storage LocalStorageService
   */
  public static authTokenExists(storage: LocalStorageService): boolean {
    return NgHttp.getToken(storage) !== '';
  }

  /**
   * Class Constructor
   *
   * @param backend ConnectionBackend
   * @param defaultOptions RequestOptions
   * @param storage LocalStorageService
   */
  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, private storage?: LocalStorageService) {
    super(backend, defaultOptions);
    if (this.storage !== null && this.storage !== undefined) {
      NgHttp.token = this.storage.get<string>(NgHttp.AUTH_TOKEN);
    }
  }

  /**
   * @param url string|Request
   * @param options RequestOptionsArgs
   */
  public request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return super.request(url, this.attachToken(options));
  }

  /**
   * @param url string
   * @param options RequestOptionsArgs
   */
  public get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return super.get(url, this.attachToken(options));
  }

  /**
   * @param url string
   * @param payload any
   * @param options RequestOptionsArgs
   */
  public post(url: string, payload: any, options?: RequestOptionsArgs): Observable<Response> {
    return super.post(url, this.attachToken(options));
  }

  /**
   * Append token to headers
   * @param options RequestOptionsArgs
   */
  private attachToken(options?: RequestOptionsArgs): RequestOptionsArgs {
    if (null !== NgHttp.token) {
      if (!this.isDefined(options)) {
        options = this.getDefaultOptions();
      }

      if (!this.isDefined(options.headers)) {
        options.headers = new Headers();
      }

      // TODO: Make this pattern configurable
      options.headers.append('Authorization', `Bearer ${NgHttp.token}`);
    }

    return options;
  }

  /**
   * Check if a variable is defined
   * @param what any
   */
  private isDefined(what?: any): boolean {
    return [null, undefined].indexOf(what) === -1;
  }

  /**
   * Get dfefault Request Optionss
   */
  protected getDefaultOptions(): RequestOptions {
    // TODO: Make this Configurable
    const headers: Headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });

    return options;
  }
}

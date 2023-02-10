# core-util-api

## Description

A collection of utilities to create remote connections to a server via API services.

## APIService

The `ApiService` is an abstract class so in order to use it you must extend it.

### How to use

Create a feature service that extends `ApiService`.

> `<T>` refers to the main feature model item used inside applications.  
> `<P>` refers to the type description of the passed parameters to API call methods. These parameters are the usual option to pass configuration with the REST call.  
> For example for filtering results, paginate or ordering data.

```typescript
@Injectable({
  providedIn: 'root',
})
export class FeatureApiService extends ApiService<Feature, FeatureApiParams> {
  // Implement this method in child classes to have the feature resource URL segment name.
  protected resourceUrlSegment(): string {
    return 'feature';
  }

  // you must override the concrete mapping logic on GET a list,
  // between the API response object and the internal blueprint
  // used to work with the feature model.
  protected override mapListResponse({
    collection: {
      items,
    },
  }: FeatureApiResponse): Feature {
    return ...
  }
}

```

- Use it wherever is needed, for example with `@ngrx effects`:

```typescript
@Injectable()
export class FeatureEffects {
  private readonly actions$ = inject(Actions);
  private readonly featureService = inject(FeatureService);

  load$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FeatureActions.loadFeature),
      exhaustMap(({ params }) =>
        this.featureService.getList(params).pipe(
          map(({ items }) => FeatureActions.loadFeatureSuccess({ items })),
          catchError(error => of(FeatureActions.loadFeatureFailure({ error }))),
        ),
      ),
    );
  });
}
```

## Running unit tests

Run `nx test core-util-api` to execute the unit tests.

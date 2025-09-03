import { Observable, map, interval } from "rxjs";

const take =
  <T, R>(amount: number) =>
  (source: Observable<T>) =>
    new Observable<R>((subscriber) => {
      // TODO

      const subscription = source.subscribe({
        next: (v) => {
          // TODO
        },
        error: (e) => subscriber.error(e),
        complete: () => subscriber.complete(),
      });

      return () => {
        // TODO
      };
    });

const multipliedBy2$ = interval(200).pipe(
  map((v) => v * 2),
  take(10)
);

multipliedBy2$.subscribe((r) => {
  console.log(r);
});

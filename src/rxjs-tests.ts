import { Observable, map, interval } from "rxjs";

const take =
  <T>(amount: number) =>
  (source: Observable<T>) =>
    new Observable<T>((subscriber) => {
      let count = 0;

      const subscription = source.subscribe({
        next: (v) => {
          subscriber.next(v);
          count++;
          if (count === amount) {
            subscriber.complete();
          }
        },
        error: (e) => subscriber.error(e),
        complete: () => subscriber.complete(),
      });

      return () => subscription.unsubscribe();
    });

const multipliedBy2$ = interval(200).pipe(
  map((v) => v * 2),
  take(10)
);

multipliedBy2$.subscribe((r) => {
  console.log(r);
});

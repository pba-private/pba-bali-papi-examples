import { Observable } from "rxjs";

const myObservable$ = new Observable<number>((subscriber) => {
  let number = 0;
  const token = setInterval(() => {
    number++;
    subscriber.next(number);

    if (number === 10) {
      clearInterval(token);
      subscriber.complete();
    }
  }, 200);

  subscriber.next(number);

  return () => {
    clearInterval(token);
  };
});

myObservable$.subscribe((res) => {
  console.log("sub1", res);
});

setTimeout(() => {
  myObservable$.subscribe((res) => {
    console.log("sub2", res);
  });
}, 500);

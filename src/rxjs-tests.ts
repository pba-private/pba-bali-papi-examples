import { Observable, Subject } from "rxjs";

/** Producer */
const subject = new Subject<number>();

let number = 0;
const token = setInterval(() => {
  number++;
  subject.next(number);

  if (number === 10) {
    clearInterval(token);
    subject.complete();
  }
}, 200);

const myObservable$ = new Observable<number>((subscriber) => {
  subscriber.next(number);

  subject.subscribe((newNumber) => subscriber.next(newNumber));

  return () => {
    clearInterval(token);
  };
});

/** Consumer */

myObservable$.subscribe((res) => {
  console.log("sub1", res);
});

setTimeout(() => {
  myObservable$.subscribe((res) => {
    console.log("sub2", res);
  });
}, 500);

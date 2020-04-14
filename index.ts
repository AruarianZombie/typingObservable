import { of, Observable, BehaviorSubject, fromEvent, timer, merge, interval,  } from 'rxjs'; 
import { map, filter, switchMap, takeUntil, mergeMap, repeat, timeoutWith, delay, tap, repeatWhen, skip } from 'rxjs/operators';

let expression: RegExp = /(?:)/;

const gothamCharacters$: Observable<Array<string>> = of([
  'Batman',
  'Joker',
  'Harley Queen',
  'Robin',
  'Catwoman'
]).pipe(
  delay(3000),
);

const searcherElement = document.getElementById('searcher');

searcherElement.addEventListener('keyup', onKeyUpSeacher, false);

const typingSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

const typing$: Observable<string> = typingSubject.asObservable().pipe(
  filter(t => t != null)
);

function onKeyUpSeacher(e): void {
  const value: string = (<HTMLInputElement>searcherElement).value;
  typingSubject.next(value);
}

const test$: Observable<any> = typing$.pipe(
  tap((text: string) => {
    expression = new RegExp(`${text}.*`, 'i');
    console.log(expression);
  }),
  repeatWhen(() => typing$),
  timeoutWith(3000, gothamCharacters$.pipe(
    map((items: Array<string>) => {
      console.log('gotham ')
      return items.filter(i => expression.test(i))
    }),
  )),
  repeatWhen(() => typing$),
  skip(1),
  tap((x) => {
    console.log('algo esta regresando test$');
    console.log(x);
  }),
  filter((x) => Array.isArray(x))
)

/*typing$.subscribe({
  next: (search: string) => {
    console.log(`User is typing ${search}`)
  }
});*/

test$.subscribe({
  next: (items: Array<string>) => {
    console.log('test$ is emmiting');
    console.log(items);
  }
})

const mouseDown$ = fromEvent(document, 'mousedown');

const mouseUp$ = fromEvent(document, 'mouseup');

const mouseMove$ = fromEvent(document, 'mousemove');

const timer$ = timer(2000);

const mouseHolds$: Observable<any> = mouseDown$.pipe(
  switchMap((downEvent) => {
    console.log('downEvent');
    //console.log(downEvent);
    return timer$.pipe(
      switchMap((time) => {
        return of('HOLD');
      })
    )
  }),
  takeUntil(merge(mouseUp$, mouseMove$)),
  repeat()
);

/*mouseHolds$.subscribe({
  next: (dsd) => {
    console.log('something is happening');
    console.log(dsd);
  }
});

mouseUp$.subscribe((ddsd) => {
  console.log(ddsd);
  console.log('mouseup alv')
});

mouseMove$.subscribe((x) => {
  console.log(x);
  console.log('mouse move alv')
})*/

const seconds$ = interval(1000);
const minutes$ = interval(5000);

/*seconds$.pipe(
  timeoutWith(900, minutes$)
).subscribe(
  value => console.log(value),
  err => console.log(err)
);*/